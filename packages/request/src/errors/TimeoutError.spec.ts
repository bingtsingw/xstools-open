import { describe, expect, test } from 'bun:test';
import { ApiError } from './ApiError';
import { TimeoutError } from './TimeoutError';

describe('TimeoutError', () => {
  test('sets its tag, name, inheritance, and cause', () => {
    const cause = new Error('cause');
    const error = new TimeoutError({}, { cause });

    expect(error._tag).toBe('__XSTOOLS_REQUEST__TIMEOUT_ERROR');
    expect(error.name).toBe('TimeoutError');
    expect(error.cause).toBe(cause);
    expect(error).toBeInstanceOf(TimeoutError);
    expect(error).toBeInstanceOf(ApiError);
    expect(TimeoutError.is(error)).toBe(true);
    expect(ApiError.is(error)).toBe(true);
  });

  test('sets explicit props', () => {
    const error = new TimeoutError({ message: 'timeout', code: 'ECONNABORTED' });

    expect(error.message).toBe('timeout');
    expect(error.code).toBe('ECONNABORTED');
  });

  test('uses default props', () => {
    const error = new TimeoutError();

    expect(error.message).toBe('请求超时');
    expect(error.code).toBe('');
  });
});
