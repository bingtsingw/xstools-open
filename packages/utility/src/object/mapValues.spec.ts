import { describe, expect, test } from 'bun:test';
import { mapValues } from './mapValues';

describe('mapValues', () => {
  test('maps own enumerable string values and keeps keys', () => {
    expect(mapValues({ a: 1, b: 2, c: 3 }, (value) => value * 2)).toEqual({ a: 2, b: 4, c: 6 });
    expect(mapValues({ first: 'hello', second: 'world' }, (value) => value.toUpperCase())).toEqual({
      first: 'HELLO',
      second: 'WORLD',
    });
  });

  test('iteratee receives key and the original object', () => {
    const obj = { alice: 85, bob: 92 };
    expect(mapValues(obj, (value, key) => `${key}:${value >= 90 ? 'A' : 'B'}`)).toEqual({
      alice: 'alice:B',
      bob: 'bob:A',
    });
    expect(mapValues(obj, (_value, _key, source) => source)).toEqual({ alice: obj, bob: obj });
  });

  test('nullish or non-object input', () => {
    expect(mapValues(null, (value) => value)).toEqual({});
    expect(mapValues(undefined, (value) => value)).toEqual({});
    expect(mapValues(1 as never, (value) => value)).toEqual({});
  });

  test('does not mutate original and reads getters once', () => {
    let reads = 0;
    const obj = {
      get a() {
        reads += 1;
        return 1;
      },
      b: 2,
    };
    const result = mapValues(obj, (value) => value * 10);
    expect(result).toEqual({ a: 10, b: 20 });
    expect(reads).toBe(1);
    expect(obj.b).toBe(2);
  });

  test('ignores own symbol keys and non-enumerable string keys', () => {
    const symbol = Symbol('s');
    const obj = { a: 1, [symbol]: 2 };
    Object.defineProperty(obj, 'hidden', { value: 3, enumerable: false });
    expect(mapValues(obj, (value) => value)).toEqual({ a: 1 });
  });

  test('does not recurse into nested objects', () => {
    const nested = { text: 'inner' };
    const result = mapValues({ nested, count: 1 }, (value) => value);
    expect(result.nested).toBe(nested);
  });
});
