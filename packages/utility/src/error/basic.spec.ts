import { describe, expect, test } from 'bun:test';
import { AbortError, LogicError, ParamError, TimeoutError } from './basic';
import { isTaggedError } from './factory/isTaggedError';

describe('basic', () => {
  test('LogicError', () => {
    const error = new LogicError();

    expect(error).toBeInstanceOf(LogicError);
    expect(error.name).toBe('LogicError');
    expect(error._tag).toBe('__XSTOOLS_UTILITY__LOGIC_ERROR');
    expect(error.message).toBe('LOGIC_ERROR');
    expect(new LogicError('xxx').message).toBe('xxx');

    expect(isTaggedError(error)).toBe(true);
    expect(isTaggedError(error, LogicError)).toBe(true);
    expect(isTaggedError(error, Error as any)).toBe(true); // 意义不大
    expect(error instanceof LogicError).toBe(true);
    expect(error instanceof Error).toBe(true);
    expect(LogicError.is(error)).toBe(true);
    expect(LogicError.is(new Error('plain error'))).toBe(false);
  });

  test('AbortError', () => {
    const error = new AbortError();

    expect(error).toBeInstanceOf(AbortError);
    expect(error.name).toBe('AbortError');
    expect(error._tag).toBe('__XSTOOLS_UTILITY__ABORT_ERROR');
    expect(error.message).toBe('ABORT_ERROR');
    expect(new AbortError('xxx').message).toBe('xxx');

    expect(isTaggedError(error)).toBe(true);
    expect(isTaggedError(error, AbortError)).toBe(true);
    expect(isTaggedError(error, Error as any)).toBe(true); // 意义不大
    expect(error instanceof AbortError).toBe(true);
    expect(error instanceof Error).toBe(true);
    expect(AbortError.is(error)).toBe(true);
    expect(AbortError.is(new Error('plain error'))).toBe(false);
  });

  test('ParamError', () => {
    const error = new ParamError();

    expect(error).toBeInstanceOf(ParamError);
    expect(error.name).toBe('ParamError');
    expect(error._tag).toBe('__XSTOOLS_UTILITY__PARAM_ERROR');
    expect(error.message).toBe('PARAM_ERROR');
    expect(new ParamError('xxx').message).toBe('xxx');

    expect(isTaggedError(error)).toBe(true);
    expect(isTaggedError(error, ParamError)).toBe(true);
    expect(isTaggedError(error, Error as any)).toBe(true); // 意义不大
    expect(error instanceof ParamError).toBe(true);
    expect(error instanceof Error).toBe(true);
    expect(ParamError.is(error)).toBe(true);
    expect(ParamError.is(new Error('plain error'))).toBe(false);
  });

  test('TimeoutError', () => {
    const error = new TimeoutError();

    expect(error).toBeInstanceOf(TimeoutError);
    expect(error.name).toBe('TimeoutError');
    expect(error._tag).toBe('__XSTOOLS_UTILITY__TIMEOUT_ERROR');
    expect(error.message).toBe('TIMEOUT_ERROR');
    expect(new TimeoutError('xxx').message).toBe('xxx');

    expect(isTaggedError(error)).toBe(true);
    expect(isTaggedError(error, TimeoutError)).toBe(true);
    expect(isTaggedError(error, Error as any)).toBe(true); // 意义不大
    expect(error instanceof TimeoutError).toBe(true);
    expect(error instanceof Error).toBe(true);
    expect(TimeoutError.is(error)).toBe(true);
    expect(TimeoutError.is(new Error('plain error'))).toBe(false);
  });
});
