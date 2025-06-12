import { Stack } from 'aws-cdk-lib';
import { Role, ServicePrincipal, CompositePrincipal } from 'aws-cdk-lib/aws-iam';

import { VPCStackProps } from '../lib';
import { LambdaPolicy, SESPolicy, CloudWatchPolicy } from '../policies';

interface SchedulerIAMProps extends VPCStackProps { }

export class SchedulerIAM {
  private role: Role;

  public get getRole() {
    return this.role;
  }

  constructor(
    private readonly stack: Stack,
    private readonly props: SchedulerIAMProps,
  ) {
    this.initialize();
  }

  private initialize() {
    this.createRole();
  }

  private createRole() {
    this.role = new Role(this.stack, `SchedulerRole-${this.props.environment}`, {
      roleName: `SchedulerRole-${this.props.environment}`,
      assumedBy: new CompositePrincipal(
        new ServicePrincipal('lambda.amazonaws.com'),
        new ServicePrincipal('scheduler.amazonaws.com')
      ),
    });

    // Add SES permissions
    this.role.addToPolicy(
      SESPolicy(['*'])
    );

    // Add Lambda permissions
    this.role.addToPolicy(
      LambdaPolicy(['*'])
    );
    
    // Add CloudWatch Logs permissions
    this.role.addToPolicy(
      CloudWatchPolicy(['*'])
    );
  }
}
