import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export class ApiError<T = unknown> extends Error {
  public readonly code: number;
  public readonly payload?: ApiResponse<T>;

  constructor(code: number, message: string, payload?: ApiResponse<T>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.payload = payload;
  }
}

export class HttpError extends Error {
  public readonly status?: number;
  public readonly response?: AxiosResponse;

  constructor(message: string, status?: number, response?: AxiosResponse) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.response = response;
  }
}

const TOKEN_STORAGE_KEY = 'access_token';

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  withCredentials: true
});

http.interceptors.request.use((config) => {
  const enrichedConfig = config as RequestConfig;
  if (!enrichedConfig.skipAuth) {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('app:unauthorized'));
    }

    const message =
      (error.response?.data as { message?: string } | undefined)?.message ?? error.message;
    return Promise.reject(new HttpError(message, status, error.response));
  }
);

export interface RequestConfig<T = unknown> extends AxiosRequestConfig<T> {
  skipAuth?: boolean;
}

export async function request<T = unknown>(config: RequestConfig): Promise<ApiResponse<T>> {
  const response = await http.request<ApiResponse<T>>(config);
  const payload = response.data;

  if (typeof payload === 'object' && payload !== null && 'code' in payload) {
    if (payload.code === 0 || payload.code === 200) {
      return payload;
    }

    throw new ApiError(payload.code, payload.message ?? '请求失败', payload);
  }

  throw new HttpError('无法解析的响应结构', response.status, response);
}

export const httpClient = {
  get: <T = unknown>(url: string, config?: RequestConfig) =>
    request<T>({ ...config, method: 'get', url }),
  post: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>({ ...config, method: 'post', url, data }),
  put: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>({ ...config, method: 'put', url, data }),
  patch: <T = unknown>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>({ ...config, method: 'patch', url, data }),
  delete: <T = unknown>(url: string, config?: RequestConfig) =>
    request<T>({ ...config, method: 'delete', url })
};

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export { http };
