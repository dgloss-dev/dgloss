import { AppConfig } from '../config';

export function getResourceIdFromARN(arn: string | undefined) {
  const parts = arn?.split('/');
  const resourceId = parts?.[parts.length - 1];
  return resourceId;
}
export function getArnFromId(id: string, resourceType: string, resource: string) {
  const arn = `arn:aws:${resourceType}:${AppConfig.APP_REGION}:${AppConfig.APP_ACCOUNT_ID}:${resource}/${id}`;
  return arn;
}
