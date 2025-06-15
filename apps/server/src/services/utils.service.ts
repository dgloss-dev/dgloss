import { GetPresignedUrlDto } from '@workspace/types/dto/utils';

import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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
import { Readable } from 'stream';

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

  public async getObjectFromS3(
    key: string,
    bucket: string,
    asStream = false,
  ): Promise<Uint8Array | Readable> {
    logger.info('UtilsService - getObjectFromS3()');

    try {
      const client = new S3Client({ region: AppConfig.APP_REGION });
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const response = await client.send(command);

      if (!response.Body) {
        throw new Error('No file body returned from S3');
      }

      if (asStream) {
        return response.Body as Readable;
      }

      const fileBuffer = await response.Body.transformToByteArray();
      return fileBuffer;
    } catch (error) {
      throw ThrowError(error);
    }
  }

  public async getStreamFromS3(key: string, bucket: string): Promise<Buffer> {
    logger.info('UtilsService - getStreamFromS3()');
    try {
      const stream = (await this.getObjectFromS3(key, bucket, true)) as Readable;
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
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
