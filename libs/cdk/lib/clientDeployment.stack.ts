import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { DglossAmplify } from '../resources/amplify';

import { VPCStackProps } from '../resources/lib';

import { Config } from '../src/interfaces';

export class ClientDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: VPCStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';

    const config: Config = require(`../config/${environment}-config.json`);

    const vpc = props?.vpc;

    if (vpc && config.parameters) {
      new DglossAmplify(this, {
        vpc,
        environment,
        appName: `dgloss-client-${environment}`,
        gitRepo: config.parameters.gitRepo,
      });
    }
  }
}
