import { describe, expect, test } from 'bun:test';
import { difference } from './difference';

describe('difference', () => {
  test('normal usage', () => {
    expect(difference([1, 2, 3], [1])).toEqual([2, 3]);
    expect(difference([], [1, 2, 3])).toEqual([]);
    expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
    expect(difference([1, 2, 3, 4], [2, 4, 2])).toEqual([1, 3]);
  });

  test('empty a', () => {
    expect(difference([], [1])).toEqual([]);
    expect(difference(null as any, [1])).toEqual([]);
    expect(difference(undefined as any, [1])).toEqual([]);
  });

  test('empty b', () => {
    expect(difference([1, 2, 3], [])).toEqual([1, 2, 3]);
    expect(difference([1, 2, 3], null as any)).toEqual([1, 2, 3]);
    expect(difference([1, 2, 3], undefined as any)).toEqual([1, 2, 3]);
    expect(difference(11111 as any, undefined as any)).toEqual(11111 as any);
  });
});
