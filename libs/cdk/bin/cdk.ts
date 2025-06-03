#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';

const app = new cdk.App();
dotenv.config();
const environment = process.env.ENVIRONMENT || 'dev';
