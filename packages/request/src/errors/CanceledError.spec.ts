import { describe, expect, test } from 'bun:test';
import { ApiError } from './ApiError';
import { CanceledError } from './CanceledError';

describe('CanceledError', () => {
  test('sets its tag, name, inheritance, and cause', () => {
    const cause = new Error('cause');
    const error = new CanceledError({}, { cause });

    expect(error._tag).toBe('__XSTOOLS_REQUEST__CANCELED_ERROR');
    expect(error.name).toBe('CanceledError');
    expect(error.cause).toBe(cause);
    expect(error).toBeInstanceOf(CanceledError);
    expect(error).toBeInstanceOf(ApiError);
    expect(CanceledError.is(error)).toBe(true);
    expect(ApiError.is(error)).toBe(true);
  });

  test('sets explicit props', () => {
    const error = new CanceledError({ message: 'canceled', code: 'ERR_CANCELED' });

    expect(error.message).toBe('canceled');
    expect(error.code).toBe('ERR_CANCELED');
  });

  test('uses default props', () => {
    const error = new CanceledError();

    expect(error.message).toBe('请求已取消');
    expect(error.code).toBe('');
  });
});
