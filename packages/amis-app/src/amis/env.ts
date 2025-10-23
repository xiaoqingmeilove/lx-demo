import type { RuntimeEnv } from 'amis-core';
import axios from 'axios';
import { toast } from 'amis';
import { http } from '@/services/http';

export const amisEnv: RuntimeEnv = {
  fetcher: ({ url, method, data, responseType, config, headers }) => {
    return http.request({
      url,
      method,
      data,
      params: method === 'get' || method === 'delete' ? data : undefined,
      responseType,
      headers,
      ...config
    });
  },
  notify: (type, msg) => {
    const fn = toast[type];
    if (typeof fn === 'function') {
      fn(msg);
    }
  },
  jumpTo: (to) => {
    if (typeof to === 'string') {
      window.location.href = to;
    }
  },
  updateLocation: (location, replace) => {
    if (replace) {
      window.history.replaceState({}, '', location as string);
    } else {
      window.history.pushState({}, '', location as string);
    }
  },
  isCancel: (value) => axios.isCancel(value),
  copy: async (content) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(content);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }
};
