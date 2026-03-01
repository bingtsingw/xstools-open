import { describe, expect, test } from 'bun:test';
import { isError } from './isError';

describe('isError', () => {
  test('return `true` for error objects', () => {
    expect(isError(new Error())).toBe(true);
  });

  test("return 'true' for subclassed values", () => {
    class CustomError extends Error {}
    expect(isError(new CustomError())).toBe(true);
  });

  test("return 'false' for plain objects", () => {
    expect(isError({ name: 'Error', message: '' })).toBe(false);
  });

  test("return 'false' for non-error objects", () => {
    expect(isError({})).toBe(false);
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError('')).toBe(false);
    expect(isError(1)).toBe(false);
    expect(isError(true)).toBe(false);
    expect(isError(Symbol(''))).toBe(false);
    expect(isError(() => {})).toBe(false);
    expect(isError(new Date())).toBe(false);
    expect(isError(new Map())).toBe(false);
    expect(isError(new Set())).toBe(false);
  });

  test('模拟跨`Realm`的内置`Error`(手动修改`toString`)', () => {
    const crossRealmErr = {
      name: 'Error',
      message: 'I come from another world',
      stack: 'Error: ...\n at <anonymous>:1:1',
      [Symbol.toStringTag]: 'Error',
    };
    expect(isError(crossRealmErr)).toBe(true);
  });
});
