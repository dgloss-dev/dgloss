const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
const CONTENT_URL = process.env.NEXT_PUBLIC_CONTENT_URL;
export const getCDNUrl = (url: string) => {
  return CDN_URL + (url || '/');
};

export const getContentUrl = (key: string) => {
  return CONTENT_URL + '/' + (key || '/');
};
