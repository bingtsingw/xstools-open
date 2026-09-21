import { describe, expect, test } from 'bun:test';
import { SdkExceptionResponse } from '@/src/_errors';
import { XcloudClient } from '@/src/xcloud';
import { ENV } from '../_env';

describe('xcloud', () => {
  const client = new XcloudClient({ ak: ENV.XCLOUD_AK, baseUrl: ENV.XCLOUD_BASE_URL });

  test('wrong token', async () => {
    let error: unknown;

    try {
      const wrongClient = new XcloudClient({ ak: 'wrong', baseUrl: ENV.XCLOUD_BASE_URL });
      await wrongClient.geoIpToLocation({ ip: '114.114.114.114' });
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError._tag).toBe('__XSTOOLS_SDK__EXCEPTION_RESPONSE');
    expect(JSON.parse(responseError.message)).toMatchObject({
      status: 401,
      statusText: 'Unauthorized',
    });
  });

  test('geoIpToLocation', async () => {
    expect(await client.geoIpToLocation({ ip: '114.114.114.114' })).toBe('江苏');
  });

  test('citySearch', async () => {
    expect(await client.citySearch({ name: '北京市' })).toMatchObject({
      name: '北京市',
      code: '110000',
      tz: 'Asia/Shanghai',
      pinyin: 'beijingshi',
    });
  });

  test('citySearch: error', async () => {
    expect(await client.citySearch({ name: '北京' })).toBeNull();
  });

  test('captchaPhone: 发送 && 验证', async () => {
    const phone = '13100000000';
    const scene = 'test';
    const code = await client.captchaPhoneSend({ phone, scene, useSms: false });
    expect(code).toBeString();

    const v1 = await client.captchaPhoneValidate({ phone, scene, value: '123456' });
    expect(v1).toBeFalse();

    const v2 = await client.captchaPhoneValidate({ phone, scene, value: code });
    expect(v2).toBeTrue();
  });

  test('captchaPhoneValidate: validate error', async () => {
    let error: unknown;
    const phone = '13100000000';
    const scene = 'test';

    try {
      await client.captchaPhoneValidate({ phone, scene, value: 'wrong' });
    } catch (caught) {
      error = caught;
    }

    expect(SdkExceptionResponse.is(error)).toBe(true);
    const responseError = error as SdkExceptionResponse;
    expect(responseError._tag).toBe('__XSTOOLS_SDK__EXCEPTION_RESPONSE');
    expect(JSON.parse(responseError.message)).toMatchObject({
      status: 422,
      statusText: 'Unprocessable Entity',
      detail: JSON.stringify({ errors: [{ code: 'I422VE', message: '验证码格式错误' }] }),
    });
  });
});
