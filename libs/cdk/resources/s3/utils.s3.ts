import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';

import { VPCStackProps } from '../lib';

interface Envs {
  localHomeUrl: string;
  amplifyHomeUrl: string;
  appLiveUrl?: string;
}

interface Props extends VPCStackProps {
  name: string;
  environmentVariables: Envs;
}

export class UtilsBucket {
  private bucket: Bucket;

  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  public get getBucket() {
    return this.bucket;
  }

  private initialize() {
    this.createBucket();
  }

  private createBucket() {
    const { localHomeUrl, amplifyHomeUrl, appLiveUrl } = this.props.environmentVariables;
    const allowedOrigins = [localHomeUrl, amplifyHomeUrl];
    if (this.props.environment === 'prod') {
      allowedOrigins.push(appLiveUrl!);
    }

    this.bucket = new Bucket(this.stack, `UtilsBucket-${this.props.environment}`, {
      bucketName: this.props.name,
      removalPolicy: RemovalPolicy.RETAIN,
      publicReadAccess: false,
      versioned: this.props.environment !== 'dev',
      transferAcceleration: this.props.environment !== 'dev',
      cors: [
        {
          allowedOrigins,
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT],
          allowedHeaders: ['*'],
        },
      ],
    });
  }
}
