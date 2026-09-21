import { describe, expect, test } from 'bun:test';
import { SdkException, SdkExceptionInternalError, SdkExceptionLogicRejected, SdkExceptionResponse } from './exception';
import { DINGTALK } from './source';

describe('exception', async () => {
  test('utility exceptions preserve non-Error causes and remain distinguishable', () => {
    const cause = { code: 'SOURCE_FAILURE' };
    const error = new SdkExceptionInternalError(
      { source: 'UTILS', operation: 'streamToBuffer', message: 'failed' },
      { cause },
    );
    expect(error.cause).toBe(cause);
    expect(SdkException.is(error)).toBe(true);
    expect(SdkExceptionInternalError.is(error)).toBe(true);
    expect(SdkExceptionResponse.is(error)).toBe(false);
    expect(SdkExceptionLogicRejected.is(error)).toBe(false);
    expect(SdkException.is(null)).toBe(false);
    expect(SdkException.is(new Error('plain'))).toBe(false);
  });

  test('SdkException', async () => {
    const err = new SdkException({ source: DINGTALK, operation: 'doRequest', message: 'test' });

    expect(SdkException.is(err)).toBe(true);
    expect(err instanceof SdkException).toBe(true);
    expect(err instanceof Error).toBe(true);

    expect(err.message).toBe('test');
    expect(err.source).toBe(DINGTALK);
    expect(err.operation).toBe('doRequest');
    expect(err._tag).toBe('__XSTOOLS_SDK__EXCEPTION');
  });

  test('SdkExceptionResponse', async () => {
    const err = new SdkExceptionResponse({ source: DINGTALK, operation: 'doRequest', message: 'test' });

    expect(SdkException.is(err)).toBe(true);
    expect(err instanceof SdkException).toBe(true);
    expect(SdkExceptionResponse.is(err)).toBe(true);
    expect(err instanceof SdkExceptionResponse).toBe(true);
    expect(err instanceof Error).toBe(true);

    expect(err.message).toBe('test');
    expect(err.source).toBe(DINGTALK);
    expect(err.operation).toBe('doRequest');
    expect(err._tag).toBe('__XSTOOLS_SDK__EXCEPTION_RESPONSE');
  });

  test('SdkExceptionLogicRejected', async () => {
    const err = new SdkExceptionLogicRejected({ source: DINGTALK, operation: 'doRequest', message: 'test' });

    expect(SdkException.is(err)).toBe(true);
    expect(err instanceof SdkException).toBe(true);
    expect(SdkExceptionLogicRejected.is(err)).toBe(true);
    expect(err instanceof SdkExceptionLogicRejected).toBe(true);
    expect(err instanceof Error).toBe(true);

    expect(err.message).toBe('test');
    expect(err.source).toBe(DINGTALK);
    expect(err.operation).toBe('doRequest');
    expect(err._tag).toBe('__XSTOOLS_SDK__EXCEPTION_LOGIC_REJECTED');
  });

  test('SdkExceptionInternalError', async () => {
    const err = new SdkExceptionInternalError({ source: DINGTALK, operation: 'doRequest', message: 'test' });

    expect(SdkException.is(err)).toBe(true);
    expect(err instanceof SdkException).toBe(true);
    expect(SdkExceptionInternalError.is(err)).toBe(true);
    expect(err instanceof SdkExceptionInternalError).toBe(true);
    expect(err instanceof Error).toBe(true);

    expect(err.message).toBe('test');
    expect(err.source).toBe(DINGTALK);
    expect(err.operation).toBe('doRequest');
    expect(err._tag).toBe('__XSTOOLS_SDK__EXCEPTION_INTERNAL_ERROR');
  });
});
