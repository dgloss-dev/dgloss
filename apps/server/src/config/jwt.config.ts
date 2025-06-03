import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import dotenv from 'dotenv';

dotenv.config();
const ajv = new Ajv({ allErrors: true });
ajvFormats(ajv);

const configSchema = {
  type: 'object',
  properties: {
    JWT_SECRET: { type: 'string', minLength: 10 },
    JWT_ACCESS_TOKEN_EXPIRATION: { type: 'string', minLength: 2 },
    JWT_REFRESH_TOKEN_EXPIRATION: { type: 'string', minLength: 2 },
  },
  required: ['JWT_SECRET', 'JWT_ACCESS_TOKEN_EXPIRATION', 'JWT_REFRESH_TOKEN_EXPIRATION'],
};

const validate = ajv.compile(configSchema);

export const JWTConfig = {
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '',
  JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '',
};

if (!validate(JWTConfig)) {
  throw validate.errors;
}
