import { describe, expect, test } from 'bun:test';
import type { SdkHttpOptions } from '../_transport';
import { XcloudClient } from './client';
import type { XcloudRequestOption } from './index';

const BASE_URL = 'https://api.example.test';

describe('XcloudClient', () => {
  describe('canvasDraw', () => {
    test('draws with the expected request', async () => {
      let calls = 0;
      const params = { title: 'offline product', cover: 'https://example.com/cover.png' };
      const client = new XcloudClient(
        { ak: 'ak_test', baseUrl: BASE_URL },
        {
          fetch: async (input, init) => {
            calls += 1;
            const request = new Request(input, init);
            expect(request.method).toBe('POST');
            expect(request.headers.get('Xcloud-Authorization')).toBe('ak_test');
            expect(request.url).toBe(`${BASE_URL}/canvas/draw`);
            expect(await request.json()).toEqual({ key: 'template_test', params });
            return Response.json({ data: { url: 'https://example.com/render.png' } });
          },
        },
      );
      const result = await client.canvasDraw({ templateKey: 'template_test', templateParam: params });

      expect(result).toBe('https://example.com/render.png');
      expect(calls).toBe(1);
    });
  });

  describe('citySearch', () => {
    test('preserves null when no city matches', async () => {
      const client = new XcloudClient(
        { ak: 'ak_test', baseUrl: BASE_URL },
        {
          fetch: async (input, init) => {
            const request = new Request(input, init);
            expect(request.method).toBe('GET');
            expect(new URL(request.url).searchParams.get('name')).toBe('missing');
            return Response.json({ data: null });
          },
        },
      );
      expect(await client.citySearch({ name: 'missing' })).toBeNull();
    });

    test('appends query params on GET', async () => {
      const fetchMock: NonNullable<SdkHttpOptions['fetch']> = async (input) => {
        const url = input instanceof Request ? input.url : String(input);

        expect(url).toContain(`${BASE_URL}/city/search`);
        expect(url).toContain('name=beijing');

        return Response.json({
          data: {
            code: '110000',
            name: '北京',
            pinyin: 'beijing',
            tz: 'Asia/Shanghai',
          },
        });
      };

      const client = new XcloudClient({ ak: 'ak_test', baseUrl: BASE_URL }, { fetch: fetchMock });
      const city = await client.citySearch({ name: 'beijing' });

      expect(city?.name).toBe('北京');
    });
  });

  describe('geoIpToLocation', () => {
    test('sends an authorization header and maps the response', async () => {
      const fetchMock: NonNullable<SdkHttpOptions['fetch']> = async (input, init) => {
        const url = input instanceof Request ? input.url : String(input);
        const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));

        expect(url).toContain(`${BASE_URL}/geo/ipToLocation`);
        expect(headers.get('Xcloud-Authorization')).toBe('ak_test');

        return Response.json({ data: { location: 'Beijing|China|CN|CN-BJ|Beijing|0|0|39.9042|116.4074' } });
      };

      const client = new XcloudClient({ ak: 'ak_test', baseUrl: BASE_URL }, { fetch: fetchMock });
      const location = await client.geoIpToLocation({ ip: '1.2.3.4' });

      expect(location).toContain('Beijing');
    });
  });

  describe('doRequest', () => {
    test('calls an arbitrary POST endpoint', async () => {
      const request: XcloudRequestOption = {
        method: 'POST',
        path: 'custom/action',
        body: { enabled: true },
      };
      const client = new XcloudClient(
        { ak: 'ak_test', baseUrl: BASE_URL },
        {
          fetch: async (input, init) => {
            const received = new Request(input, init);

            expect(received.method).toBe('POST');
            expect(received.url).toBe(`${BASE_URL}/custom/action`);
            expect(received.json()).resolves.toEqual({ enabled: true });

            return Response.json({ data: { accepted: true } });
          },
        },
      );

      expect(client.doRequest<{ accepted: boolean }>(request)).resolves.toEqual({ data: { accepted: true } });
    });
  });
});
