import { Duration, Stack } from 'aws-cdk-lib';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import {
  ClientPasswordAuthType,
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  DatabaseInstanceReadReplica,
  DatabaseProxy,
  NetworkType,
  PostgresEngineVersion,
  ProxyTarget,
  SubnetGroup,
} from 'aws-cdk-lib/aws-rds';

import { generateSSMParameter } from '../ssm';
import { Config } from '../../src/interfaces';
import { VPCStackProps } from '../lib';

interface Envs {
  dbName: string;
  dbUsername: string;
}

interface RDSProps extends VPCStackProps {
  environmentVariables: Envs;
}

export class RDSDatabase {
  private instance: DatabaseInstance;
  private subnet: SubnetGroup;
  private sgApp: SecurityGroup;
  private sgProxy: SecurityGroup;
  private sgBastion: SecurityGroup;
  private sgRds: SecurityGroup;

  constructor(
    private readonly stack: Stack,
    private readonly props: RDSProps,
  ) {
    this.initialize();
  }

  public get getSGApp() {
    return this.sgApp;
  }

  public get getSGBastion() {
    return this.sgBastion;
  }

  private initialize() {
    this.createSecurityGroups();
    this.attachSecurityGroupPermissions();
    this.createInstanceSubnet();
    this.createInstance();
    this.createProxy();
    this.createReadReplica();
  }

  private createInstance() {
    const { dbUsername, dbName } = this.props.environmentVariables;

    const credentials = Credentials.fromGeneratedSecret(dbUsername);
    this.instance = new DatabaseInstance(this.stack, `DbInstance-${this.props.environment}`, {
      credentials,
      vpc: this.props.vpc,
      securityGroups: [this.sgRds],
      subnetGroup: this.subnet,
      engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_16_4 }),
      networkType: NetworkType.IPV4,
      instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL),
      databaseName: dbName,
      monitoringInterval: Duration.seconds(10),
      maxAllocatedStorage: this.props.environment !== 'dev' ? 200 : undefined,
      enablePerformanceInsights: this.props.environment !== 'dev',
      publiclyAccessible: this.props.environment === 'dev',
      multiAz: this.props.environment !== 'dev',
      storageEncrypted: this.props.environment !== 'dev',
    });

    if (this.props.environment !== 'dev') {
      this.instance.addRotationSingleUser();
    }
  }

  private createProxy() {
    const secret = this.instance.secret;
    if (!secret)
      throw new Error(
        'Database instance secret is not defined. Ensure the RDS instance is properly created.',
      );

    new DatabaseProxy(this.stack, `DbProxy-${this.props.environment}`, {
      vpc: this.props.vpc,
      securityGroups: [this.sgProxy],
      proxyTarget: ProxyTarget.fromInstance(this.instance),
      secrets: [secret],
      clientPasswordAuthType: ClientPasswordAuthType.POSTGRES_MD5,
      borrowTimeout: Duration.seconds(30),
      idleClientTimeout: Duration.minutes(30),
      maxConnectionsPercent: 10,
      requireTLS: true,
      vpcSubnets: this.props.vpc.selectSubnets({
        subnetType:
          this.props.environment === 'dev' ? SubnetType.PUBLIC : SubnetType.PRIVATE_WITH_EGRESS,
      }),
    });

    const config: Config = require(`../../config/${this.props.environment}-config.json`);
    generateSSMParameter(this.stack, config.parameters.database.DB_PASSWORD_ARN, secret.secretArn);
  }

  private createReadReplica() {
    new DatabaseInstanceReadReplica(this.stack, `DbInstanceReadReplica-${this.props.environment}`, {
      vpc: this.props.vpc,
      sourceDatabaseInstance: this.instance,
      instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.MEDIUM),
    });
  }

  private createSecurityGroups() {
    this.sgApp = new SecurityGroup(this.stack, `AppSG-${this.props.environment}`, {
      vpc: this.props.vpc,
      description: 'Application security group',
      allowAllOutbound: false,
    });

    if (this.props.environment !== 'dev') {
      this.sgBastion = new SecurityGroup(this.stack, `BastionSG-${this.props.environment}`, {
        vpc: this.props.vpc,
        description: 'Bastion Host security group',
        allowAllOutbound: false,
      });
    }

    this.sgProxy = new SecurityGroup(this.stack, `DbProxySG-${this.props.environment}`, {
      vpc: this.props.vpc,
      description: 'RDS Proxy security group',
      allowAllOutbound: false,
    });

    this.sgRds = new SecurityGroup(this.stack, `DbInstanceSG-${this.props.environment}`, {
      vpc: this.props.vpc,
      description: 'RDS Instance security group',
      allowAllOutbound: false,
    });
  }

  private attachSecurityGroupPermissions() {
    this.attachAppRunnerPermissions();
    if (this.props.environment !== 'dev') {
      this.attachBastionPermissions();
    }

    this.attachRDSPermissions();
  }

  private attachAppRunnerPermissions() {
    this.sgApp.addIngressRule(Peer.anyIpv4(), Port.tcp(443), 'Allow HTTPS traffic');
    this.sgApp.addEgressRule(Peer.anyIpv4(), Port.tcp(80), 'Allow outbound HTTP traffic');
    this.sgApp.addEgressRule(Peer.anyIpv4(), Port.tcp(443), 'Allow outbound HTTPS traffic');
    this.sgApp.addEgressRule(
      this.sgRds,
      Port.tcp(5432),
      'Allow outbound traffic to RDS from AppRunner',
    );

    this.sgApp.addEgressRule(
      this.sgProxy,
      Port.tcp(5432),
      'Allow outbound traffic to Proxy from AppRunner',
    );
  }

  private attachBastionPermissions() {
    const ALLOW_IP = process.env.IP_ADDRESS;
    if (ALLOW_IP) {
      this.sgBastion.addIngressRule(Peer.ipv4(ALLOW_IP), Port.tcp(3389), 'Allow RDP access');
      this.sgBastion.addEgressRule(
        this.sgProxy,
        Port.tcp(5432),
        'Allow outbound traffic to Proxy from Bastion',
      );

      this.sgBastion.addEgressRule(
        this.sgRds,
        Port.tcp(5432),
        'Allow outbound traffic to RDS from Bastion',
      );

      // Allow outgoing traffic to download resources on set up
      this.sgBastion.addEgressRule(Peer.anyIpv4(), Port.tcp(443), 'Allow HTTPS traffic');
    }
  }

  private attachRDSPermissions() {
    this.sgProxy.addIngressRule(this.sgApp, Port.tcp(5432), 'Allow App to connect to Proxy');

    if (this.props.environment !== 'dev') {
      this.sgProxy.addIngressRule(
        this.sgBastion,
        Port.tcp(5432),
        'Allow Bastion to connect to Proxy',
      );
    }

    this.sgProxy.addEgressRule(
      this.sgRds,
      Port.tcp(5432),
      'Allow outbound traffic to RDS from Proxy',
    );

    this.sgRds.addIngressRule(this.sgProxy, Port.tcp(5432), 'Allow Proxy to connect to RDS');
    this.sgRds.addIngressRule(this.sgApp, Port.tcp(5432), 'Allow App to connect to RDS');

    if (this.props.environment !== 'dev') {
      this.sgRds.addIngressRule(this.sgBastion, Port.tcp(5432), 'Allow Bastion to connect to RDS');
    }

    if (this.props.environment === 'dev') {
      this.sgRds.addIngressRule(Peer.anyIpv4(), Port.tcp(5432), 'Allow connection to dev db');
    }
  }

  private createInstanceSubnet() {
    this.subnet = new SubnetGroup(this.stack, `DbInstanceSubnetGroup-${this.props.environment}`, {
      vpc: this.props.vpc,
      subnetGroupName: `DbInstanceSubnetGroup-${this.props.environment}`,
      description: 'RDS instance subnet',
      vpcSubnets: this.props.vpc.selectSubnets({
        subnetType:
          this.props.environment === 'dev' ? SubnetType.PUBLIC : SubnetType.PRIVATE_ISOLATED,
        availabilityZones: this.props.vpc.availabilityZones,
      }),
    });
  }
}
