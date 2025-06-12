import { Stack } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

import { AppVPC } from '../resources/vpc';

import { BaseStackProps } from '../resources/lib';

export class NetworkStack extends Stack {
  private vpc: Vpc;

  constructor(scope: Construct, id: string, props?: BaseStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';

    const appVPC = new AppVPC(this, { environment, ipAddresses: '10.0.0.0/16' });

    this.vpc = appVPC.getVpc;
  }

  public get getVpc() {
    return this.vpc;
  }
}
