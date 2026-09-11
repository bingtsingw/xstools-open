import { afterEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { createHash } from 'crypto';
import { signV3 } from './signV3';

const EMPTY_BODY_SHA256 = createHash('sha256').update('').digest('hex');

describe('signV3', () => {
  afterEach(() => {
    mock.restore();
  });

  const freezeSignInputs = () => {
    spyOn(Date.prototype, 'toJSON').mockReturnValue('2024-01-01T00:00:00.000Z');
    spyOn(Math, 'random').mockReturnValue(0.123456789);
  };

  test('sets ACS3 headers and authorization', () => {
    freezeSignInputs();

    const headers: Record<string, string> = {
      'x-acs-action': 'SendSms',
      'x-acs-version': '2017-05-25',
    };

    const result = signV3({
      method: 'GET',
      url: 'https://dysmsapi.aliyuncs.com/?PhoneNumbers=13800138000',
      headers,
      ak: 'ak_test',
      sk: 'sk_test',
    });

    expect(headers).toEqual({
      'x-acs-action': 'SendSms',
      'x-acs-version': '2017-05-25',
    });
    expect(result.headers['host']).toBe('dysmsapi.aliyuncs.com');
    expect(result.headers['x-acs-date']).toBe('2024-01-01T00:00:00Z');
    expect(result.headers['x-acs-signature-nonce']).toBe((0.123456789).toString(36).substring(2, 15));
    expect(result.headers['x-acs-content-sha256']).toBe(EMPTY_BODY_SHA256);
    expect(result.authorization).toMatch(/^ACS3-HMAC-SHA256 Credential=ak_test,SignedHeaders=.+,Signature=[a-f0-9]+$/);
    expect(result.headers['authorization']).toBe(result.authorization);
  });

  test('matches the Alibaba Cloud ACS3 signing example', () => {
    const result = signV3({
      method: 'POST',
      url: 'https://ecs.cn-shanghai.aliyuncs.com/?ImageId=win2019_1809_x64_dtc_zh-cn_40G_alibase_20230811.vhd&RegionId=cn-shanghai',
      headers: {
        'x-acs-action': 'RunInstances',
        'x-acs-version': '2014-05-26',
        'x-acs-date': '2023-10-26T10:22:32Z',
        'x-acs-signature-nonce': '3156853299f313e23d1673dc12e1703d',
      },
      ak: 'YourAccessKeyId',
      sk: 'YourAccessKeySecret',
    });

    expect(result.signature).toBe('06563a9e1b43f5dfe96b81484da74bceab24a1d853912eee15083a6f0f3283c0');
    expect(result.authorization).toBe(
      'ACS3-HMAC-SHA256 Credential=YourAccessKeyId,SignedHeaders=host;x-acs-action;x-acs-content-sha256;x-acs-date;x-acs-signature-nonce;x-acs-version,Signature=06563a9e1b43f5dfe96b81484da74bceab24a1d853912eee15083a6f0f3283c0',
    );
  });

  test('canonicalizes query parameters before signing', () => {
    const input = {
      method: 'GET',
      headers: {
        'x-acs-action': 'DescribeInstances',
        'x-acs-version': '2014-05-26',
        'x-acs-date': '2024-01-01T00:00:00Z',
        'x-acs-signature-nonce': 'fixed-nonce',
      },
      ak: 'ak_test',
      sk: 'sk_test',
    } as const;

    const first = signV3({ ...input, url: 'https://ecs.aliyuncs.com/?Name=a%20b&Tag=%21' });
    const second = signV3({ ...input, url: 'https://ecs.aliyuncs.com/?Tag=!&Name=a%20b' });

    expect(first.signature).toBe(second.signature);
  });

  test('different body changes signature', () => {
    freezeSignInputs();

    const input = {
      method: 'POST',
      url: 'https://dysmsapi.aliyuncs.com/',
      ak: 'ak_test',
      sk: 'sk_test',
    } as const;

    const first = signV3({ ...input, headers: {}, body: '{"a":1}' });
    const second = signV3({ ...input, headers: {}, body: '{"a":2}' });

    expect(first.signature).not.toBe(second.signature);
  });

  test('normalizes header names before creating SignedHeaders', () => {
    freezeSignInputs();

    const result = signV3({
      method: 'POST',
      url: 'https://dysmsapi.aliyuncs.com/',
      headers: { 'Content-Type': 'text/plain', 'X-Acs-Custom': 'custom' },
      body: 'body',
      ak: 'ak_test',
      sk: 'sk_test',
    });

    expect(result.headers).toMatchObject({
      'content-type': 'text/plain',
      'x-acs-custom': 'custom',
    });
    expect(result.headers).not.toHaveProperty('Content-Type');
    expect(result.headers).not.toHaveProperty('X-Acs-Custom');
    expect(result.authorization).toContain(
      'SignedHeaders=content-type;host;x-acs-content-sha256;x-acs-custom;x-acs-date;x-acs-signature-nonce,',
    );
  });
});
