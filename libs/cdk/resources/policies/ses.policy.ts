import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const SESPolicy = (resources: string[]) => {
  const sesSendEmailPolicy = new PolicyStatement({
    actions: ['ses:sendEmail', 'ses:sendRawEmail'],
    resources: resources,
  });

  return sesSendEmailPolicy;
};
