import { describe, expect, test } from 'bun:test';
import { SdkExceptionResponse } from '../../_errors';
import type { SdkHttpOptions } from '../../_transport';
import { AlicloudClientDysmsapi20170525 } from './dysmsapi20170525';

const config = {
  accessKeyId: 'ak_test',
  accessKeySecret: 'sk_test',
};

describe('AlicloudClientDysmsapi20170525', () => {
  describe('sendSms', () => {
    test('cleans emoji sequences before serializing the request', async () => {
      let requestedUrl: URL | undefined;
      const fetchMock: NonNullable<SdkHttpOptions['fetch']> = async (input) => {
        requestedUrl = new URL(input instanceof Request ? input.url : String(input));
        return Response.json({ Code: 'OK' });
      };
      const client = new AlicloudClientDysmsapi20170525(config, { fetch: fetchMock });
      const input = Object.freeze({
        PhoneNumbers: '13800138000',
        SignName: '测试❤️',
        TemplateCode: 'SMS_123',
        TemplateParam: JSON.stringify({ name: '张三👨‍👩‍👧‍👦👍🏽🇨🇳1️⃣', code: '123 # *' }),
      });
      await client.sendSms(input);
      expect(requestedUrl?.searchParams.get('SignName')).toBe('测试');
      expect(requestedUrl?.searchParams.get('TemplateParam')).toBe(JSON.stringify({ name: '张三', code: '123 # *' }));
      expect(requestedUrl?.searchParams.get('PhoneNumbers')).toBe(input.PhoneNumbers);
      expect(requestedUrl?.searchParams.get('TemplateCode')).toBe(input.TemplateCode);
      expect(input.SignName).toBe('测试❤️');
    });

    test('does not retry after a network error', async () => {
      let calls = 0;
      const client = new AlicloudClientDysmsapi20170525(config, {
        fetch: async () => {
          calls++;
          throw new TypeError('fetch failed');
        },
      });

      try {
        await client.sendSms({
          PhoneNumbers: '13800138000',
          SignName: '测试',
          TemplateCode: 'SMS_123',
          TemplateParam: '{}',
        });
      } catch {
        // The assertion below verifies the request was not retried.
      }

      expect(calls).toBe(1);
    });
  });

  describe('doRequest', () => {
    test('preserves raw string bodies and normalizes headers before signing', async () => {
      let request: Request | undefined;
      const client = new AlicloudClientDysmsapi20170525(config, {
        fetch: async (input, init) => {
          request = new Request(input, init);
          return Response.json({ Code: 'OK' });
        },
      });

      await client.doRequest({
        method: 'POST',
        action: 'CustomAction',
        headers: {
          'Content-Type': 'text/plain',
          'X-Acs-Custom': 'custom',
        },
        body: '{"value":1}',
      });

      expect(await request?.text()).toBe('{"value":1}');
      expect(request?.headers.get('content-type')).toBe('text/plain');
      expect(request?.headers.get('x-acs-custom')).toBe('custom');
      expect(request?.headers.get('authorization')).toContain(
        'SignedHeaders=content-type;host;x-acs-action;x-acs-content-sha256;x-acs-custom;x-acs-date;x-acs-signature-nonce;x-acs-version,',
      );
    });

    test('keeps default retries for a GET request', async () => {
      let calls = 0;
      const client = new AlicloudClientDysmsapi20170525(config, {
        fetch: async () => {
          calls++;
          throw new TypeError('fetch failed');
        },
      });

      try {
        await client.doRequest({ method: 'GET', action: 'QuerySendDetails' });
      } catch {
        // The assertion below verifies the default GET retry policy remains available.
      }

      expect(calls).toBe(3);
    });

    test('returns JSON when Code is OK', async () => {
      const fetchMock: NonNullable<SdkHttpOptions['fetch']> = async () =>
        Response.json({ Code: 'OK', BizId: 'biz_test' });

      const client = new AlicloudClientDysmsapi20170525(config, { fetch: fetchMock });
      const result = await client.doRequest<{ Code: string; BizId: string }>({
        method: 'GET',
        action: 'QuerySendDetails',
        params: { PhoneNumber: '13800138000' },
      });

      expect(result).toEqual({ Code: 'OK', BizId: 'biz_test' });
    });

    test('throws SdkExceptionResponse when Code is not OK', async () => {
      const fetchMock: NonNullable<SdkHttpOptions['fetch']> = async () =>
        Response.json({ Code: 'isv.BUSINESS_LIMIT_CONTROL', Message: '触发小时级流控' });

      const client = new AlicloudClientDysmsapi20170525(config, { fetch: fetchMock });

      expect(
        client.doRequest({
          method: 'GET',
          action: 'SendSms',
          params: { PhoneNumbers: '13800138000' },
        }),
      ).rejects.toThrow(SdkExceptionResponse);
    });
  });
});
