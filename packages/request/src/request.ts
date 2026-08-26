import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { methodSpoofing } from './interceptors/method-spoofing';
import { normalizeError } from './interceptors/normalize-error';
import { normalizePath } from './interceptors/normalize-path';

export interface CreateInstanceOptions {
  baseURL: string;
  headers?: Record<string, string>;
  /** Convert PATCH requests to POST requests for compatibility. */
  methodSpoofing?: boolean;
}

export interface CreateRequestOptions extends CreateInstanceOptions {
  tokenProvider: () => Promise<string>;
}

export const createInstance = ({
  baseURL,
  headers,
  methodSpoofing: shouldSpoofMethod = false,
}: CreateInstanceOptions) => {
  const instance = axios.create({ baseURL, headers });

  if (shouldSpoofMethod) {
    instance.interceptors.request.use(methodSpoofing);
  }
  instance.interceptors.request.use(normalizePath);
  instance.interceptors.response.use(undefined, normalizeError);

  return instance;
};

export const createRequest = ({ baseURL, headers, methodSpoofing, tokenProvider }: CreateRequestOptions) => {
  const instance = createInstance({ baseURL, headers, methodSpoofing });

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await tokenProvider();
    config.headers.set('Authorization', `Bearer ${token}`);

    return config;
  });

  return instance;
};
