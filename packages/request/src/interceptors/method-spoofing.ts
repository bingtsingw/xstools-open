import type { InternalAxiosRequestConfig } from 'axios';

export const methodSpoofing = (config: InternalAxiosRequestConfig) => {
  if (config.method === 'patch') {
    config.headers.set('X-HTTP-Method-Override', 'patch');

    config.params = {
      ...config.params,
      _method: 'patch',
    };
    config.method = 'post';
  }

  return config;
};
