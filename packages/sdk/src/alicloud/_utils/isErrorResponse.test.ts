import { describe, expect, test } from 'bun:test';
import { isErrorAlicloudCode } from './isErrorResponse';

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

  test('ignores HTTP status without a Code', () => {
    expect(isErrorAlicloudCode({ response: new Response(null, { status: 500 }), data: undefined })).toBeNull();
  });
});
