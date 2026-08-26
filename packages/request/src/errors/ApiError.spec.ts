import { describe, expect, test } from 'bun:test';
import { ApiError } from './ApiError';
import { CanceledError } from './CanceledError';
import { NetworkError } from './NetworkError';
import { ResponseError } from './ResponseError';
import { TimeoutError } from './TimeoutError';

describe('ApiError', () => {
  test('sets its tag, name, and cause', () => {
    const cause = new Error('cause');
    const error = new ApiError('message', { cause });

    expect(error._tag).toBe('__XSTOOLS_REQUEST__API_ERROR');
    expect(error.name).toBe('ApiError');
    expect(error.message).toBe('message');
    expect(error.cause).toBe(cause);
    expect(error).toBeInstanceOf(ApiError);
    expect(ApiError.is(error)).toBe(true);
  });

  test('is not identified as a specialized error', () => {
    const error = new ApiError('message');

    expect(CanceledError.is(error)).toBe(false);
    expect(NetworkError.is(error)).toBe(false);
    expect(ResponseError.is(error)).toBe(false);
    expect(TimeoutError.is(error)).toBe(false);
  });
});
