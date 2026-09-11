import { describe, expect, test } from 'bun:test';
import { isErrorAlicloudCode } from './response';

describe('isErrorAlicloudCode', () => {
  test('detects top-level and nested Aliyun error codes', () => {
    const response = new Response(null, { status: 200 });
    expect(
      isErrorAlicloudCode({ response, data: { Code: 'InvalidAccessKeyId', Message: 'invalid key' } }),
    ).toMatchObject({
      errcode: 'InvalidAccessKeyId',
      errmsg: 'invalid key',
    });
    expect(isErrorAlicloudCode({ response, data: { Error: { Code: 'NoSuchKey', Message: 'missing' } } })).toMatchObject(
      {
        errcode: 'NoSuchKey',
        errmsg: 'missing',
      },
    );
  });

  test('treats HTTP failures as errors even without a code', () => {
    expect(isErrorAlicloudCode({ response: new Response(null, { status: 500 }), data: undefined })).toMatchObject({
      status: 500,
    });
  });
});
