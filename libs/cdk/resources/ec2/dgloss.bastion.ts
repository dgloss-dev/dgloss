import { Stack } from "aws-cdk-lib";
import {
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  KeyPair,
  SecurityGroup,
  SubnetType,
  WindowsImage,
  WindowsVersion,
} from "aws-cdk-lib/aws-ec2";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

import { VPCStackProps } from "../lib";

interface Props extends VPCStackProps {
  sgBastion: SecurityGroup;
}

export class DglossBastion {
  private host: Instance;
  private role: Role;

  constructor(private readonly stack: Stack, private readonly props: Props) {
    this.initialize();
  }

  private initialize() {
    this.createRole();
    this.createBastionHost();
    this.createUserData();
  }

  private createRole() {
    this.role = new Role(
      this.stack,
      `DglossBastionRole-${this.props.environment}`,
      {
        assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName("AmazonRDSFullAccess"),
          ManagedPolicy.fromAwsManagedPolicyName(
            "AmazonSSMManagedInstanceCore"
          ),
          ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMReadOnlyAccess"),
        ],
      }
    );
  }

  private createBastionHost() {
    const windowsAmi = new WindowsImage(
      WindowsVersion.WINDOWS_SERVER_2022_ENGLISH_FULL_BASE
    );
    this.host = new Instance(
      this.stack,
      `DglossBastion-${this.props.environment}`,
      {
        vpc: this.props.vpc,
        vpcSubnets: {
          subnetType: SubnetType.PUBLIC,
        },
        instanceType: InstanceType.of(InstanceClass.M3, InstanceSize.MEDIUM),
        machineImage: windowsAmi,
        securityGroup: this.props.sgBastion,
        role: this.role,
        keyPair: KeyPair.fromKeyPairName(
          this.stack,
          `DglossBastionKeyPair-${this.props.environment}`,
          "Dgloss Bastion"
        ),
      }
    );
  }

  private createUserData() {
    this.host.addUserData(
      // Install Chocolatey package manager
      "Set-ExecutionPolicy Bypass -Scope Process -Force;",
      "[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;",
      'iex ((New-Object System.Net.WebClient).DownloadString("https://chocolatey.org/install.ps1"))',

      // Install database management tools
      "choco install -y dbeaver",
      "choco install -y pgadmin4",

      // Install AWS CLI
      "choco install -y awscli"
    );
  }
}
