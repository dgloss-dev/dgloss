import { cookies } from 'next/headers';
import axiosInstance from '../config/axiosInstance.config';
import { COOKIE_STORAGE_KEYS } from '../constants/cookieKeys.constants';

export const serverHttpGet = (url: string, params?: Record<string, any>) => {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  if (params) {
    config.params = params;
  }

  return axiosInstance.get(url, config);
};

export const serverHttpPost = <T>(url: string, data?: T) => {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.post(url, data, config);
};

export const serverHttpPut = <T>(url: string, data: T) => {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.put(url, data, config);
};

export const serverHttpPatch = <T>(url: string, data?: T) => {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.patch(url, data, config);
};

export const serverHttpDelete = (url: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.delete(url, config);
};
