import { describe, expect, test } from 'bun:test';
import { omitBy } from './omitBy';

describe('omitBy', () => {
  test('normal usage', () => {
    expect(omitBy({ a: 1, b: 'omit', c: 3 }, (value) => typeof value === 'string')).toEqual({ a: 1, c: 3 });
    expect(omitBy({ a: 1, b: null, c: 3 }, (value) => value === null)).toEqual({ a: 1, c: 3 });
    expect(omitBy({ a: 1, b: 2 }, () => false)).toEqual({ a: 1, b: 2 });
    expect(omitBy({ a: 1, b: 2 }, () => true)).toEqual({});
  });

  test('predicate receives key', () => {
    expect(omitBy({ keep: 1, drop: 2 }, (_value, key) => key === 'drop')).toEqual({ keep: 1 });
  });

  test('nullish or non-object input', () => {
    expect(omitBy(null, () => true)).toEqual({});
    expect(omitBy(undefined, () => true)).toEqual({});
    expect(omitBy(1 as any, () => true)).toEqual({});
  });

  test('does not mutate original', () => {
    const obj = { a: 1, b: null };
    const result = omitBy(obj, (value) => value === null);
    expect(result).toEqual({ a: 1 });
    expect(obj).toEqual({ a: 1, b: null });
  });

  test('ignores own symbol keys', () => {
    const sym = Symbol('s');
    const obj = { a: 1, [sym]: 2 };
    expect(omitBy(obj, () => false)).toEqual({ a: 1 });
  });
});
