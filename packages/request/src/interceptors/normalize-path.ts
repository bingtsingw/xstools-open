import { trim } from '@xstools/utility/string';
import type { InternalAxiosRequestConfig } from 'axios';

export const normalizePath = (config: InternalAxiosRequestConfig) => {
  return {
    ...config,
    baseURL: trim(config.baseURL, '/'),
  };
};
