import { describe, expect, test } from 'bun:test';
import { SdkException, SdkExceptionInternalError, SdkExceptionLogicRejected, SdkExceptionResponse } from '../_errors';
import { utilsError } from './utilsError';

describe('utilsError', () => {
  test.each([SdkException, SdkExceptionInternalError, SdkExceptionLogicRejected, SdkExceptionResponse])(
    'preserves %s identity, source and cause through multiple utility layers',
    (Exception) => {
      const cause = new Error('original failure');
      const error = new Exception({ source: 'ALI-OSS', method: 'objectPut', message: 'failed' }, { cause });
      const result = utilsError('getDataInfo', utilsError('streamToBuffer', error));
      expect(result).toBe(error);
      expect(result.cause).toBe(cause);
      expect(result.log).toBe('[XSTOOLS_SDK:ALI-OSS(objectPut)]: failed');
    },
  );

  test('wraps native errors once and keeps their message and cause chain', () => {
    const root = new Error('socket closed');
    const cause = new TypeError('cannot read source', { cause: root });
    const error = utilsError('streamToBuffer', cause);
    expect(SdkExceptionInternalError.is(error)).toBe(true);
    expect(error.cause).toBe(cause);
    expect((error.cause as Error).cause).toBe(root);
    expect(error.message).toBe('cannot read source');
    expect(error.log).toBe('[XSTOOLS_SDK:UTILS(streamToBuffer)]: cannot read source');
    expect(utilsError('getDataInfo', error)).toBe(error);
  });

  test.each([undefined, null, false, 0, 'failure'])('preserves non-Error cause %s without coercion', (cause) => {
    const error = utilsError('parseXML', cause);
    expect(SdkExceptionInternalError.is(error)).toBe(true);
    expect(error.cause).toBe(cause);
    expect(error.message).toBe('Unknown utility error');
  });

  test('does not stringify arbitrary rejected objects', () => {
    const cause = {
      toString() {
        throw new Error('must not stringify');
      },
    };
    const error = utilsError('streamToBuffer', cause);
    expect(error.cause).toBe(cause);
    expect(error.message).toBe('Unknown utility error');
  });
});
