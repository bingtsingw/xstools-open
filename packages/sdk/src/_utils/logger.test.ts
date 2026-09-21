import { afterEach, describe, expect, mock, test } from 'bun:test';
import { sdkLoggerConsole, sdkLoggerNoop } from './logger';

describe('sdkLoggerConsole', () => {
  const info = console.info;
  const debug = console.debug;

  afterEach(() => {
    console.info = info;
    console.debug = debug;
  });

  test('prints source, operation and message', () => {
    const spy = mock((message?: unknown) => {
      void message;
    });
    console.info = spy;

    sdkLoggerConsole.info({
      source: 'WECHAT-MINIPROGRAM',
      operation: 'securityCheckMsg',
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
      operation: 'securityCheckMsg',
      message: 'label',
      data: { openid: 'o_xxx' },
    });

    expect(spy).toHaveBeenCalledWith('[WECHAT-MINIPROGRAM:securityCheckMsg]: label, {"openid":"o_xxx"}');
  });

  test('noop does not throw', () => {
    expect(() => {
      sdkLoggerNoop.info({ source: 'DINGTALK', operation: 'x', message: 'y' });
      sdkLoggerNoop.debug({ source: 'DINGTALK', operation: 'x', message: 'y' });
    }).not.toThrow();
  });
});
