import { describe, expect, test } from 'bun:test';
import { rankByPath } from './rankByPath';

describe('rankByPath', () => {
  test('normal usage', () => {
    const data = [
      { exam: { score: 70 } },
      { exam: { score: 70 } },
      { exam: { score: 100 } },
      { exam: { score: 80 } },
      { exam: { score: 90 } },
      { exam: { score: 100 } },
    ];

    expect(rankByPath(data, 'exam.score')).toEqual([
      { _rank: 1, exam: { score: 100 } },
      { _rank: 1, exam: { score: 100 } },
      { _rank: 3, exam: { score: 90 } },
      { _rank: 4, exam: { score: 80 } },
      { _rank: 5, exam: { score: 70 } },
      { _rank: 5, exam: { score: 70 } },
    ]);
  });

  test('does not mutate input', () => {
    const first = { a: 1 };
    const second = { a: 3 };
    const data = [first, second];

    const result = rankByPath(data, 'a');

    expect(data).toEqual([{ a: 1 }, { a: 3 }]);
    expect(first).toEqual({ a: 1 });
    expect(second).toEqual({ a: 3 });
    expect(result).toEqual([
      { a: 3, _rank: 1 },
      { a: 1, _rank: 2 },
    ]);
    expect(result[0]).not.toBe(second);
    expect(result[1]).not.toBe(first);
  });

  test('empty array', () => {
    expect(rankByPath([] as { category: string; name: string }[], 'category')).toEqual([]);
  });

  test('non-array input', () => {
    expect(rankByPath(null as any, 'a')).toEqual([]);
    expect(rankByPath(undefined as any, 'a')).toEqual([]);
  });

  test('array with one element', () => {
    expect(rankByPath([{ score: 59 }], 'score')).toEqual([{ _rank: 1, score: 59 }]);
  });

  test('array with complex element', () => {
    expect(
      rankByPath(
        [
          { a: 3, b: '' },
          { a: 1, c: false },
          { a: 2, c: 0 },
        ],
        'a',
      ),
    ).toEqual([
      { _rank: 1, a: 3, b: '' },
      { _rank: 2, a: 2, c: 0 },
      { _rank: 3, a: 1, c: false },
    ]);

    expect(
      rankByPath(
        [
          { a: '3', b: '' },
          { a: '1', c: false },
          { a: 2, c: 0 },
        ],
        'a',
      ),
    ).toEqual([
      { _rank: 1, a: '3', b: '' },
      { _rank: 2, a: 2, c: 0 },
      { _rank: 3, a: '1', c: false },
    ]);
  });
});
