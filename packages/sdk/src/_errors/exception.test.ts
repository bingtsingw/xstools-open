import { describe, expect, test } from 'bun:test';
import { DINGTALK } from './source';
import { SdkException, SdkExceptionInternalError, SdkExceptionLogicRejected, SdkExceptionResponse } from './exception';

describe('exception', async () => {
  test('utility exceptions preserve non-Error causes and remain distinguishable', () => {
    const cause = { code: 'SOURCE_FAILURE' };
    const error = new SdkExceptionInternalError(
      { source: 'UTILS', method: 'streamToBuffer', message: 'failed' },
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
    const err = new SdkException({ source: DINGTALK, method: 'getResponse', message: 'test' });

    expect(SdkException.is(err)).toBe(true);
    expect(err instanceof SdkException).toBe(true);
    expect(err instanceof Error).toBe(true);

    expect(err.message).toBe('test');
    expect(err._tag).toBe('__XSTOOLS_SDK__EXCEPTION');
    expect(err.log).toBe('[XSTOOLS_SDK:DINGTALK(getResponse)]: test');
  });

  test('SdkExceptionResponse', async () => {
    const err = new SdkExceptionResponse({ source: DINGTALK, method: 'getResponse', message: 'test' });

    expect(SdkException.is(err)).toBe(true);
    expect(err instanceof SdkException).toBe(true);
    expect(SdkExceptionResponse.is(err)).toBe(true);
    expect(err instanceof SdkExceptionResponse).toBe(true);
    expect(err instanceof Error).toBe(true);

    expect(err.message).toBe('test');
    expect(err._tag).toBe('__XSTOOLS_SDK__EXCEPTION_RESPONSE');
    expect(err.log).toBe('[XSTOOLS_SDK:DINGTALK(getResponse)]: test');
  });

  test('SdkExceptionLogicRejected', async () => {
    const err = new SdkExceptionLogicRejected({ source: DINGTALK, method: 'getResponse', message: 'test' });

    expect(SdkException.is(err)).toBe(true);
    expect(err instanceof SdkException).toBe(true);
    expect(SdkExceptionLogicRejected.is(err)).toBe(true);
    expect(err instanceof SdkExceptionLogicRejected).toBe(true);
    expect(err instanceof Error).toBe(true);

    expect(err.message).toBe('test');
    expect(err._tag).toBe('__XSTOOLS_SDK__EXCEPTION_LOGIC_REJECTED');
    expect(err.log).toBe('[XSTOOLS_SDK:DINGTALK(getResponse)]: test');
  });

  test('SdkExceptionInternalError', async () => {
    const err = new SdkExceptionInternalError({ source: DINGTALK, method: 'getResponse', message: 'test' });

    expect(SdkException.is(err)).toBe(true);
    expect(err instanceof SdkException).toBe(true);
    expect(SdkExceptionInternalError.is(err)).toBe(true);
    expect(err instanceof SdkExceptionInternalError).toBe(true);
    expect(err instanceof Error).toBe(true);

    expect(err.message).toBe('test');
    expect(err._tag).toBe('__XSTOOLS_SDK__EXCEPTION_INTERNAL_ERROR');
    expect(err.log).toBe('[XSTOOLS_SDK:DINGTALK(getResponse)]: test');
  });
});
