import { describe, expect, spyOn, test } from 'bun:test';
import { weightedSample } from './weightedSample';

describe('weightedSample', () => {
  test('selects an element according to its weight', () => {
    const random = spyOn(Math, 'random');
    const items = [
      { value: 'common', weight: 9 },
      { value: 'rare', weight: 1 },
    ];

    random.mockReturnValueOnce(0).mockReturnValueOnce(0.95);

    expect(weightedSample(items, (item) => item.weight)?.value).toBe('common');
    expect(weightedSample(items, (item) => item.weight)?.value).toBe('rare');

    random.mockRestore();
  });

  test('never selects an element with zero weight', () => {
    expect(weightedSample(['ignored', 'selected'], (_, index) => index)).toBe('selected');
  });

  test('returns undefined for an empty array or zero total weight', () => {
    expect(weightedSample([], () => 1)).toBeUndefined();
    expect(weightedSample([1, 2, 3], () => 0)).toBeUndefined();
  });

  test.each([-1, Number.NaN, Number.POSITIVE_INFINITY])('rejects the invalid weight %p', (weight) => {
    expect(() => weightedSample([1], () => weight)).toThrow(RangeError);
  });
});
