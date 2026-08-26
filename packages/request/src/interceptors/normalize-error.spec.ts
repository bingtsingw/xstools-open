import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { describe, expect, test } from 'bun:test';
import { CanceledError, NetworkError, ResponseError, TimeoutError } from '../errors';
import { getCode, getMessage, normalizeError } from './normalize-error';

const res01 = {
  data: {
    errors: [
      {
        code: 'I400BR',
        message: 'Bad Request',
        status: 400,
        title: 'Bad Request',
      },
    ],
  },
  status: 400,
};

const res02 = {
  data: {
    code: 'I404NR',
    message: 'Not Found',
    status: 404,
    title: 'Not Found',
  },
  status: 404,
};

const res03 = {
  data: 'Not Found',
  status: 404,
};

describe('normalize-error', () => {
  test('getMessage', () => {
    expect(getMessage(res01 as AxiosResponse<unknown, unknown>, '未知错误')).toBe('Bad Request');
    expect(getMessage(res02 as AxiosResponse<unknown, unknown>, '未知错误')).toBe('Not Found');
    expect(getMessage(res03 as AxiosResponse<unknown, unknown>, '未知错误')).toBe('Not Found');
    expect(getMessage(undefined, '未知错误')).toBe('未知错误');
  });

  test('getCode', () => {
    expect(getCode(res01 as AxiosResponse<unknown, unknown>)).toBe('I400BR');
    expect(getCode(res02 as AxiosResponse<unknown, unknown>)).toBe('I404NR');
    expect(getCode(res03 as AxiosResponse<unknown, unknown>)).toBe('404');
    expect(getCode(undefined)).toBe('');
  });

  test('normalizes HTTP failures and preserves their response and cause', () => {
    const response = res01 as AxiosResponse<unknown, unknown>;
    const source = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, response);

    try {
      normalizeError(source);
      throw new Error('Expected normalizeError to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseError);
      expect(error).toMatchObject({
        message: 'Bad Request',
        code: 'I400BR',
        status: 400,
        response,
        cause: source,
      });
    }
  });

  test('normalizes cancellation, timeout, and network failures', () => {
    const cases = [
      [new AxiosError('canceled', AxiosError.ERR_CANCELED), CanceledError],
      [new AxiosError('timeout of 1000ms exceeded', AxiosError.ECONNABORTED), TimeoutError],
      [new AxiosError('timeout exceeded', AxiosError.ETIMEDOUT), TimeoutError],
      [new AxiosError('network', 'ERR_NETWORK'), NetworkError],
      [new AxiosError('Request aborted', AxiosError.ECONNABORTED), NetworkError],
    ] as const;

    for (const [source, ErrorClass] of cases) {
      try {
        normalizeError(source);
        throw new Error('Expected normalizeError to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorClass);
        expect(error).toMatchObject({ code: source.code, cause: source });
      }
    }
  });

  test('treats a custom timeoutErrorMessage as a timeout', () => {
    const source = new AxiosError('took too long', AxiosError.ECONNABORTED, {
      timeoutErrorMessage: 'took too long',
    } as InternalAxiosRequestConfig);

    try {
      normalizeError(source);
      throw new Error('Expected normalizeError to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(TimeoutError);
      expect(error).toMatchObject({ code: source.code, cause: source });
    }
  });

  test('passes non-Axios errors through unchanged', () => {
    const source = new Error('unexpected');

    try {
      normalizeError(source);
      throw new Error('Expected normalizeError to throw');
    } catch (error) {
      expect(error).toBe(source);
    }
  });
});
