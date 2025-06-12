import { Stack } from 'aws-cdk-lib';
import { IpAddresses, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';

import { BaseStackProps } from '../lib';

interface Props extends BaseStackProps {
  ipAddresses: string;
}

export class AppVPC {
  private vpc: Vpc;

  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  public get getVpc(): Vpc {
    return this.vpc;
  }

  private initialize() {
    this.createVPC();
  }

  private createVPC() {
    this.vpc = new Vpc(this.stack, `DglossVPC-${this.props.environment}`, {
      vpcName: `dgloss-vpc-${this.props.environment}`,
      ipAddresses: IpAddresses.cidr(this.props.ipAddresses),
      maxAzs: 3,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: `PublicSubnet-${this.props.environment}`,
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: `PrivateSubnet-${this.props.environment}`,
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: `IsolatedSubnet-${this.props.environment}`,
          subnetType: SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });
  }
}
