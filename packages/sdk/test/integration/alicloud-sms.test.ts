import { describe, expect, test } from 'bun:test';
import { SdkExceptionResponse } from '@/src/_errors';
import { AlicloudClientDysmsapi20170525 } from '@/src/alicloud';
import { ENV } from '../_env';

describe('alicloud-sms', () => {
  const client = new AlicloudClientDysmsapi20170525({
    accessKeyId: ENV.ALICLOUD_SMS_AK,
    accessKeySecret: ENV.ALICLOUD_SMS_SK,
  });

  test('miss ak', async () => {
    const client = new AlicloudClientDysmsapi20170525({
      accessKeyId: '',
      accessKeySecret: '',
    });

    let error: unknown;
    try {
      await client.sendSms({} as any);
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-DYSMS',
      operation: 'sendSms',
      message: JSON.stringify({
        status: 400,
        statusText: 'Bad Request',
        errcode: 'MissingAccessKeyId',
        errmsg: 'AccessKeyId is mandatory for this action.',
      }),
    });
  });

  test('bad ak', async () => {
    const client = new AlicloudClientDysmsapi20170525({
      accessKeyId: 'bad',
      accessKeySecret: 'bad',
    });

    let error: unknown;
    try {
      await client.sendSms({} as any);
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-DYSMS',
      operation: 'sendSms',
      message: JSON.stringify({
        status: 404,
        statusText: 'Not Found',
        errcode: 'InvalidAccessKeyId.NotFound',
        errmsg: 'Specified access key is not found.',
      }),
    });
  });

  test('bad sk', async () => {
    const client = new AlicloudClientDysmsapi20170525({
      accessKeyId: ENV.ALICLOUD_SMS_AK,
      accessKeySecret: 'bad',
    });

    let error: unknown;
    try {
      await client.sendSms({} as any);
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-DYSMS',
      operation: 'sendSms',
      message: expect.stringMatching(
        JSON.stringify({
          status: 400,
          statusText: 'Bad Request',
          errcode: 'SignatureDoesNotMatch',
          errmsg: 'Specified signature does not match our calculation.',
        }).replace(/"}$/, ''),
      ),
    });
  });

  test('sendSms miss sign', async () => {
    let error: unknown;
    try {
      await client.sendSms({
        PhoneNumbers: ENV.ALICLOUD_SMS_PHONE,
        SignName: '',
        TemplateCode: ENV.ALICLOUD_SMS_TEMPLATE_CODE,
        TemplateParam: ENV.ALICLOUD_SMS_TEMPLATE_PARAM,
      });
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-DYSMS',
      operation: 'sendSms',
      message: JSON.stringify({
        status: 400,
        statusText: 'Bad Request',
        errcode: 'MissingSignName',
        errmsg: 'SignName is mandatory for this action.',
      }),
    });
  });

  test('sendSms bad sign', async () => {
    let error: unknown;
    try {
      await client.sendSms({
        PhoneNumbers: ENV.ALICLOUD_SMS_PHONE,
        SignName: 'bad',
        TemplateCode: ENV.ALICLOUD_SMS_TEMPLATE_CODE,
        TemplateParam: ENV.ALICLOUD_SMS_TEMPLATE_PARAM,
      });
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-DYSMS',
      operation: 'sendSms',
      message: JSON.stringify({
        status: 200,
        statusText: 'OK',
        errcode: 'isv.SMS_SIGNATURE_ILLEGAL',
        errmsg: '该账号下找不到对应签名',
      }),
    });
  });

  test('sendSms miss template code', async () => {
    let error: unknown;
    try {
      await client.sendSms({
        PhoneNumbers: ENV.ALICLOUD_SMS_PHONE,
        SignName: ENV.ALICLOUD_SMS_SIGN,
        TemplateCode: '',
        TemplateParam: ENV.ALICLOUD_SMS_TEMPLATE_PARAM,
      });
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-DYSMS',
      operation: 'sendSms',
      message: JSON.stringify({
        status: 400,
        statusText: 'Bad Request',
        errcode: 'MissingTemplateCode',
        errmsg: 'TemplateCode is mandatory for this action.',
      }),
    });
  });

  test('sendSms bad param', async () => {
    let error: unknown;
    try {
      await client.sendSms({
        PhoneNumbers: ENV.ALICLOUD_SMS_PHONE,
        SignName: ENV.ALICLOUD_SMS_SIGN,
        TemplateCode: ENV.ALICLOUD_SMS_TEMPLATE_CODE,
        TemplateParam: 'bad',
      });
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-DYSMS',
      operation: 'sendSms',
      message: JSON.stringify({
        status: 200,
        statusText: 'OK',
        errcode: 'isv.INVALID_JSON_PARAM',
        errmsg: '模板变量JSON格式错误 或 JSON变量属性与模板占位符不一致',
      }),
    });
  });

  test('sendSms bad template code', async () => {
    let error: unknown;
    try {
      await client.sendSms({
        PhoneNumbers: ENV.ALICLOUD_SMS_PHONE,
        SignName: ENV.ALICLOUD_SMS_SIGN,
        TemplateCode: 'bad',
        TemplateParam: ENV.ALICLOUD_SMS_TEMPLATE_PARAM,
      });
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError).toMatchObject({
      _tag: '__XSTOOLS_SDK__EXCEPTION_RESPONSE',
      source: 'ALI-DYSMS',
      operation: 'sendSms',
      message: JSON.stringify({
        status: 200,
        statusText: 'OK',
        errcode: 'isv.SMS_TEMPLATE_ILLEGAL',
        errmsg: '该账号下找不到对应模板',
      }),
    });
  });

  test('sendSms', async () => {
    await client.sendSms({
      PhoneNumbers: ENV.ALICLOUD_SMS_PHONE,
      SignName: ENV.ALICLOUD_SMS_SIGN,
      TemplateCode: ENV.ALICLOUD_SMS_TEMPLATE_CODE,
      TemplateParam: ENV.ALICLOUD_SMS_TEMPLATE_PARAM,
    });
  });
});
