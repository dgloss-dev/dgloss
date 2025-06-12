import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export const SchedulerPolicy = (resources: string[]) => {
  const schedulerPolicy = new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      'scheduler:CreateSchedule',
      'scheduler:UpdateSchedule',
      'scheduler:DeleteSchedule',
      'scheduler:GetSchedule',
    ],
    resources: resources,
  });

  return schedulerPolicy;
}; 