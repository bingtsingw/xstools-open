import type { AxiosResponse } from 'axios';
import { describe, expect, test } from 'bun:test';
import { createInstance, createRequest } from './request';

describe('request', () => {
  test('keeps successful responses intact and preserves response generics', async () => {
    const response: AxiosResponse<{ ok: boolean }> = await createInstance({
      baseURL: 'https://example.com',
    }).request<{ ok: boolean }>({
      method: 'get',
      url: '/health',
      adapter: async (config) => ({
        data: { ok: true },
        status: 200,
        statusText: 'OK',
        headers: { 'x-request-id': 'request-1' },
        config,
      }),
    });

    expect(response).toMatchObject({
      data: { ok: true },
      status: 200,
      statusText: 'OK',
      headers: { 'x-request-id': 'request-1' },
      config: { url: '/health' },
    });
  });

  test('uses native PATCH by default', async () => {
    await createInstance({ baseURL: 'https://example.com' }).request({
      method: 'patch',
      url: '/profile',
      adapter: async (config) => {
        expect(config.method).toBe('patch');
        expect(config.params).toBe(undefined);
        expect(config.headers.has('X-HTTP-Method-Override')).toBe(false);

        return { data: null, status: 204, statusText: 'No Content', headers: {}, config };
      },
    });
  });

  test('spoofs PATCH only when enabled', async () => {
    await createInstance({ baseURL: 'https://example.com', methodSpoofing: true }).request({
      method: 'patch',
      url: '/profile',
      params: { page: 1 },
      adapter: async (config) => {
        expect(config.method).toBe('post');
        expect(config.params).toEqual({ page: 1, _method: 'patch' });
        expect(config.headers.get('X-HTTP-Method-Override')).toBe('patch');

        return { data: null, status: 204, statusText: 'No Content', headers: {}, config };
      },
    });
  });

  test('refreshes and overrides Authorization for every request', async () => {
    let tokenCalls = 0;
    const request = createRequest({
      baseURL: 'https://example.com',
      headers: { Authorization: 'Bearer instance-token' },
      tokenProvider: async () => `token-${++tokenCalls}`,
    });

    for (const expectedToken of ['token-1', 'token-2']) {
      await request.request({
        method: 'get',
        url: '/profile',
        headers: { Authorization: 'Bearer request-token' },
        adapter: async (config) => {
          expect(config.headers.get('Authorization')).toBe(`Bearer ${expectedToken}`);
          return { data: null, status: 204, statusText: 'No Content', headers: {}, config };
        },
      });
    }

    expect(tokenCalls).toBe(2);
  });
});
