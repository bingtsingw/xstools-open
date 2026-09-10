import { describe, expect, test } from 'bun:test';
import { DingTalkClient } from '@/src/dingtalk';
import { ENV } from '../_env';
import { SdkExceptionResponse } from '@/src/_errors';

describe('dingtalk', () => {
  const client = new DingTalkClient();

  describe('customRobotsSendGroupMessages', () => {
    test('wrong token', async () => {
      let error: unknown;

      try {
        await client.customRobotsSendGroupMessages({
          accessToken: 'token',
          secret: ENV.DINGTALK_MESSAGE_SK,
          message: { msgtype: 'text', text: { content: '@xstools/sdk test' } },
        });
      } catch (caught) {
        error = caught;
      }

      expect(SdkExceptionResponse.is(error)).toBe(true);
      const responseError = error as SdkExceptionResponse;
      expect(responseError._tag).toBe('__XSTOOLS_SDK__EXCEPTION_RESPONSE');
      expect(responseError.log).toBe(
        `[XSTOOLS_SDK:DINGTALK(#getResponse)]: ${JSON.stringify({
          status: 200,
          statusText: 'OK',
          errcode: 300005,
          errmsg: 'token is not exist',
        })}`,
      );
    });

    test('正常发送消息', async () => {
      const res = await client.customRobotsSendGroupMessages({
        accessToken: ENV.DINGTALK_MESSAGE_AK,
        secret: ENV.DINGTALK_MESSAGE_SK,
        message: { msgtype: 'text', text: { content: '@xstools/sdk test' } },
      });

      expect(res).toBe(true);
    });
  });
});
