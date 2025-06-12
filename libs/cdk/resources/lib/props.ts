import { StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

export interface BaseStackProps extends StackProps {
  environment: string;
}

export interface VPCStackProps extends BaseStackProps {
  vpc: Vpc;
}

