import { Stack } from 'aws-cdk-lib';
import { CfnDetector, CfnMalwareProtectionPlan } from 'aws-cdk-lib/aws-guardduty';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Bucket } from 'aws-cdk-lib/aws-s3';

import { VPCStackProps } from '../lib';

interface Props extends VPCStackProps {
  bucket: Bucket;
  encryptionKey: Key;
}

export class AppGuardDuty {
  private malwareProtectionRole: Role;

  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  public initialize() {
    this.createDetector();
    this.createMalwareProtectionRole();
    this.createMalwareProtectionPlan();
  }

  private createDetector() {
    new CfnDetector(this.stack, `DglossGuardDutyDetector-${this.props.environment}`, {
      enable: true,
      dataSources: {
        malwareProtection: {
          scanEc2InstanceWithFindings: {
            ebsVolumes: true,
          },
        },
        s3Logs: {
          enable: true,
        },
      },
    });
  }

  private createMalwareProtectionRole() {
    const guardDutyRole = new Role(
      this.stack,
      `DglossGuardDutyMalwareProtectionRole-${this.props.environment}`,
      {
        assumedBy: new ServicePrincipal('malware-protection-plan.guardduty.amazonaws.com'),
        description: 'IAM pass role for guardduty malware protection service',
        managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')],
      },
    );

    this.malwareProtectionRole = guardDutyRole;
  }

  private createMalwareProtectionPlan() {
    new CfnMalwareProtectionPlan(
      this.stack,
      `DglossGuardDutyMalwarePlan-${this.props.environment}`,
      {
        protectedResource: {
          s3Bucket: {
            bucketName: this.props.bucket.bucketName,
          },
        },
        role: this.malwareProtectionRole.roleArn,
        actions: {
          tagging: {
            status: 'ENABLED',
          },
        },
      },
    );
  }
}
