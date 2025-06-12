import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const SSMPolicy = (resources: string[]) => {
  const ssmParameterReadPolicy = new PolicyStatement({
    actions: ['ssm:GetParameter'],
    resources: resources,
  });

  return ssmParameterReadPolicy;
};
