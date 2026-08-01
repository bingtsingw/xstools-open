import { describe, expect, test } from 'bun:test';
import { xor } from './xor';

describe('xor', () => {
  test('normal usage', () => {
    expect(xor([1, 2, 3, 4], [3, 4, 5, 6])).toEqual([1, 2, 5, 6]);
    expect(xor(['a', 'b'], ['b', 'c'])).toEqual(['a', 'c']);
    expect(xor([1, 2], [1, 2])).toEqual([]);
    expect(xor([1, 2, 3], [1])).toEqual([2, 3]);
  });

  test('empty a', () => {
    expect(xor([], [1, 2])).toEqual([1, 2]);
    expect(xor(null as any, [1])).toEqual([1]);
    expect(xor(undefined as any, [1])).toEqual([1]);
  });

  test('empty b', () => {
    expect(xor([1, 2], [])).toEqual([1, 2]);
    expect(xor([1, 2], null as any)).toEqual([1, 2]);
    expect(xor([1, 2], undefined as any)).toEqual([1, 2]);
  });

  test('both empty or invalid', () => {
    expect(xor([], [])).toEqual([]);
    expect(xor(null as any, null as any)).toEqual([]);
    expect(xor(undefined as any, undefined as any)).toEqual([]);
  });

  test('duplicate values within an array', () => {
    expect(xor([1, 1, 2], [2, 3])).toEqual([1, 1, 3]);
  });
});
