import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type RequestEvent = 'unauthorized' | 'document-deleted';

type RequestEventListener = (payload?: unknown) => void;

class RequestEventBus {
  private listeners: Map<RequestEvent, Set<RequestEventListener>> = new Map();

  on(event: RequestEvent, listener: RequestEventListener) {
    const set = this.listeners.get(event) ?? new Set<RequestEventListener>();
    set.add(listener);
    this.listeners.set(event, set);
    return () => this.off(event, listener);
  }

  off(event: RequestEvent, listener: RequestEventListener) {
    const set = this.listeners.get(event);
    if (!set) return;
    set.delete(listener);
  }

  emit(event: RequestEvent, payload?: unknown) {
    const set = this.listeners.get(event);
    if (!set) return;
    set.forEach((listener) => listener(payload));
  }
}

const requestEvents = new RequestEventBus();

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const createRequestClient = (): AxiosInstance => {
  const instance = axios.create({
    timeout: 60000,
  });

  instance.interceptors.request.use((config: AxiosRequestConfig) => {
    if (authToken && config.headers) {
      config.headers.Authorization = authToken;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const payload = response.data ?? {};
      if (payload.code === 401) {
        requestEvents.emit('unauthorized');
        return Promise.reject(new Error('Unauthorized'));
      }
      if (payload.code === 99404) {
        requestEvents.emit('document-deleted', payload?.data ?? payload);
      }
      return payload;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};

export const request = createRequestClient();
export { requestEvents };
