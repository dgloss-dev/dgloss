import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';

import { VPCStackProps } from '../lib';

interface Envs {
  localHomeUrl: string;
  // amplifyHomeUrl: string;
  // appLiveUrl?: string;
}

interface Props extends VPCStackProps {
  name: string;
  environmentVariables: Envs;
}

export class VoiceDataBucket {
  private bucket: Bucket;
  private logsBucket: Bucket;
  private encryptionKey: Key;

  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  public get getBucket() {
    return this.bucket;
  }

  public get getEncryptionKey() {
    return this.encryptionKey;
  }

  private initialize() {
    if (this.props.environment !== 'dev') {
      this.createEncryptionKey();
      this.createLogsBucket();
    }

    this.createBucket();
  }

  private createBucket() {
    // const { localHomeUrl, amplifyHomeUrl, appLiveUrl } = this.props.environmentVariables;
    const { localHomeUrl } = this.props.environmentVariables;
    const allowedOrigins = [localHomeUrl];
    if (this.props.environment === 'prod') {
      // allowedOrigins.push(appLiveUrl!);
    }

    this.bucket = new Bucket(this.stack, `VoiceDataBucket-${this.props.environment}`, {
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
      serverAccessLogsBucket: this.props.environment !== 'dev' ? this.logsBucket : undefined,
      serverAccessLogsPrefix: this.props.environment !== 'dev' ? 's3' : undefined,
    });
  }

  private createLogsBucket() {
    this.logsBucket = new Bucket(this.stack, `VoiceDataLogsBucket-${this.props.environment}`, {
      bucketName: `${this.props.name}-logs`,
      removalPolicy: RemovalPolicy.DESTROY,
      publicReadAccess: false,
      enforceSSL: true,
    });

    new LogGroup(this.stack, `VoiceDataLogGroup-${this.props.environment}`, {
      logGroupName: `${this.props.name}-log-group`,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }

  private createEncryptionKey() {
    this.encryptionKey = new Key(this.stack, `DglossEncryptionKey-${this.props.environment}`, {
      enableKeyRotation: true,
    });
  }
}
