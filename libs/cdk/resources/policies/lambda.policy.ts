import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const LambdaPolicy = (resources: string[]) => {
  const lambdaPolicy = new PolicyStatement({
    actions: ['lambda:InvokeFunction'],
    resources: resources,
  });

  return lambdaPolicy;
};
