import { describe, expect, test } from 'bun:test';
import { ApiError } from './ApiError';
import { NetworkError } from './NetworkError';

describe('NetworkError', () => {
  test('sets its tag, name, inheritance, and cause', () => {
    const cause = new Error('cause');
    const error = new NetworkError({}, { cause });

    expect(error._tag).toBe('__XSTOOLS_REQUEST__NETWORK_ERROR');
    expect(error.name).toBe('NetworkError');
    expect(error.cause).toBe(cause);
    expect(error).toBeInstanceOf(NetworkError);
    expect(error).toBeInstanceOf(ApiError);
    expect(NetworkError.is(error)).toBe(true);
    expect(ApiError.is(error)).toBe(true);
  });

  test('sets explicit props', () => {
    const error = new NetworkError({ message: 'message', code: 'code' });

    expect(error.message).toBe('message');
    expect(error.code).toBe('code');
  });

  test('uses default props', () => {
    const error = new NetworkError();

    expect(error.message).toBe('网络错误');
    expect(error.code).toBe('');
  });
});
