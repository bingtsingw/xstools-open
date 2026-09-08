import { afterEach, describe, expect, test } from 'bun:test';
import { installObjectHasOwnPolyfill } from './objectHasOwn';

const originalDescriptor = Object.getOwnPropertyDescriptor(Object, 'hasOwn');

afterEach(() => {
  if (originalDescriptor) {
    Object.defineProperty(Object, 'hasOwn', originalDescriptor);
    return;
  }

  Reflect.deleteProperty(Object, 'hasOwn');
});

describe('Object.hasOwn polyfill', () => {
  test('installs an own-property check when the native method is unavailable', () => {
    Reflect.deleteProperty(Object, 'hasOwn');

    installObjectHasOwnPolyfill();

    const symbol = Symbol('own');
    const object = Object.assign(Object.create({ inherited: true }), { existing: undefined, [symbol]: true });

    expect(Object.hasOwn(object, 'existing')).toBe(true);
    expect(Object.hasOwn(object, 'inherited')).toBe(false);
    expect(Object.hasOwn(object, symbol)).toBe(true);
    expect(Object.hasOwn(Object.create(null), 'missing')).toBe(false);
    expect(Object.getOwnPropertyDescriptor(Object, 'hasOwn')).toMatchObject({
      configurable: true,
      enumerable: false,
      writable: true,
    });
  });

  test('keeps a native implementation intact', () => {
    const nativeHasOwn = Object.hasOwn;

    installObjectHasOwnPolyfill();

    expect(Object.hasOwn).toBe(nativeHasOwn);
  });
});
