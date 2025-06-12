import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export const IAMPassRolePolicy = (roleArn: string) => {
  const passRolePolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['iam:PassRole'],
    resources: [roleArn],
  });

  return passRolePolicy;
}; 