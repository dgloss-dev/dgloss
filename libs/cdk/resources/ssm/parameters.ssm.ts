import { Stack } from 'aws-cdk-lib';

import { generateSSMParameter } from './ssm';

import { VPCStackProps } from '../lib';

import { Config } from '../../src/interfaces';

interface Props extends VPCStackProps {}

export class SSMParameters {
  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  private initialize() {
    this.createParameters();
  }

  private createParameters() {
    const config: Config = require(`../../config/${this.props.environment}-config.json`);

    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_ACCESS_TOKEN_EXPIRATION = process.env.JWT_ACCESS_TOKEN_EXPIRATION;
    const JWT_REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_TOKEN_EXPIRATION;
    const DB_HOST = process.env.DB_HOST;
    const DB_REPLICA_HOST = process.env.DB_REPLICA_HOST;
    const DB_PORT = process.env.DB_PORT;
    const DB_USER = process.env.DB_USER;
    const DB_NAME = process.env.DB_NAME;
    const USER_POOL_ID = process.env.USER_POOL_ID;
    const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID;
    const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

    const APP_LOCAL_URL = process.env.APP_LOCAL_URL;
    const APP_AMPLIFY_URL = process.env.APP_AMPLIFY_URL;
    const APP_LIVE_URL = process.env.APP_LIVE_URL;
    const VOICE_DATA_DISTRIBUTION = process.env.VOICE_DATA_DISTRIBUTION;

    const EMAIL_SENDER = process.env.EMAIL_SENDER;
    const EMAIL_ALERTS = process.env.EMAIL_ALERTS;

    if (JWT_SECRET) {
      generateSSMParameter(this.stack, config.parameters.application.JWT_SECRET, JWT_SECRET);
    }

    if (JWT_ACCESS_TOKEN_EXPIRATION) {
      generateSSMParameter(
        this.stack,
        config.parameters.application.JWT_ACCESS_TOKEN_EXPIRATION,
        JWT_ACCESS_TOKEN_EXPIRATION,
      );
    }

    if (JWT_REFRESH_TOKEN_EXPIRATION) {
      generateSSMParameter(
        this.stack,
        config.parameters.application.JWT_REFRESH_TOKEN_EXPIRATION,
        JWT_REFRESH_TOKEN_EXPIRATION,
      );
    }

    if (DB_HOST) {
      generateSSMParameter(this.stack, config.parameters.database.DB_HOST, DB_HOST);
    }

    if (DB_REPLICA_HOST) {
      generateSSMParameter(this.stack, config.parameters.database.DB_REPLICA_HOST, DB_REPLICA_HOST);
    }

    if (DB_PORT) {
      generateSSMParameter(this.stack, config.parameters.database.DB_PORT, DB_PORT);
    }

    if (DB_USER) {
      generateSSMParameter(this.stack, config.parameters.database.DB_USER, DB_USER);
    }

    if (DB_NAME) {
      generateSSMParameter(this.stack, config.parameters.database.DB_NAME, DB_NAME);
    }

    if (USER_POOL_ID) {
      generateSSMParameter(this.stack, config.parameters.application.USER_POOL_ID, USER_POOL_ID);
    }

    if (USER_POOL_CLIENT_ID) {
      generateSSMParameter(
        this.stack,
        config.parameters.application.USER_POOL_CLIENT_ID,
        USER_POOL_CLIENT_ID,
      );
    }

    if (INTERNAL_API_KEY) {
      generateSSMParameter(
        this.stack,
        config.parameters.application.INTERNAL_API_KEY,
        INTERNAL_API_KEY,
      );
    }

    if (APP_LOCAL_URL) {
      generateSSMParameter(this.stack, config.parameters.application.APP_LOCAL_URL, APP_LOCAL_URL);
    }

    if (APP_AMPLIFY_URL) {
      generateSSMParameter(
        this.stack,
        config.parameters.application.APP_AMPLIFY_URL,
        APP_AMPLIFY_URL,
      );
    }

    if (APP_LIVE_URL) {
      generateSSMParameter(this.stack, config.parameters.application.APP_LIVE_URL!, APP_LIVE_URL);
    }

    if (VOICE_DATA_DISTRIBUTION) {
      generateSSMParameter(
        this.stack,
        config.parameters.application.VOICE_DATA_DISTRIBUTION,
        VOICE_DATA_DISTRIBUTION,
      );
    }

    if (EMAIL_SENDER) {
      generateSSMParameter(this.stack, config.parameters.email.EMAIL_SENDER, EMAIL_SENDER);
    }

    if (EMAIL_ALERTS) {
      generateSSMParameter(this.stack, config.parameters.email.EMAIL_ALERTS, EMAIL_ALERTS);
    }
  }
}
