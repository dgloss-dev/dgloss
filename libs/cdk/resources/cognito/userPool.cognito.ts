import { CfnOutput, Stack } from 'aws-cdk-lib';
import { CognitoUserPoolsAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import {
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
  UserPoolOperation,
  FeaturePlan,
  UserPoolEmail,
} from 'aws-cdk-lib/aws-cognito';
import { IStringParameter } from 'aws-cdk-lib/aws-ssm';

import { CustomMessageLambda, PreAuthLambda, PostAuthLambda, PostConfirmLambda } from '../lambdas';

import { VPCStackProps } from '../lib';

interface Envs {
  apiUrl: IStringParameter;
  amplifyHomeUrl: IStringParameter;
  appLiveUrl?: IStringParameter;
  internalApiKey: IStringParameter;
  emailSender: string;
  emailSenderDomain: string;
}

interface Props extends VPCStackProps {
  name: string;
  clientName: string;
  operatorGroupName: string;
  supervisorGroupName: string;
  environmentVariables: Envs;
}

export class CognitoUserPool {
  private userPool: UserPool;
  private client: UserPoolClient;

  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  public createAuthorizer(authorizerName: string) {
    return new CognitoUserPoolsAuthorizer(this.stack, authorizerName, {
      authorizerName,
      cognitoUserPools: [this.userPool],
      identitySource: 'method.request.header.Authorization',
    });
  }

  public get getUserPool() {
    return this.userPool;
  }

  private initialize() {
    this.createUserPool();
    this.createAppClient();
    this.createGroups();
    // this.createTriggers();
  }

  private createUserPool() {
    const { emailSender, emailSenderDomain } = this.props.environmentVariables;
    this.userPool = new UserPool(this.stack, this.props.name, {
      userPoolName: this.props.name,
      featurePlan: this.props.environment !== 'dev' ? FeaturePlan.PLUS : FeaturePlan.ESSENTIALS,
      selfSignUpEnabled: false,
      signInAliases: {
        username: true,
        email: true,
      },
      passwordPolicy: {
        minLength: 12,
        requireDigits: true,
        requireLowercase: true,
        requireSymbols: true,
        requireUppercase: true,
      },
      deviceTracking: {
        challengeRequiredOnNewDevice: true,
        deviceOnlyRememberedOnUserPrompt: true,
      },
      // email: UserPoolEmail.withSES({
      //   fromEmail: emailSender,
      //   sesVerifiedDomain: emailSenderDomain,
      //   sesRegion: this.stack.region,
      // }),
    });

    new CfnOutput(this.stack, `UserPoolId-${this.props.environment}`, {
      value: this.userPool.userPoolId,
      exportName: `UserPoolId-${this.stack.region}-${this.props.environment}`,
    });
  }

  private createAppClient() {
    this.client = this.userPool.addClient(this.props.clientName, {
      userPoolClientName: this.props.clientName,
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
      preventUserExistenceErrors: true,
    });

    new CfnOutput(this.stack, `UserPoolClientId-${this.props.environment}`, {
      value: this.client.userPoolClientId,
      exportName: `UserPoolClientId-${this.stack.region}-${this.props.environment}`,
    });
  }

  private createGroups() {
    new CfnUserPoolGroup(this.stack, this.props.operatorGroupName, {
      groupName: this.props.operatorGroupName,
      userPoolId: this.userPool.userPoolId,
    });
    new CfnUserPoolGroup(this.stack, this.props.supervisorGroupName, {
      groupName: this.props.supervisorGroupName,
      userPoolId: this.userPool.userPoolId,
    });
  }

  // private createTriggers() {
  //   const { apiUrl, appLiveUrl, amplifyHomeUrl, internalApiKey, emailSender } =
  //     this.props.environmentVariables;

  //   this.userPool.addTrigger(
  //     UserPoolOperation.PRE_AUTHENTICATION,
  //     PreAuthLambda(this.stack, this.props.environment, {
  //       apiUrl,
  //       internalApiKey,
  //     }),
  //   );

  //   this.userPool.addTrigger(
  //     UserPoolOperation.POST_AUTHENTICATION,
  //     PostAuthLambda(this.stack, this.props.environment, {
  //       apiUrl,
  //       internalApiKey,
  //     }),
  //   );

  //   this.userPool.addTrigger(
  //     UserPoolOperation.POST_CONFIRMATION,
  //     PostConfirmLambda(this.stack, this.props.environment, {
  //       apiUrl,
  //       internalApiKey,
  //     }),
  //   );

  //   this.userPool.addTrigger(
  //     UserPoolOperation.CUSTOM_MESSAGE,
  //     CustomMessageLambda(this.stack, this.props.environment, {
  //       apiUrl,
  //       amplifyHomeUrl,
  //       appLiveUrl,
  //       internalApiKey,
  //       emailSender,
  //     }),
  //   );
  // }
}
