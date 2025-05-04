import { describe, expect, test } from 'bun:test';
import { differenceWith } from './differenceWith';

describe('differenceWith', () => {
  test('normal usage', () => {
    expect(differenceWith([1, 1, 2, 2, 3], [2], (a, b) => a === b)).toEqual([1, 1, 3]);
    expect(differenceWith([1.2, 2.3, 3.4], [1.2], (x, y) => Math.floor(x) === Math.floor(y))).toEqual([2.3, 3.4]);
    expect(differenceWith([{ id: 1 }, { id: 2 }, { id: 3 }], [{ id: 2 }, { id: 4 }], (a, b) => a.id === b.id)).toEqual([
      { id: 1 },
      { id: 3 },
    ]);
    expect(
      differenceWith(
        [
          { id: 1, csv: 1 },
          { id: 2, csv: 1 },
          { id: 3, csv: 1 },
        ],
        [
          { id: 2, json: 2 },
          { id: 4, json: 2 },
        ],
        (a, b) => a.id === b.id,
      ),
    ).toEqual([
      { id: 1, csv: 1 },
      { id: 3, csv: 1 },
    ]);
  });

  test('empty a', () => {
    expect(differenceWith([], [1], (a, b) => a === b)).toEqual([]);
    expect(differenceWith(null as any, [1], (a, b) => a === b)).toEqual([]);
    expect(differenceWith(undefined as any, [1], (a, b) => a === b)).toEqual([]);
  });

  test('empty b', () => {
    expect(differenceWith([1], [], (a, b) => a === b)).toEqual([1]);
    expect(differenceWith([1], null as any, (a, b) => a === b)).toEqual([1]);
    expect(differenceWith([1], undefined as any, (a, b) => a === b)).toEqual([1]);
    expect(differenceWith(11111 as any, undefined as any, (a, b) => a === b)).toEqual(11111 as any);
  });
});
