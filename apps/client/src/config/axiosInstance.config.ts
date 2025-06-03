import { COOKIE_STORAGE_KEYS } from '../constants/cookieKeys.constants';
import axios, { AxiosInstance } from 'axios';
import Cookies from 'js-cookie';

const axiosClient: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// All requests will wait 45 seconds before timeout
axiosClient.defaults.timeout = 45000;

axiosClient.defaults.withCredentials = true;

axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = Cookies.get(COOKIE_STORAGE_KEYS.ACCESS_TOKEN);

      if (accessToken) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access here
    }
    return Promise.reject(error?.response);
  },
);

export default axiosClient;
