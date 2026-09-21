import { describe, expect, test } from 'bun:test';
import { DINGTALK } from '../_errors/source';
import { SdkExceptionInternalError, SdkExceptionResponse } from '../_errors';
import { SdkHttp } from './http';
import { getResponse, readJsonBody, readJsonContent, responseStatus, type SdkIsError } from './response';

const isErrorByErrcode: SdkIsError = ({ response, data }) => {
  const body = data as { errcode?: unknown; errmsg?: unknown } | undefined;
  if (body && body.errcode !== undefined && body.errcode !== 0) {
    return { ...responseStatus(response), errcode: body.errcode, errmsg: body.errmsg };
  }

  return null;
};

const noopIsError: SdkIsError = () => null;

const respond = (response: Response) => async () => response;

describe('readJsonBody', () => {
  test('returns undefined for 204 and empty bodies', async () => {
    expect(await readJsonBody(new Response(null, { status: 204 }))).toBeUndefined();
    expect(await readJsonBody(new Response('   ', { status: 200 }))).toBeUndefined();
  });

  test('parses JSON on 2xx', async () => {
    expect(await readJsonBody(new Response('{"ok":true}', { status: 200 }))).toEqual({ ok: true });
  });

  test('returns raw text when non-2xx JSON parse fails', async () => {
    expect(await readJsonBody(new Response('gateway failure', { status: 502 }))).toBe('gateway failure');
  });

  test('throws when 2xx JSON parse fails', async () => {
    expect(readJsonBody(new Response('not-json', { status: 200 }))).rejects.toThrow(SyntaxError);
  });
});

describe('readJsonContent', () => {
  test('requires JSON content-type on 2xx', async () => {
    expect(readJsonContent(new Response('{"ok":true}', { status: 200 }), DINGTALK, 'doRequest')).rejects.toMatchObject({
      message: 'Content-Type Invalid',
    });

    expect(
      readJsonContent(
        new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'text/html' } }),
        DINGTALK,
        'doRequest',
      ),
    ).rejects.toMatchObject({ message: 'Content-Type Unsupported' });
  });

  test('parses JSON when the 2xx content-type is JSON', async () => {
    expect(
      await readJsonContent(
        new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } }),
        DINGTALK,
        'doRequest',
      ),
    ).toEqual({ ok: true });
  });

  test('skips the content-type check on non-2xx', async () => {
    expect(await readJsonContent(new Response('gateway failure', { status: 502 }), DINGTALK, 'doRequest')).toBe(
      'gateway failure',
    );
  });
});

describe('getResponse', () => {
  test('returns parsed 2xx JSON when isError is empty', async () => {
    const data = await getResponse({
      request: respond(new Response('{"ok":true}', { status: 200 })),
      source: DINGTALK,
      operation: 'doRequest',
      isError: isErrorByErrcode,
      read: readJsonBody,
    });

    expect(data).toEqual({ ok: true });
  });

  test('throws SdkExceptionResponse on 2xx vendor business codes', async () => {
    try {
      await getResponse({
        request: respond(new Response('{"errcode":40001,"errmsg":"invalid credential"}', { status: 200 })),
        source: DINGTALK,
        operation: 'doRequest',
        isError: isErrorByErrcode,
        read: readJsonBody,
      });
      throw new Error('expected to throw');
    } catch (error) {
      expect(SdkExceptionResponse.is(error)).toBe(true);
      expect(JSON.parse((error as SdkExceptionResponse).message)).toMatchObject({
        status: 200,
        errcode: 40001,
        errmsg: 'invalid credential',
      });
    }
  });

  test('merges non-2xx status with vendor fields from the body', async () => {
    expect(
      getResponse({
        request: respond(
          new Response('{"errcode":40001,"errmsg":"invalid credential"}', {
            status: 401,
            statusText: 'Unauthorized',
          }),
        ),
        source: DINGTALK,
        operation: 'doRequest',
        isError: isErrorByErrcode,
        read: readJsonBody,
      }),
    ).rejects.toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: DINGTALK,
      operation: 'doRequest',
      message: JSON.stringify({
        status: 401,
        statusText: 'Unauthorized',
        errcode: 40001,
        errmsg: 'invalid credential',
      }),
    });
  });

  test('puts truncated raw text in detail when non-2xx body is not a vendor error', async () => {
    const raw = `gateway failure ${'x'.repeat(2100)}`;

    try {
      await getResponse({
        request: respond(new Response(raw, { status: 502, statusText: 'Bad Gateway' })),
        source: DINGTALK,
        operation: 'doRequest',
        isError: noopIsError,
        read: readJsonBody,
      });
      throw new Error('expected to throw');
    } catch (error) {
      expect(SdkExceptionResponse.is(error)).toBe(true);
      const responseError = error as SdkExceptionResponse;
      const payload = JSON.parse(responseError.message) as { status: number; detail: string };
      expect(payload.status).toBe(502);
      expect(payload.detail).toBe(raw.slice(0, 2048));
      expect(payload.detail).toHaveLength(2048);
    }
  });

  test('puts JSON body in detail when non-2xx has no vendor fields', async () => {
    expect(
      getResponse({
        request: respond(
          Response.json({ message: 'server failure' }, { status: 500, statusText: 'Internal Server Error' }),
        ),
        source: DINGTALK,
        operation: 'doRequest',
        isError: isErrorByErrcode,
        read: readJsonBody,
      }),
    ).rejects.toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: DINGTALK,
      operation: 'doRequest',
      message: JSON.stringify({
        status: 500,
        statusText: 'Internal Server Error',
        detail: '{"message":"server failure"}',
      }),
    });
  });

  test('does not put binary bodies into detail', async () => {
    expect(
      getResponse({
        request: respond(new Response(new Uint8Array([0x89]), { status: 503, statusText: 'Service Unavailable' })),
        source: DINGTALK,
        operation: 'doRequest',
        isError: noopIsError,
        read: async (current) => current.arrayBuffer(),
      }),
    ).rejects.toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: DINGTALK,
      operation: 'doRequest',
      message: JSON.stringify({
        status: 503,
        statusText: 'Service Unavailable',
      }),
    });
  });

  test('wraps 2xx JSON parse failures as InternalError and keeps the cause', async () => {
    try {
      await getResponse({
        request: respond(new Response('not-json', { status: 200 })),
        source: DINGTALK,
        operation: 'doRequest',
        isError: noopIsError,
        read: readJsonBody,
      });
      throw new Error('expected to throw');
    } catch (error) {
      expect(SdkExceptionInternalError.is(error)).toBe(true);
      const internal = error as SdkExceptionInternalError;
      expect(internal.source).toBe(DINGTALK);
      expect(internal.operation).toBe('doRequest');
      expect(internal.cause).toBeInstanceOf(SyntaxError);
    }
  });

  test('rethrows SdkException from read without rewriting source', async () => {
    const original = new SdkExceptionResponse({
      source: DINGTALK,
      operation: 'doRequest',
      message: 'Content-Type Invalid',
    });

    try {
      await getResponse({
        request: respond(new Response('{}', { status: 200 })),
        source: DINGTALK,
        operation: 'doRequest',
        isError: noopIsError,
        read: async () => {
          throw original;
        },
      });
      throw new Error('expected to throw');
    } catch (error) {
      expect(error).toBe(original);
    }
  });

  test('maps successful data', async () => {
    const data = await getResponse({
      request: respond(new Response('{"data":{"id":1}}', { status: 200 })),
      source: DINGTALK,
      operation: 'doRequest',
      isError: noopIsError,
      read: readJsonBody,
      map: (body) => (body as { data: { id: number } }).data,
    });

    expect(data).toEqual({ id: 1 });
  });

  test('wraps map failures as InternalError', async () => {
    try {
      await getResponse({
        request: respond(new Response('{"data":"cipher"}', { status: 200 })),
        source: DINGTALK,
        operation: 'doRequest',
        isError: noopIsError,
        read: readJsonBody,
        map: () => {
          throw new TypeError('bad decrypt');
        },
      });
      throw new Error('expected to throw');
    } catch (error) {
      expect(SdkExceptionInternalError.is(error)).toBe(true);
      expect((error as SdkExceptionInternalError).message).toBe('bad decrypt');
      expect((error as SdkExceptionInternalError).cause).toBeInstanceOf(TypeError);
    }
  });

  test('returns JSON from a successful SdkHttp request', async () => {
    const http = new SdkHttp({
      fetch: async () => new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } }),
    });

    const data = await getResponse({
      request: () => http.request('https://example.test/ok', { method: 'POST', retry: 0 }),
      source: DINGTALK,
      operation: 'doRequest',
      isError: noopIsError,
      read: readJsonBody,
    });

    expect(data).toEqual({ ok: true });
  });

  test('wraps transport failures as InternalError', async () => {
    const http = new SdkHttp({
      fetch: async () => {
        throw new TypeError('fetch failed');
      },
    });

    try {
      await getResponse({
        request: () => http.request('https://example.test/fail', { method: 'POST', retry: 0 }),
        source: DINGTALK,
        operation: 'doRequest',
        isError: noopIsError,
        read: readJsonBody,
      });
      throw new Error('expected to throw');
    } catch (error) {
      expect(SdkExceptionInternalError.is(error)).toBe(true);
      const internal = error as SdkExceptionInternalError;
      expect(internal.source).toBe(DINGTALK);
      expect(internal.operation).toBe('doRequest');
      expect(internal.message).toContain('network error');
      expect(internal.cause).toBeInstanceOf(Error);
    }
  });

  test('puts the provided operation on the exception', async () => {
    expect(
      getResponse({
        request: respond(new Response('gateway', { status: 502, statusText: 'Bad Gateway' })),
        source: DINGTALK,
        operation: 'customRobotsSendGroupMessages',
        isError: noopIsError,
        read: readJsonBody,
      }),
    ).rejects.toMatchObject({
      source: DINGTALK,
      operation: 'customRobotsSendGroupMessages',
    });
  });
});
