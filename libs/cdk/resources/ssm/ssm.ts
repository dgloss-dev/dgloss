import { Stack } from 'aws-cdk-lib';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

import { Config } from '../../src/interfaces';

export const SSM = (stack: Stack) => {
  const environment = process.env.ENVIRONMENT || 'dev';
  const config: Config = require(`../../config/${environment}-config.json`);

  const dbName = StringParameter.fromStringParameterAttributes(stack, 'DbNameParameter', {
    parameterName: config.parameters.database.DB_NAME,
  });

  const dbUser = StringParameter.fromStringParameterAttributes(stack, 'DbUserParameter', {
    parameterName: config.parameters.database.DB_USER,
  });

  const dbHost = StringParameter.fromStringParameterAttributes(stack, 'DbHostParameter', {
    parameterName: config.parameters.database.DB_HOST,
  });

  const dbReplicaHost = StringParameter.fromStringParameterAttributes(
    stack,
    'DbReplicaHostParameter',
    {
      parameterName: config.parameters.database.DB_REPLICA_HOST,
    },
  );

  const dbPort = StringParameter.fromStringParameterAttributes(stack, 'DbPortParameter', {
    parameterName: config.parameters.database.DB_PORT,
  });

  const dbPasswordArn = StringParameter.fromStringParameterAttributes(
    stack,
    'DbPasswordArnParameter',
    {
      parameterName: config.parameters.database.DB_PASSWORD_ARN,
    },
  );

  const jwtSecret = StringParameter.fromStringParameterAttributes(stack, 'JwtSecret', {
    parameterName: config.parameters.application.JWT_SECRET,
  });

  const jwtAccessTokenExp = StringParameter.fromStringParameterAttributes(
    stack,
    'JwtAccessTokenExp',
    {
      parameterName: config.parameters.application.JWT_ACCESS_TOKEN_EXPIRATION,
    },
  );

  const jwtRefreshTokenExp = StringParameter.fromStringParameterAttributes(
    stack,
    'JwtRefreshTokenExp',
    {
      parameterName: config.parameters.application.JWT_REFRESH_TOKEN_EXPIRATION,
    },
  );

  const userPoolId = StringParameter.fromStringParameterAttributes(stack, 'UserPoolIdParameter', {
    parameterName: config.parameters.application.USER_POOL_ID,
  });

  const userPoolClientId = StringParameter.fromStringParameterAttributes(
    stack,
    'UserPoolClientIdParameter',
    {
      parameterName: config.parameters.application.USER_POOL_CLIENT_ID,
    },
  );

  const internalApiKey = StringParameter.fromStringParameterAttributes(
    stack,
    'InternalApiKeyParameter',
    {
      parameterName: config.parameters.application.INTERNAL_API_KEY,
    },
  );

  let appLiveUrl;
  // Uncomment when available
  // if (environment === 'prod') {
  //   appLiveUrl = StringParameter.fromStringParameterAttributes(
  //     stack,
  //     `AppLiveUrlParameter-${environment}`,
  //     {
  //       parameterName: config.parameters.application.APP_LIVE_URL!,
  //     },
  //   );
  // }

  const amplifyHomeUrl = StringParameter.fromStringParameterAttributes(
    stack,
    `AmplifyHomeUrlParameter-${environment}`,
    {
      parameterName: config.parameters.application.APP_AMPLIFY_URL,
    },
  );

  const localHomeUrl = StringParameter.fromStringParameterAttributes(
    stack,
    `LocalHomeUrlParameter-${environment}`,
    {
      parameterName: config.parameters.application.APP_LOCAL_URL,
    },
  );

  const apiUrl = StringParameter.fromStringParameterAttributes(
    stack,
    `ApiUrlParameter-${environment}`,
    {
      parameterName: config.parameters.application.API_URL,
    },
  );

  const voiceDataDistribution = StringParameter.fromStringParameterAttributes(
    stack,
    `VoiceDataDistributionParameter-${environment}`,
    {
      parameterName: config.parameters.application.VOICE_DATA_DISTRIBUTION,
    },
  );

  const emailSenderValue = StringParameter.fromStringParameterAttributes(
    stack,
    `EmailSenderParameter-${environment}`,
    {
      parameterName: config.parameters.email.EMAIL_SENDER,
    },
  ).stringValue;

  const emailAlertsValue = StringParameter.fromStringParameterAttributes(
    stack,
    `EmailAlertsParameter-${environment}`,
    {
      parameterName: config.parameters.email.EMAIL_ALERTS,
    },
  ).stringValue;

  return {
    jwtSecret,
    jwtAccessTokenExp,
    jwtRefreshTokenExp,
    dbHost,
    dbReplicaHost,
    dbPort,
    dbUser,
    dbName,
    dbPasswordArn,
    userPoolId,
    userPoolClientId,
    internalApiKey,
    appLiveUrl,
    amplifyHomeUrl,
    localHomeUrl,
    apiUrl,
    voiceDataDistribution,
    emailSenderValue,
    emailAlertsValue,
  };
};

export const generateSSMParameter = (stack: Stack, key: string, value: string) => {
  const ssmParameter = new StringParameter(stack, key, {
    parameterName: key,
    stringValue: value,
  });

  return ssmParameter;
};
