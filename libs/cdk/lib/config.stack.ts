import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { SSMParameters } from '../resources/ssm';

import { VPCStackProps } from '../resources/lib';

export class ConfigStack extends Stack {
  constructor(scope: Construct, id: string, props?: VPCStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';

    const vpc = props?.vpc;

    if (vpc) {
      new SSMParameters(this, {
        vpc,
        environment,
      });
    }
  }
}
