export interface Config {
  parameters: {
    serverPort: number;
    gitRepo: {
      name: string;
      owner: string;
      branch: string;
      authToken: string;
    };
    application: {
      APP_LOCAL_URL: string;
      APP_AMPLIFY_URL: string;
      APP_LIVE_URL?: string;
      API_URL: string;
      JWT_SECRET: string;
      JWT_ACCESS_TOKEN_EXPIRATION: string;
      JWT_REFRESH_TOKEN_EXPIRATION: string;
      USER_POOL_ID: string;
      USER_POOL_CLIENT_ID: string;
      VOICE_DATA_DISTRIBUTION: string;
      INTERNAL_API_KEY: string;
    };
    email: {
      EMAIL_SENDER: string;
      EMAIL_ALERTS: string;
    };
    database: {
      DB_HOST: string;
      DB_REPLICA_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_NAME: string;
      DB_PASSWORD_ARN: string;
    };
  };
}
