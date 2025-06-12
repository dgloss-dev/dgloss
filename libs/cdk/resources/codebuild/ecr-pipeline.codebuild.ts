import { SecretValue, Stack } from 'aws-cdk-lib';
import {
  BuildSpec,
  EventAction,
  FilterGroup,
  GitHubSourceCredentials,
  LinuxBuildImage,
  Project,
  Source,
} from 'aws-cdk-lib/aws-codebuild';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

import { VPCStackProps } from '../lib';

interface Props extends VPCStackProps {
  gitRepo: {
    owner: string;
    name: string;
    branch: string;
    authToken: string;
  };
}

export class ECRPipeline {
  private ecrRepository: Repository;

  constructor(
    private readonly stack: Stack,
    private readonly props: Props,
  ) {
    this.initialize();
  }

  public get getECRRepository() {
    return this.ecrRepository;
  }

  private initialize() {
    this.createECRRepository();
    this.createDeploymentPipeline();
  }

  private createECRRepository() {
    const repositoryName = `dgloss-repository-${this.props.environment}`;

    this.ecrRepository = new Repository(this.stack, `DglossECR-${this.props.environment}`, {
      repositoryName,
    });

    // Remove outdated images
    this.ecrRepository.addLifecycleRule({
      rulePriority: 1,
      description: 'Retain only the latest image',
      maxImageCount: 1,
    });
  }

  private createDeploymentPipeline() {
    this.createRepoAccessToken();
    this.createPipeline();
    this.grantAppRunnerPullAccess();
  }

  private createRepoAccessToken() {
    // Create only a single token
    if (this.props.environment === 'dev') {
      new GitHubSourceCredentials(this.stack, 'DglossGitHubCredentials', {
        accessToken: SecretValue.secretsManager(this.props.gitRepo.authToken, {
          jsonField: 'token',
        }),
      });
    }
  }

  private createPipeline() {
    new Project(this.stack, `DglossBuildPipeline-${this.props.environment}`, {
      role: this.createBuildProjectRole(),
      projectName: `DglossServerPipeline-${this.props.environment}`,
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2_5,
        privileged: true,
      },
      environmentVariables: {
        REPOSITORY_URI: {
          value: this.ecrRepository.repositoryUri,
        },
        AWS_REGION: {
          value: this.stack.region,
        },
        AWS_ACCOUNT_ID: {
          value: this.stack.account,
        },
        ECR_ENVIRONMENT: {
          value: this.props.environment,
        },
      },
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: [
              'echo Logging in to Amazon ECR...',
              'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $REPOSITORY_URI',
            ],
          },
          build: {
            commands: [
              'echo Building the Docker image on date',
              'docker build -f apps/server/Dockerfile --build-arg ECR_ENVIRONMENT=$ECR_ENVIRONMENT -t $REPOSITORY_URI:latest .',
            ],
          },
          post_build: {
            commands: [
              'echo Pushing the Docker image to ECR...',
              'docker push $REPOSITORY_URI:latest',
            ],
          },
        },
      }),
      source: Source.gitHub({
        owner: this.props.gitRepo.owner,
        repo: this.props.gitRepo.name,
        branchOrRef: this.props.gitRepo.branch,
        webhookFilters: [
          // Trigger when the backend itself is updated
          FilterGroup.inEventOf(EventAction.PUSH)
            .andBranchIs(this.props.gitRepo.branch)
            .andFilePathIs('apps/server/'),

          // Trigger when shared types are updated
          FilterGroup.inEventOf(EventAction.PUSH)
            .andBranchIs(this.props.gitRepo.branch)
            .andFilePathIs('libs/types/'),

          // Trigger when a new package is installed
          FilterGroup.inEventOf(EventAction.PUSH)
            .andBranchIs(this.props.gitRepo.branch)
            .andFilePathIs('package.json'),
        ],
      }),
    });
  }

  private grantAppRunnerPullAccess() {
    const ecrPullPermission = new Role(
      this.stack,
      `DglossAppRunnerTasksRole-${this.props.environment}`,
      {
        assumedBy: new ServicePrincipal('tasks.apprunner.amazonaws.com'),
      },
    );

    this.ecrRepository.grantPullPush(ecrPullPermission);
  }

  private createBuildProjectRole() {
    const buildProjectRole = new Role(this.stack, `DglossBuildRole-${this.props.environment}`, {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
    });

    buildProjectRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'ecr:GetDownloadUrlForLayer',
          'ecr:BatchGetImage',
          'ecr:GetAuthorizationToken',
          'ecr:BatchCheckLayerAvailability',
          'ecr:PutImage',
          'ecr:CompleteLayerUpload',
          'ecr:InitiateLayerUpload',
          'ecr:UploadLayerPart',
        ],
        resources: ['*'],
      }),
    );

    return buildProjectRole;
  }
}
