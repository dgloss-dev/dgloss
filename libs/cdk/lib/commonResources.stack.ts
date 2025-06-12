import { Stack } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { AppGuardDuty } from '../resources/guardduty';
import { CognitoUserPool } from '../resources/cognito';
import { VoiceDataDistribution } from '../resources/cloudfront';
import { RDSDatabase } from '../resources/db';
import { DglossBastion } from '../resources/ec2';
import { VoiceDataBucket } from '../resources/s3';
import { SSM } from '../resources/ssm';

import { VPCStackProps } from '../resources/lib';

export class CommonResourcesStack extends Stack {
  private sgApp: SecurityGroup;
  private voiceDataBucket: Bucket;
  private userPool: UserPool;

  constructor(scope: Construct, id: string, props?: VPCStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';

    const vpc = props?.vpc;

    const {
      // amplifyHomeUrl,
      // appLiveUrl,
      // apiUrl,
      dbUser,
      dbName,
      internalApiKey,
      localHomeUrl } = SSM(this);

    // Cognito throws unverified email error when taking this value from SSM
    const EMAIL_SENDER = process.env.EMAIL_SENDER;

    if (vpc && EMAIL_SENDER) {
      const db = new RDSDatabase(this, {
        vpc,
        environment,
        environmentVariables: {
          dbUsername: dbUser.stringValue,
          dbName: dbName.stringValue,
        },
      });

      const up = new CognitoUserPool(this, {
        vpc,
        environment,
        name: `UserPool-${environment}`,
        clientName: `UserPoolClient-${environment}`,
        adminGroupName: `Admins-${environment}`,
        environmentVariables: {
          // apiUrl,
          // appLiveUrl,
          // amplifyHomeUrl,
          internalApiKey,
          emailSender: EMAIL_SENDER,
          emailSenderDomain: EMAIL_SENDER.split('@')[1],
        },
      });

      this.userPool = up.getUserPool;
      this.sgApp = db.getSGApp;

      // if (localHomeUrl && amplifyHomeUrl) {
      if (localHomeUrl) {
        const vd = new VoiceDataBucket(this, {
          vpc,
          environment,
          name: `dgloss-projects-${environment}`,
          environmentVariables: {
            // appLiveUrl: appLiveUrl?.stringValue,
            localHomeUrl: localHomeUrl.stringValue,
            // amplifyHomeUrl: amplifyHomeUrl.stringValue,
          },
        });

        this.voiceDataBucket = vd.getBucket;

        new VoiceDataDistribution(this, {
          vpc,
          environment,
          bucket: vd.getBucket,
        });

        if (vpc && environment !== 'dev') {
          new DglossBastion(this, {
            vpc,
            environment,
            sgBastion: db.getSGBastion,
          });

          // Only one guardduty per account
          if (environment === 'prod') {
            new AppGuardDuty(this, {
              vpc,
              environment,
              bucket: vd.getBucket,
              encryptionKey: vd.getEncryptionKey,
            });
          }
        }
      }
    }
  }

  public get getSGApp() {
    return this.sgApp;
  }

  public get getVoiceDataBucket() {
    return this.voiceDataBucket;
  }

  public get getUserPool() {
    return this.userPool;
  }
}
