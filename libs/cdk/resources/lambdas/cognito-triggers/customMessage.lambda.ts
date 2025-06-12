import { CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IStringParameter } from 'aws-cdk-lib/aws-ssm';

import { SESPolicy, SSMPolicy } from '../../policies';

interface Envs {
  apiUrl: IStringParameter;
  amplifyHomeUrl: IStringParameter;
  appLiveUrl?: IStringParameter;
  internalApiKey: IStringParameter;
  emailSender: string;
}

export const CustomMessageLambda = (
  stack: Stack,
  environment: string,
  environmentVariables: Envs,
) => {
  const { apiUrl, appLiveUrl, amplifyHomeUrl, internalApiKey, emailSender } = environmentVariables;

  if (!amplifyHomeUrl) {
    throw new Error('APP_AMPLIFY_URL is not defined');
  }

  if (!apiUrl) {
    throw new Error('API_URL is not defined');
  }

  if (!internalApiKey) {
    throw new Error('INTERNAL_API_KEY is not defined');
  }

  if (!emailSender) {
    throw new Error('EMAIL_SOURCE is not defined');
  }

  const customMessageLambdaFn = new NodejsFunction(stack, `CustomMessageLambda-${environment}`, {
    entry: 'src/lambdas/cognito-triggers/custom-message-lambda.ts',
    handler: 'handler',
    runtime: Runtime.NODEJS_LATEST,
    timeout: Duration.seconds(30),
    memorySize: 512,
    environment: {
      API_URL: apiUrl.stringValue,
      APP_URL: amplifyHomeUrl.stringValue,
      INTERNAL_API_KEY: internalApiKey.stringValue,
      APP_LIVE_URL: appLiveUrl?.stringValue || '',
      EMAIL_SOURCE: emailSender,
      EMAIL_SOURCE_ARN: `arn:aws:ses:${stack.region}:${stack.account}:identity/${emailSender}`,
    },
  });

  customMessageLambdaFn.role?.addToPrincipalPolicy(
    SSMPolicy([`arn:aws:ssm:${stack.region}:${stack.account}:parameter/${environment}/db-*`]),
  );

  customMessageLambdaFn.role?.addToPrincipalPolicy(
    SESPolicy([`arn:aws:ses:${stack.region}:${stack.account}:identity/*`]),
  );

  new CfnOutput(stack, `CustomMessageLambdaFn-${environment}`, {
    value: customMessageLambdaFn.functionName,
  });

  return customMessageLambdaFn;
};
