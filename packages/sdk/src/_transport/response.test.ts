import { describe, expect, test } from 'bun:test';
import { isErrorHttpNotOk, readJsonBody } from './response';

describe('readJsonBody', () => {
  test('returns undefined for 204', async () => {
    const response = new Response(null, { status: 204 });

    expect(await readJsonBody(response)).toBeUndefined();
  });

  test('returns undefined for empty body', async () => {
    const response = new Response('   ', { status: 200 });

    expect(await readJsonBody(response)).toBeUndefined();
  });

  test('parses JSON from response text', async () => {
    const response = new Response('{"ok":true}', { status: 200 });

    expect(await readJsonBody<{ ok: boolean }>(response)).toEqual({ ok: true });
  });
});

describe('isErrorHttpNotOk', () => {
  test('isErrorHttpNotOk detects non-2xx', () => {
    const response = new Response(null, { status: 500, statusText: 'Internal Server Error' });

    expect(isErrorHttpNotOk({ response, data: undefined })).toMatchObject({ status: 500 });
  });
});
