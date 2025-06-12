import { Stack } from 'aws-cdk-lib';
import { CachePolicy, Distribution, OriginRequestPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';

import { s3CloudFrontPolicy } from '../policies';
import { VPCStackProps } from '../lib';

interface Props extends VPCStackProps {
  bucket: Bucket;
}

export class UtilsDistribution {
  private distribution: Distribution;

  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  public initialize() {
    this.createDistribution();
    this.provideBucketAccess();
  }

  private createDistribution() {
    this.distribution = new Distribution(
      this.stack,
      `UtilsDistribution-${this.props.environment}`,
      {
        comment: `Utils Distribution-${this.props.environment}`,
        defaultBehavior: {
          origin: S3BucketOrigin.withOriginAccessControl(this.props.bucket),
          cachePolicy: CachePolicy.CACHING_OPTIMIZED,
          originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
        },
      },
    );
  }

  private provideBucketAccess() {
    this.props.bucket.addToResourcePolicy(
      s3CloudFrontPolicy(
        this.stack.account,
        this.props.bucket.bucketArn,
        this.distribution.distributionId,
      )
    )
  }
}
