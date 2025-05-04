import { describe, expect, test } from 'bun:test';
import { differenceBy } from './differenceBy';

describe('differenceBy', () => {
  test('normal usage', () => {
    expect(differenceBy([1.2, 2.3, 3.4], [1.2], Math.floor)).toEqual([2.3, 3.4]);
    expect(differenceBy([], [1.2], Math.floor)).toEqual([]);
    expect(
      differenceBy(
        [
          { id: 1, csv: 1 },
          { id: 2, csv: 1 },
          { id: 3, csv: 1 },
        ],
        [
          { id: 2, json: 2 },
          { id: 4, json: 2 },
        ],
        (value) => value.id,
      ),
    ).toEqual([
      { id: 1, csv: 1 },
      { id: 3, csv: 1 },
    ]);
  });

  test('empty a', () => {
    expect(differenceBy([], [1], (i) => i)).toEqual([]);
    expect(differenceBy(null as any, [1], (i) => i)).toEqual([]);
    expect(differenceBy(undefined as any, [1], (i) => i)).toEqual([]);
  });

  test('empty b', () => {
    expect(differenceBy([1], [], (i) => i)).toEqual([1]);
    expect(differenceBy([1], null as any, (i) => i)).toEqual([1]);
    expect(differenceBy([1], undefined as any, (i) => i)).toEqual([1]);
    expect(differenceBy(11111 as any, undefined as any, (i) => i)).toEqual(11111 as any);
  });
});
