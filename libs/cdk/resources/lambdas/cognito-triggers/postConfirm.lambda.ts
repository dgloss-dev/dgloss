import { CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IStringParameter } from 'aws-cdk-lib/aws-ssm';

import { SSMPolicy } from '../../policies';

interface Envs {
  apiUrl: IStringParameter;
  internalApiKey: IStringParameter;
}

export const PostConfirmLambda = (
  stack: Stack,
  environment: string,
  environmentVariables: Envs,
) => {
  const { apiUrl, internalApiKey } = environmentVariables;

  if (!apiUrl) {
    throw new Error('API_URL is not defined');
  }

  if (!internalApiKey) {
    throw new Error('INTERNAL_API_KEY is not defined');
  }

  const postConfirmLambdaFn = new NodejsFunction(stack, `postConfirmLambda-${environment}`, {
    entry: 'src/lambdas/cognito-triggers/post-confirm-lambda.ts',
    handler: 'handler',
    runtime: Runtime.NODEJS_LATEST,
    timeout: Duration.seconds(30),
    memorySize: 512,
    environment: {
      API_URL: apiUrl.stringValue,
      INTERNAL_API_KEY: internalApiKey.stringValue,
    },
  });

  postConfirmLambdaFn.role?.addToPrincipalPolicy(
    SSMPolicy([`arn:aws:ssm:${stack.region}:${stack.account}:parameter/${environment}/db-*`]),
  );

  new CfnOutput(stack, `PostConfirmLambdaFn-${environment}`, {
    value: postConfirmLambdaFn.functionName,
  });

  return postConfirmLambdaFn;
};
