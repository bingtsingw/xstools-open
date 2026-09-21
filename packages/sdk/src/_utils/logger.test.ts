import { afterEach, describe, expect, mock, test } from 'bun:test';
import { sdkLoggerConsole, sdkLoggerNoop } from './logger';

describe('sdkLoggerConsole', () => {
  const info = console.info;
  const debug = console.debug;
  const error = console.error;

  afterEach(() => {
    console.info = info;
    console.debug = debug;
    console.error = error;
  });

  test('prints source, action and message', () => {
    const spy = mock((message?: unknown) => {
      void message;
    });
    console.info = spy;

    sdkLoggerConsole.info({
      source: 'WECHAT-MINIPROGRAM',
      action: 'securityCheckMsg',
      message: 'DONE',
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('[WECHAT-MINIPROGRAM:securityCheckMsg]: DONE');
  });

  test('appends data when present', () => {
    const spy = mock((message?: unknown) => {
      void message;
    });
    console.debug = spy;

    sdkLoggerConsole.debug({
      source: 'WECHAT-MINIPROGRAM',
      action: 'securityCheckMsg',
      message: 'label',
      data: { openid: 'o_xxx' },
    });

    expect(spy).toHaveBeenCalledWith('[WECHAT-MINIPROGRAM:securityCheckMsg]: label, {"openid":"o_xxx"}');
  });

  test('noop does not throw', () => {
    expect(() => {
      sdkLoggerNoop.info({ source: 'DINGTALK', action: 'x', message: 'y' });
      sdkLoggerNoop.debug({ source: 'DINGTALK', action: 'x', message: 'y' });
      sdkLoggerNoop.error({ source: 'DINGTALK', action: 'x', message: 'y' });
    }).not.toThrow();
  });
});
