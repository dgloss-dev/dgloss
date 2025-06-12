import { Duration, Stack } from "aws-cdk-lib";
import {
  Alarm,
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";
import { Subscription, SubscriptionProtocol, Topic } from "aws-cdk-lib/aws-sns";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { IStringParameter } from "aws-cdk-lib/aws-ssm";
import { CfnWebACL, CfnWebACLAssociation } from "aws-cdk-lib/aws-wafv2";

import {
  HealthCheck,
  Secret,
  Service,
  Source,
  VpcConnector,
} from "@aws-cdk/aws-apprunner-alpha";

import { VPCStackProps } from "../lib";
import { SchedulerPolicy } from "../policies";

interface Props extends VPCStackProps {
  emailAlertsValue: string;
  ecrRepository: Repository;
  buckets: Bucket[];
  userPool: UserPool;
  sgApp: SecurityGroup;
  serverPort: number;
  appEnvVariables: {
    amplifyHomeUrl: IStringParameter;
    appLiveUrl?: IStringParameter;
    jwtSecret: IStringParameter;
    jwtRefreshTokenExp: IStringParameter;
    jwtAccessTokenExp: IStringParameter;
    dbPassword: ISecret;
    dbHost: IStringParameter;
    dbReplicaHost: IStringParameter;
    dbPort: IStringParameter;
    dbUser: IStringParameter;
    dbName: IStringParameter;
    userPoolId: IStringParameter;
    userPoolClientId: IStringParameter;
  };
}

export class DglossAppRunner {
  private appRunnerService: Service;
  private appRunnerWebAcl: CfnWebACL;
  private vpcConnector: VpcConnector;
  private role: Role;

  constructor(private readonly stack: Stack, private readonly props: Props) {
    this.initialize();
  }

  private initialize() {
    this.createVPCConnector();
    this.createService();

    if (this.props.environment !== "dev") {
      this.createWAF();
      this.attachWAF();
      this.createFailureAlert();
    }
  }

  private createVPCConnector() {
    this.vpcConnector = new VpcConnector(
      this.stack,
      `DglossVPCConnector-${this.props.environment}`,
      {
        vpc: this.props.vpc,
        securityGroups: [this.props.sgApp],
      }
    );
  }

  private createService() {
    const {
      amplifyHomeUrl,
      appLiveUrl,
      jwtSecret,
      jwtAccessTokenExp,
      jwtRefreshTokenExp,
      dbPassword,
      dbHost,
      dbReplicaHost,
      dbUser,
      dbPort,
      dbName,
      userPoolId,
      userPoolClientId,
    } = this.props.appEnvVariables;

    this.createInstanceRole();
    this.grantPermissions();

    this.appRunnerService = new Service(
      this.stack,
      `DglossAppRunner-${this.props.environment}`,
      {
        source: Source.fromEcr({
          imageConfiguration: {
            port: this.props.serverPort,
            environmentVariables: {
              APP_REGION: this.stack.region,
              APP_ACCOUNT_ID: this.stack.account,
            },
            environmentSecrets: {
              APP_HOME_URL: Secret.fromSsmParameter(amplifyHomeUrl),

              // In case of no live url, pass the same amplify URL so apprunner deployment would be straightforward
              // for all environments
              APP_LIVE_URL: Secret.fromSsmParameter(
                appLiveUrl || amplifyHomeUrl
              ),
              JWT_SECRET: Secret.fromSsmParameter(jwtSecret),
              JWT_ACCESS_TOKEN_EXPIRATION:
                Secret.fromSsmParameter(jwtAccessTokenExp),
              JWT_REFRESH_TOKEN_EXPIRATION:
                Secret.fromSsmParameter(jwtRefreshTokenExp),
              DB_PASSWORD: Secret.fromSecretsManager(dbPassword, "password"),
              DB_HOST: Secret.fromSsmParameter(dbHost),
              DB_REPLICA_HOST: Secret.fromSsmParameter(dbReplicaHost),
              DB_PORT: Secret.fromSsmParameter(dbPort),
              DB_USER: Secret.fromSsmParameter(dbUser),
              DB_NAME: Secret.fromSsmParameter(dbName),
              USER_POOL_ID: Secret.fromSsmParameter(userPoolId),
              USER_POOL_CLIENT_ID: Secret.fromSsmParameter(userPoolClientId),
            },
          },
          repository: this.props.ecrRepository,
          tagOrDigest: "latest",
        }),
        vpcConnector: this.vpcConnector,
        autoDeploymentsEnabled: true,
        healthCheck: HealthCheck.http({
          healthyThreshold: 5,
          interval:
            this.props.environment === "dev"
              ? Duration.seconds(20)
              : Duration.seconds(5),
          path: "/api/health",
          timeout: Duration.seconds(10),
          unhealthyThreshold: 10,
        }),
        instanceRole: this.role,
      }
    );
  }

  private createInstanceRole() {
    this.role = new Role(
      this.stack,
      `DglossAppRunnerBuildRole-${this.props.environment}`,
      {
        assumedBy: new ServicePrincipal("tasks.apprunner.amazonaws.com"),
      }
    );

    this.role.addToPolicy(
      new PolicyStatement({
        actions: [
          "apigateway:POST",
          "apigateway:DELETE",
          "apigateway:GET",
          "apigateway:PUT",
        ],
        resources: [
          `arn:aws:apigateway:${this.stack.region}::/apikeys`,
          `arn:aws:apigateway:${this.stack.region}::/apikeys/*`,
          `arn:aws:apigateway:${this.stack.region}::/usageplans`,
          `arn:aws:apigateway:${this.stack.region}::/usageplans/*`,
          `arn:aws:apigateway:${this.stack.region}::/usageplans/*/keys`,
        ],
      })
    );
  }

  private grantPermissions() {
    Object.values(this.props.appEnvVariables).forEach((env) => {
      env?.grantRead(this.role);
    });

    this.props.buckets.forEach((bucket) => {
      bucket.grantReadWrite(this.role);
      bucket.grantPut(this.role);
    });

    this.props.userPool.grant(this.role, "cognito-idp:*");

    // Add EventBridge Scheduler permissions
    this.role.addToPolicy(SchedulerPolicy(["*"]));
  }

  private createWAF() {
    this.appRunnerWebAcl = new CfnWebACL(
      this.stack,
      `DglossAppRunnerWebAcl-${this.props.environment}`,
      {
        name: `apprunner-web-acl-${this.props.environment}`,
        scope: "REGIONAL",
        defaultAction: { allow: {} },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: `AppRunnerWebAcl-${this.props.environment}`,
          sampledRequestsEnabled: true,
        },
        rules: [
          {
            name: "AWS-AWSManagedRulesCommonRuleSet",
            priority: 1,
            statement: {
              managedRuleGroupStatement: {
                name: "AWSManagedRulesCommonRuleSet",
                vendorName: "AWS",
              },
            },
            overrideAction: { none: {} },
            visibilityConfig: {
              cloudWatchMetricsEnabled: true,
              metricName: "AWS-AWSManagedRulesCommonRuleSet",
              sampledRequestsEnabled: true,
            },
          },
        ],
      }
    );
  }

  private attachWAF() {
    new CfnWebACLAssociation(
      this.stack,
      `DglossAppRunnerWafAssociation-${this.props.environment}`,
      {
        resourceArn: this.appRunnerService.serviceArn,
        webAclArn: this.appRunnerWebAcl.attrArn,
      }
    );
  }

  private createFailureAlert() {
    const alertTopic = new Topic(
      this.stack,
      `AppRunnerHealthCheckAlertTopic-${this.props.environment}`,
      {
        displayName: `AppRunner Health Check Alert-${this.props.environment}`,
      }
    );

    const healthCheckAlarm = new Alarm(
      this.stack,
      `AppRunnerHealthCheckAlarm-${this.props.environment}`,
      {
        alarmName: `AppRunnerHealthCheckAlarm-${this.props.environment}`,
        metric: new Metric({
          namespace: "AWS/AppRunner",
          metricName: "HealthCheckFailed",
          dimensionsMap: {
            ServiceName: this.appRunnerService.serviceName,
          },
        }),
        evaluationPeriods: 3,
        threshold: 1,
        comparisonOperator:
          ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
        treatMissingData: TreatMissingData.NOT_BREACHING,
        alarmDescription:
          "Alarm if AppRunner health check fails multiple times",
      }
    );

    new Subscription(
      this.stack,
      `AppRunnerAlarmSubscription-${this.props.environment}`,
      {
        topic: alertTopic,
        protocol: SubscriptionProtocol.EMAIL,
        endpoint: this.props.emailAlertsValue,
      }
    );

    healthCheckAlarm.addAlarmAction(new SnsAction(alertTopic));
  }
}
