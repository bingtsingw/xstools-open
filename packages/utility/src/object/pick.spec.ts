import { describe, expect, test } from 'bun:test';
import { pick } from './pick';

describe('pick', () => {
  test('normal usage', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 });
    expect(pick({ a: 1, b: 2 }, [])).toEqual({});
  });

  test('keeps null and undefined own values', () => {
    expect(pick({ a: null, b: undefined, c: 1 }, ['a', 'b', 'c'])).toEqual({
      a: null,
      b: undefined,
      c: 1,
    });
  });

  test('nullish or non-object input', () => {
    expect(pick(null, ['a'] as any)).toEqual({});
    expect(pick(undefined, ['a'] as any)).toEqual({});
    expect(pick(1 as any, ['a'] as any)).toEqual({});
  });

  test('invalid keys', () => {
    expect(pick({ a: 1 }, null as any)).toEqual({} as any);
    expect(pick({ a: 1 }, undefined as any)).toEqual({} as any);
  });

  test('does not mutate original', () => {
    const obj = { a: 1, b: 2 };
    const result = pick(obj, ['a']);
    expect(result).toEqual({ a: 1 });
    expect(obj).toEqual({ a: 1, b: 2 });
  });
});
