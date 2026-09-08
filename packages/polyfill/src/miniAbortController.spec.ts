import { describe, expect, test } from 'bun:test';
import { installAbortControllerPolyfill } from './miniAbortController';

type PolyfillHost = {
  AbortController?: unknown;
  AbortSignal?: unknown;
};

type PolyfilledAbortController = new () => {
  abort: (reason?: unknown) => void;
  signal: {
    aborted: boolean;
    reason: unknown;
    onabort: ((event: { type: string }) => void) | null;
    addEventListener: (type: string, listener: (event: { type: string }) => void, options?: { once?: boolean }) => void;
    removeEventListener: (type: string, listener: (event: { type: string }) => void) => void;
    throwIfAborted: () => void;
  };
};

describe('installAbortControllerPolyfill', () => {
  test('emits one DOM-free abort event and keeps the first reason', () => {
    const host: PolyfillHost = {};

    expect(installAbortControllerPolyfill(host)).toBe(true);
    const controller = new (host.AbortController as PolyfilledAbortController)();
    expect(controller.signal).toBeInstanceOf(host.AbortSignal as typeof Object);
    const events: string[] = [];
    const removedListener = () => events.push('removed');

    controller.signal.onabort = (event) => events.push(`property:${event.type}`);
    controller.signal.addEventListener('abort', (event) => events.push(`listener:${event.type}`));
    controller.signal.addEventListener('abort', () => events.push('once'), { once: true });
    controller.signal.addEventListener('abort', removedListener);
    controller.signal.removeEventListener('abort', removedListener);

    controller.abort('page-unload');
    controller.abort('ignored');

    expect(controller.signal.aborted).toBe(true);
    expect(controller.signal.reason).toBe('page-unload');
    expect(events).toEqual(['property:abort', 'listener:abort', 'once']);
  });

  test('does not replace a native implementation', () => {
    const NativeAbortController = class {};
    const host: PolyfillHost = { AbortController: NativeAbortController };

    expect(installAbortControllerPolyfill(host)).toBe(false);
    expect(host.AbortController).toBe(NativeAbortController);
  });

  test('does not create a mismatched pair when only AbortSignal exists', () => {
    const NativeAbortSignal = class {};
    const host: PolyfillHost = { AbortSignal: NativeAbortSignal };

    expect(installAbortControllerPolyfill(host)).toBe(false);
    expect(host.AbortController).toBeUndefined();
    expect(host.AbortSignal).toBe(NativeAbortSignal);
  });

  test('keeps listener registration stable and exposes the abort reason', () => {
    const host: PolyfillHost = {};
    installAbortControllerPolyfill(host);
    const controller = new (host.AbortController as PolyfilledAbortController)();
    const calls: string[] = [];
    const listener = function (this: unknown, event: { type: string }) {
      calls.push(this === controller.signal ? event.type : 'wrong-this');
    };

    controller.signal.addEventListener('abort', listener, { once: true });
    controller.signal.addEventListener('abort', listener);
    controller.abort('stopped');

    expect(calls).toEqual(['abort']);
    expect(() => controller.signal.throwIfAborted()).toThrow('stopped');
  });

  test('does not call listeners added during dispatch', () => {
    const host: PolyfillHost = {};
    installAbortControllerPolyfill(host);
    const controller = new (host.AbortController as PolyfilledAbortController)();
    const calls: string[] = [];

    controller.signal.addEventListener('abort', () => {
      calls.push('first');
      controller.signal.addEventListener('abort', () => calls.push('late'));
    });
    controller.abort();

    expect(calls).toEqual(['first']);
  });

  test('uses an AbortError when abort receives no reason', () => {
    const host: PolyfillHost = {};
    installAbortControllerPolyfill(host);
    const controller = new (host.AbortController as PolyfilledAbortController)();

    controller.abort();

    expect(controller.signal.reason).toMatchObject({ name: 'AbortError' });
  });
});
