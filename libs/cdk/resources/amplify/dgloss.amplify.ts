import { CfnOutput, SecretValue, Stack } from "aws-cdk-lib";

import {
  App,
  GitHubSourceCodeProvider,
  Platform,
} from "@aws-cdk/aws-amplify-alpha";

import { VPCStackProps } from "../lib";

interface Props extends VPCStackProps {
  appName: string;
  gitRepo: {
    owner: string;
    name: string;
    branch: string;
    authToken: string;
  };
}

export class DglossAmplify {
  private amplifyApp: App;

  constructor(private readonly stack: Stack, private readonly props: Props) {
    this.initialize();
  }

  private initialize() {
    this.createApp();
  }

  private createApp() {
    this.amplifyApp = new App(
      this.stack,
      `DglossAmplify-${this.props.environment}`,
      {
        appName: this.props.appName,
        sourceCodeProvider: new GitHubSourceCodeProvider({
          owner: this.props.gitRepo.owner,
          repository: this.props.gitRepo.name,
          oauthToken: SecretValue.secretsManager(this.props.gitRepo.authToken, {
            jsonField: "token",
          }),
        }),
        environmentVariables: {
          AMPLIFY_ENVIRONMENT: this.props.environment,
        },
        platform: Platform.WEB_COMPUTE,
      }
    );

    this.amplifyApp.addBranch(this.props.gitRepo.branch, {
      branchName: this.props.gitRepo.branch,
    });

    new CfnOutput(this.stack, `DglossAmplifyId-${this.props.environment}`, {
      value: this.amplifyApp.appId,
    });
  }
}
