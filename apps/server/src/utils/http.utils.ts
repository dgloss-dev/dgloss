import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { ThrowError } from './error.utils';

interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

export class HttpClient {
  private client: AxiosInstance;

  constructor(config: HttpClientConfig = {}) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(ThrowError(error));
      },
    );
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client(config);
      return response.data;
    } catch (error) {
      const axiosError = (error as any)?.response;
      const apiUrl = axiosError?.config?.url;

      const errorWithAxiosFlag = {
        AXIOS_ERROR: true,
        url: /^https?:\/\//.test(apiUrl)
          ? apiUrl.replace(/^https?:\/\/[^/]+\//, '')
          : apiUrl || null,
        error: axiosError?.data || null,
        method: config.method || null,
        data: config.data || null,
      };

      console.log(JSON.stringify(errorWithAxiosFlag));
      throw ThrowError(error);
    }
  }

  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params: options.params,
      headers: options.headers,
      timeout: options.timeout,
    });
  }

  async post<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      params: options.params,
      headers: options.headers,
      timeout: options.timeout,
    });
  }

  async put<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      params: options.params,
      headers: options.headers,
      timeout: options.timeout,
    });
  }

  async patch<T>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      params: options.params,
      headers: options.headers,
      timeout: options.timeout,
    });
  }

  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
      params: options.params,
      headers: options.headers,
      timeout: options.timeout,
    });
  }
}
