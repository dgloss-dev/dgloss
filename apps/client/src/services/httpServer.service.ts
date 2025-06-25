import { cookies } from 'next/headers';
import axiosInstance from '../config/axiosInstance.config';
import { COOKIE_STORAGE_KEYS } from '../constants/cookieKeys.constants';

export const serverHttpGet = async (url: string, params?: Record<string, any>) => {
  const cookieStore = await cookies();
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

export const serverHttpPost = async <T>(url: string, data?: T) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.post(url, data, config);
};

export const serverHttpPut = async <T>(url: string, data: T) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.put(url, data, config);
};

export const serverHttpPatch = async <T>(url: string, data?: T) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.patch(url, data, config);
};

export const serverHttpDelete = async (url: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN)?.value;
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.delete(url, config);
};
