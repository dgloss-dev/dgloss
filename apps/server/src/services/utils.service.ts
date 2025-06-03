import { GetPresignedUrlDto } from '@workspace/types/dto/utils';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppConfig } from '../config';

// import {
//   SESClient,
//   SendEmailCommand,
//   SendEmailRequest,
//   SendEmailResponse,
// } from '@aws-sdk/client-ses';
// import { EmailParams } from '../common/interfaces';
import { logger } from '../utils/winston.utils';
import { ThrowError } from '../utils/error.utils';

export class UtilsService {
  public static instance: UtilsService;

  public static getInstance = (): UtilsService => {
    if (!this.instance) {
      this.instance = new UtilsService();
    }
    return this.instance;
  };

  public async getPresignedUrl(userId: string, body: GetPresignedUrlDto) {
    logger.info('UtilsService - getPreSignedUrl()');

    try {
      const client = new S3Client({ region: AppConfig.APP_REGION });
      let key = `${userId}/${body.key}`;
      if (body.isAppendUserId == false) {
        key = body.key;
      }

      const command = new PutObjectCommand({ Bucket: body.bucket, Key: key });

      const expireInSeconds = 60 * 5;
      return getSignedUrl(client, command, { expiresIn: expireInSeconds });
    } catch (error) {
      throw ThrowError(error);
    }
  }

  // public async sendEmail(emailParams: EmailParams) {
  //   logger.info('UtilsService - sendEmail()');

  //   try {
  //TODO: Implement email sending logic here
  // const client = new SESClient({ region: AppConfig.APP_REGION });

  // const input: SendEmailRequest = {
  //   Source: 'no-reply@osakagas.com',
  //   Destination: {
  //     ToAddresses: emailParams.toAddresses,
  //     CcAddresses: emailParams.ccAddresses || [],
  //     BccAddresses: emailParams.bccAddresses || [],
  //   },
  //   Message: {
  //     Subject: {
  //       Data: emailParams.subject,
  //       Charset: 'UTF-8',
  //     },
  //     Body: {
  //       Html: {
  //         Data: emailParams.html,
  //         Charset: 'UTF-8',
  //       },
  //     },
  //   },
  //   SourceArn: 'arn:aws:ses:ap-northeast-1:673978578745:identity/no-reply@onelinavi.com',
  // };

  // const command = new SendEmailCommand(input);
  // const response: SendEmailResponse = await client.send(command);

  // return response;
  //   } catch (error) {
  //     throw ThrowError(error);
  //   }
  // }
}
