import { Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export const S3Policy = (resources: string[]) => {
  const listItemPolicy = new PolicyStatement({
    actions: ['s3:Get*', 's3:List*'],
    resources: resources,
  });
  const putItemPolicy = new PolicyStatement({
    actions: ['s3:Put*'],
    resources: resources,
  });
  return { listItemPolicy, putItemPolicy };
};

export const s3CloudFrontPolicy = (
  accountId: string,
  bucketArn: string,
  distributionId: string,
) => {
  return new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ['s3:GetObject'],
    resources: [`${bucketArn}/*`],
    principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
    conditions: {
      StringEquals: {
        'AWS:SourceArn': `arn:aws:cloudfront::${accountId}:distribution/${distributionId}`,
      },
    },
  });
};
