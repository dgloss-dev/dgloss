import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const IamPolicy = (resources: string[]) => {
  const passRolePolicy = new PolicyStatement({
    actions: ['iam:PassRole'],
    resources: resources,
  });

  return { passRolePolicy };
};
