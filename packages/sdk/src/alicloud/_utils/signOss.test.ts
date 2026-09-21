import { describe, expect, test } from 'bun:test';
import { signOss } from './signOss';

describe('signOss', () => {
  test('reproduces the official OSS V4 canonical request with a fixed secret', () => {
    const headers = {
      'content-disposition': 'attachment',
      'content-length': '3',
      'content-md5': 'ICy5YqxZB1uWSwcVLSNLcA==',
      'content-type': 'text/plain',
      'x-oss-date': '20250411T064124Z',
    };

    const result = signOss({
      config: {
        accessKeyId: 'LTAI****************',
        accessKeySecret: 'yourAccessKeySecret',
        region: 'cn-hangzhou',
        host: 'examplebucket.oss-cn-hangzhou.aliyuncs.com',
        bucket: 'examplebucket',
      },
      method: 'PUT',
      headers,
      object: 'exampleobject',
    });

    expect(headers).toEqual({
      'content-disposition': 'attachment',
      'content-length': '3',
      'content-md5': 'ICy5YqxZB1uWSwcVLSNLcA==',
      'content-type': 'text/plain',
      'x-oss-date': '20250411T064124Z',
    });
    expect(result['Authorization']).toBe(
      'OSS4-HMAC-SHA256 Credential=LTAI****************/20250411/cn-hangzhou/oss/aliyun_v4_request, AdditionalHeaders=content-disposition;content-length, Signature=d3694c2dfc5371ee6acd35e88c4871ac95a7ba01d3a2f476768fe61218590097',
    );
  });

  test('omits AdditionalHeaders when no optional header is signed', () => {
    const result = signOss({
      config: {
        accessKeyId: 'ak_test',
        accessKeySecret: 'sk_test',
        region: 'cn-hangzhou',
        host: 'bucket-test.oss-cn-hangzhou.aliyuncs.com',
        bucket: 'bucket-test',
      },
      method: 'DELETE',
      headers: { 'x-oss-date': '20250411T064124Z' },
      object: 'object.txt',
    });

    expect(result['Authorization']).not.toContain('AdditionalHeaders=');
  });
});
