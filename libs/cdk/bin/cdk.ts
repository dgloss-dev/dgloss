#!/usr/bin/env node
import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import * as dotenv from 'dotenv';

import { ClientDeploymentStack } from '../lib/clientDeployment.stack';
import { CommonResourcesStack } from '../lib/commonResources.stack';
import { ConfigStack } from '../lib/config.stack';
import { NetworkStack } from '../lib/network.stack';
import { ServerDeploymentStack } from '../lib/serverDeployment.stack';

dotenv.config();
const environment = process.env.ENVIRONMENT || 'dev';

const app = new cdk.App();
const networkStack = new NetworkStack(app, `NetworkStack-${environment}`, {
  environment,
  env: { account: process.env.APP_ACCOUNT_ID, region: process.env.APP_REGION },
});

new ConfigStack(app, `ConfigStack-${environment}`, {
  environment,
  env: { account: process.env.APP_ACCOUNT_ID, region: process.env.APP_REGION },
  vpc: networkStack.getVpc,
});

const commonResourcesStack = new CommonResourcesStack(app, `CommonResourcesStack-${environment}`, {
  environment,
  env: { account: process.env.APP_ACCOUNT_ID, region: process.env.APP_REGION },
  vpc: networkStack.getVpc,
});

new ServerDeploymentStack(app, `ServerDeploymentStack-${environment}`, {
  environment,
  env: { account: process.env.APP_ACCOUNT_ID, region: process.env.APP_REGION },
  vpc: networkStack.getVpc,
  sgApp: commonResourcesStack.getSGApp,
  buckets: [commonResourcesStack.getVoiceDataBucket],
  userPool: commonResourcesStack.getUserPool,
});

new ClientDeploymentStack(app, `ClientDeploymentStack-${environment}`, {
  environment,
  env: { account: process.env.APP_ACCOUNT_ID, region: process.env.APP_REGION },
  vpc: networkStack.getVpc,
});
