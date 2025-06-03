import { CDN_URL, CONTENT_URL } from '@workspace/constants';

export const getCDNUrl = (url: string) => {
  return CDN_URL + (url || '/');
};

export const getContentUrl = (key: string) => {
  return CONTENT_URL + '/' + (key || '/');
};
