import Ajv from 'ajv';
import { ENVIRONMENTS } from '../common/constants';
import ajvFormats from 'ajv-formats';
import dotenv from 'dotenv';

dotenv.config();
const ajv = new Ajv({ allErrors: true });
ajvFormats(ajv);

const configSchema = {
  type: 'object',
  properties: {
    APP_ENV: {
      type: 'string',
      enum: [ENVIRONMENTS.LOCAL, ENVIRONMENTS.DEV, ENVIRONMENTS.STAGING, ENVIRONMENTS.PRODUCTION],
    },
    APP_PORT: { type: 'integer' },
    APP_VERSION: { type: 'string' },
    APP_ALLOWED_ORIGINS: { type: 'array', items: { type: 'string' } },
    APP_HOME_URL: { type: 'string' },
  },
  required: ['APP_ENV', 'APP_PORT', 'APP_VERSION', 'APP_ALLOWED_ORIGINS', 'APP_HOME_URL'],
};

const validate = ajv.compile(configSchema);

const defaultConfig = {
  APP_ENV: ENVIRONMENTS.LOCAL,
  APP_PORT: 3001,
  APP_VERSION: '1.0',
  APP_REGION: 'ap-northeast-1',
};

const ALLOWED_ORIGINS = ['http://localhost:3000'];
const PROD_ALLOWED_ORIGINS = [];

export const AppConfig = {
  APP_ENV: process.env.APP_ENV || defaultConfig.APP_ENV,
  APP_PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : defaultConfig.APP_PORT,
  APP_VERSION: process.env.APP_VERSION || defaultConfig.APP_VERSION,
  APP_REGION: process.env.APP_REGION || defaultConfig.APP_REGION,
  APP_ACCOUNT_ID: process.env.APP_ACCOUNT_ID,
  APP_ALLOWED_ORIGINS:
    process.env.APP_ENV === ENVIRONMENTS.PRODUCTION ? PROD_ALLOWED_ORIGINS : ALLOWED_ORIGINS,
  APP_HOME_URL: process.env.APP_HOME_URL,
  APP_CDN_URL: process.env.APP_CDN_URL,
};

// Validate the AppConfig against the schema
if (!validate(AppConfig)) {
  console.error('Config validation failed:', validate.errors);
  // Properly handle the error before throwing
  const formattedErrors = validate.errors.map((error) => `${error.instancePath} ${error.message}`);
  throw new Error(`Invalid configuration:\n${formattedErrors.join('\n')}`);
}
