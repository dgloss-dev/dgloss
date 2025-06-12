import { Stack } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

import { DglossAppRunner } from '../resources/apprunner';
import { ECRPipeline } from '../resources/codebuild';
import { SSM } from '../resources/ssm';

import { VPCStackProps } from '../resources/lib';

import { Config } from '../src/interfaces';

interface ServerDeploymentStackProps extends VPCStackProps {
  sgApp: SecurityGroup;
  buckets: Bucket[];
  userPool: UserPool;
}

export class ServerDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: ServerDeploymentStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';

    const config: Config = require(`../config/${environment}-config.json`);

    const {
      jwtSecret,
      jwtRefreshTokenExp,
      jwtAccessTokenExp,
      dbHost,
      dbReplicaHost,
      dbPort,
      dbName,
      dbUser,
      dbPasswordArn,
      userPoolId,
      userPoolClientId,
      amplifyHomeUrl,
      appLiveUrl,
      emailAlertsValue,
    } = SSM(this);

    const dbPassword = Secret.fromSecretCompleteArn(
      this,
      `RDSSecretServerImport-${environment}`,
      dbPasswordArn.stringValue,
    );

    const vpc = props?.vpc;

    if (vpc && config.parameters) {
      const buildProject = new ECRPipeline(this, {
        vpc,
        environment,
        gitRepo: config.parameters.gitRepo,
      });

      new DglossAppRunner(this, {
        vpc,
        environment,
        emailAlertsValue,
        ecrRepository: buildProject.getECRRepository,
        buckets: props.buckets,
        userPool: props.userPool,
        sgApp: props.sgApp,
        serverPort: config.parameters.serverPort,
        appEnvVariables: {
          amplifyHomeUrl,
          appLiveUrl,
          jwtSecret,
          jwtAccessTokenExp,
          jwtRefreshTokenExp,
          dbPassword,
          dbUser,
          dbPort,
          dbHost,
          dbReplicaHost,
          dbName,
          userPoolId,
          userPoolClientId,
        },
      });
    }
  }
}
