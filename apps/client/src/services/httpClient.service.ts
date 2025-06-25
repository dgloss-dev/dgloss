import axiosInstance from '../config/axiosInstance.config';
import { COOKIE_STORAGE_KEYS } from '../constants/cookieKeys.constants';
import Cookies from 'js-cookie';

export const httpGet = (url: string, params?: Record<string, any>) => {
  const token = Cookies.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN);
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

export const httpPost = <T>(url: string, data: T) => {
  const token = Cookies.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN);
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return axiosInstance.post(url, data, config);
};

export const httpPut = <T>(url: string, data: T) => {
  const token = Cookies.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN);
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.put(url, data, config);
};

export const httpPatch = <T>(url: string, data: T) => {
  const token = Cookies.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN);
  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.patch(url, data, config);
};

export const httpDelete = (url: string) => {
  const token = Cookies.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN);

  const config: Record<string, any> = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.delete(url, config);
};

export const httpDeleteWithData = <T>(url: string, data: T) => {
  const token = Cookies.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN);

  const config: Record<string, any> = {
    data: data,
  };

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return axiosInstance.delete(url, config);
};
