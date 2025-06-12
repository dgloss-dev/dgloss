import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';
import dotenv from 'dotenv';

dotenv.config();

const ajv = new Ajv({ allErrors: true });

ajvFormats(ajv);

const configSchema = {
  type: 'object',
  properties: {
    USER_POOL_ID: { type: 'string' },
    USER_POOL_CLIENT_ID: { type: 'string' },
    VOICE_DATA_DISTRIBUTION: { type: 'string' },
  },
  required: ['USER_POOL_ID', 'USER_POOL_CLIENT_ID', 'VOICE_DATA_DISTRIBUTION'],
};

const validate = ajv.compile(configSchema);

export const AWSConfig = {
  USER_POOL_ID: process.env.USER_POOL_ID || '',
  USER_POOL_CLIENT_ID: process.env.USER_POOL_CLIENT_ID || '',
  VOICE_DATA_DISTRIBUTION: process.env.VOICE_DATA_DISTRIBUTION || '',
};

if (!validate(AWSConfig)) {
  throw validate.errors;
}
