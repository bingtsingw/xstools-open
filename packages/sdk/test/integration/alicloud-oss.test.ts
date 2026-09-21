import { describe, expect, test } from 'bun:test';
import { AlicloudClientOss20190517 } from '@/src/alicloud';
import { ENV } from '../_env';
import { SdkExceptionResponse } from '@/src/_errors';

const PREFIX = 'xstools-sdk-test';

describe('alicloud-oss', () => {
  const client = new AlicloudClientOss20190517({
    region: ENV.ALICLOUD_OSS_REGION,
    host: ENV.ALICLOUD_OSS_HOST,
    bucket: ENV.ALICLOUD_OSS_BUCKET,
    accessKeyId: ENV.ALICLOUD_OSS_AK,
    accessKeySecret: ENV.ALICLOUD_OSS_SK,
  });

  test('client error: bad param', async () => {
    const client = new AlicloudClientOss20190517({
      region: '',
      host: ENV.ALICLOUD_OSS_HOST,
      bucket: ENV.ALICLOUD_OSS_BUCKET,
      accessKeyId: ENV.ALICLOUD_OSS_AK,
      accessKeySecret: ENV.ALICLOUD_OSS_SK,
    });

    let error: unknown;
    try {
      await client.objectDelete(`${PREFIX}/non-exist`);
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-OSS',
      operation: 'objectDelete',
      message: JSON.stringify({
        status: 400,
        statusText: 'Bad Request',
        errcode: 'InvalidArgument',
        errmsg: 'Invalid signing region in Authorization header.',
      }),
    });
  });

  test('client error: bad token', async () => {
    const client = new AlicloudClientOss20190517({
      region: ENV.ALICLOUD_OSS_REGION,
      host: ENV.ALICLOUD_OSS_HOST,
      bucket: ENV.ALICLOUD_OSS_BUCKET,
      accessKeyId: '',
      accessKeySecret: ENV.ALICLOUD_OSS_SK,
    });

    let error: unknown;
    try {
      await client.objectDelete(`${PREFIX}/non-exist`);
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-OSS',
      operation: 'objectDelete',
      message: expect.stringMatching(
        JSON.stringify({
          status: 403,
          statusText: 'Forbidden',
          errcode: 'InvalidAccessKeyId',
          errmsg: 'The specified access key id contains non-acceptable characters',
        }).replace(/"}$/, ''),
      ),
    });
  });

  test('getUploadSignature', async () => {
    const signature = client.getUploadSignature({ size: 1, expire: 10, prefix: PREFIX });

    expect(signature.ak).toBe(ENV.ALICLOUD_OSS_AK);
    expect(signature.host).toBe(ENV.ALICLOUD_OSS_HOST);
    expect(signature.key).toEqual(signature.id);
    expect(signature.key).toStartWith(`${PREFIX}/`);
    expect(signature.policy).toBeString();
    expect(signature.signature).toBeString();
  });

  test('objectDelete non-exist pass', async () => {
    await client.objectDelete(`${PREFIX}/non-exist`);
  });

  test('objectCopy non-exist throw', async () => {
    let error: unknown;
    try {
      await client.objectCopy({
        source: `${PREFIX}/source`,
        target: `${PREFIX}/target`,
      });
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-OSS',
      operation: 'objectCopy',
      message: JSON.stringify({
        status: 404,
        statusText: 'Not Found',
        errcode: 'NoSuchKey',
        errmsg: 'The specified key does not exist.',
      }),
    });
  });

  test('objectMove non-exist throw', async () => {
    let error: unknown;
    try {
      await client.objectMove({
        source: `${PREFIX}/source`,
        target: `${PREFIX}/target`,
      });
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-OSS',
      operation: 'objectCopy',
      message: JSON.stringify({
        status: 404,
        statusText: 'Not Found',
        errcode: 'NoSuchKey',
        errmsg: 'The specified key does not exist.',
      }),
    });
  });

  test('objectPut', async () => {
    const url = await client.objectPut({
      input: Buffer.from('test-content'),
      prefix: PREFIX,
    });

    expect(url).toStartWith(`${ENV.ALICLOUD_OSS_HOST}/${PREFIX}/`);
    const source = url.replace(ENV.ALICLOUD_OSS_HOST, '');

    await client.objectMove({ source: source, target: `${PREFIX}/target-move` });
    expect(client.objectCopy({ source: source, target: `${PREFIX}/target-copy` })).rejects.toThrow();

    await client.objectCopy({ source: `${PREFIX}/target-move`, target: `${PREFIX}/target-copy` });

    await client.objectDelete(`${PREFIX}/target-move`);
    await client.objectDelete(`${PREFIX}/target-copy`);

    expect(client.objectCopy({ source: url, target: `${PREFIX}/target-move` })).rejects.toThrow();
    expect(client.objectCopy({ source: url, target: `${PREFIX}/target-copy` })).rejects.toThrow();
  });
});
