import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const CloudWatchPolicy = (resources: string[]) => {
  const cloudWatchPolicy = new PolicyStatement({
    actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
    resources: resources,
  });

  return cloudWatchPolicy;
};
