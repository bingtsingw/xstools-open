import { get } from '@xstools/utility/object';
import type { AxiosResponse } from 'axios';
import { AxiosError, isAxiosError, isCancel } from 'axios';
import { CanceledError, NetworkError, ResponseError, TimeoutError } from '../errors';

export const getMessage = (response: AxiosResponse<unknown, unknown> | undefined, defaultValue: string): string => {
  const errors = get<unknown[]>(response, 'data.errors');

  if (Array.isArray(errors) && errors.length > 0) {
    const error = errors[0];

    const message = get(error, 'message');
    if (typeof message === 'string') {
      return message;
    }
  }

  let message = get<string | undefined>(response, 'data.message');
  if (typeof message === 'string') {
    return message;
  }

  message = get<string | undefined>(response, 'data');
  if (typeof message === 'string') {
    return message;
  }

  return defaultValue;
};

export const getCode = (response: AxiosResponse<unknown, unknown> | undefined): string => {
  const errors = get<unknown[]>(response, 'data.errors');

  if (Array.isArray(errors) && errors.length > 0) {
    const error = errors[0];

    const code = get<string | number | undefined>(error, 'code');
    if (typeof code === 'string' || typeof code === 'number') {
      return code.toString();
    }
  }

  const code = get<string | number | undefined>(response, 'data.code');
  if (typeof code === 'string' || typeof code === 'number') {
    return code.toString();
  }

  const status = get<number | undefined>(response, 'status');

  return status ? status.toString() : '';
};

const isTimeout = (error: AxiosError): boolean => {
  if (error.code === AxiosError.ETIMEDOUT) {
    return true;
  }

  if (error.code !== AxiosError.ECONNABORTED) {
    return false;
  }

  if (/timeout/i.test(error.message)) {
    return true;
  }

  const timeoutErrorMessage = error.config?.timeoutErrorMessage;

  return typeof timeoutErrorMessage === 'string' && timeoutErrorMessage !== '' && error.message === timeoutErrorMessage;
};

export const normalizeError = (error: unknown): never => {
  if (!isAxiosError(error)) {
    throw error;
  }

  if (isCancel(error) || error.code === AxiosError.ERR_CANCELED) {
    throw new CanceledError({ code: error.code }, { cause: error });
  }

  if (isTimeout(error)) {
    throw new TimeoutError({ code: error.code }, { cause: error });
  }

  const response = error.response;

  if (!response) {
    throw new NetworkError({ message: '网络错误', code: error.code }, { cause: error });
  }

  const message = getMessage(response, '未知错误');
  const code = getCode(response);

  throw new ResponseError({ message, status: response.status, code, response }, { cause: error });
};
