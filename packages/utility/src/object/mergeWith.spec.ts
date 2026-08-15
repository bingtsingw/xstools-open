import { describe, expect, test } from 'bun:test';
import { mergeWith } from './mergeWith';

const equal = (actual: unknown, expected: unknown) => {
  expect(actual).toEqual(expected);
};

describe('mergeWith', () => {
  test('customizer return value is assigned', () => {
    const target = { a: 1, b: 2 };
    const result = mergeWith(target, { b: 3, c: 4 }, (targetValue, sourceValue) => {
      if (typeof targetValue === 'number' && typeof sourceValue === 'number') {
        return targetValue + sourceValue;
      }

      return undefined;
    });

    equal(result, { a: 1, b: 5, c: 4 });
    expect(result === target).toBe(true);
  });

  test('customizer can concat arrays', () => {
    equal(
      mergeWith({ a: [1], b: [2] }, { a: [3], b: [4] }, (targetValue, sourceValue) => {
        if (Array.isArray(targetValue)) {
          return targetValue.concat(sourceValue);
        }

        return undefined;
      }),
      { a: [1, 3], b: [2, 4] },
    );
  });

  test('customizer returning undefined uses the default merge', () => {
    const result = mergeWith({ a: { x: 1, y: 1 }, b: 2 }, { a: { y: 2 }, b: 3 }, (targetValue, sourceValue) => {
      if (typeof targetValue === 'number' && typeof sourceValue === 'number') {
        return targetValue + sourceValue;
      }

      return undefined;
    });

    equal(result, { a: { x: 1, y: 3 }, b: 5 });
  });

  test('nested arrays use the customizer on the default path', () => {
    equal(
      mergeWith({ a: { c: [1] }, b: [2] }, { a: { c: [3] }, b: [4] }, (targetValue, sourceValue) => {
        if (Array.isArray(targetValue)) {
          return targetValue.concat(sourceValue);
        }

        return undefined;
      }),
      { a: { c: [1, 3] }, b: [2, 4] },
    );
  });

  test('respects null returned from customizer', () => {
    equal(
      mergeWith({ prop: null }, { prop: { foo: 'bar' } }, (targetValue) => {
        if (targetValue === null) {
          return null;
        }

        return undefined;
      }),
      { prop: null },
    );
  });

  test('customizer receives key, target, and source at the current level', () => {
    const target = { a: 1 };
    const source = { a: 2, b: 3 };
    const calls: Array<{ key: string; targetValue: unknown; sourceValue: unknown; target: unknown; source: unknown }> =
      [];

    mergeWith(target, source, (...args) => {
      const [targetValue, sourceValue, key, currentTarget, currentSource] = args;
      calls.push({ key, targetValue, sourceValue, target: currentTarget, source: currentSource });
      return undefined;
    });

    equal(calls, [
      { key: 'a', targetValue: 1, sourceValue: 2, target, source },
      { key: 'b', targetValue: undefined, sourceValue: 3, target, source },
    ]);
  });

  test('skips unsafe write keys even when customizer would write them', () => {
    const viaJson = JSON.parse('{"__proto__":{"polluted":true},"a":2}');
    const result = mergeWith({ a: 1 }, viaJson, (_targetValue, sourceValue) => sourceValue);

    expect(result.a).toBe(2);
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
  });

  test('default path still clones when customizer returns undefined', () => {
    const nested = { x: 1 };
    const result = mergeWith({ a: 'string' }, { a: nested }, () => undefined);

    equal(result, { a: { x: 1 } });
    expect(result.a).not.toBe(nested);
  });
});
