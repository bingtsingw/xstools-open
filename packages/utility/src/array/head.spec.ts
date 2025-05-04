import { describe, expect, test } from 'bun:test';
import { head } from './head';

describe('head', () => {
  test('normal usage', () => {
    expect(head([1, 2, 3])).toBe(1);
    expect(head(['a', 'b', 'c'])).toBe('a');
    expect(head([true, false, true])).toBe(true);
  });

  test('empty', () => {
    expect(head([])).toBeUndefined();
    expect(head(null as any)).toBeUndefined();
    expect(head(undefined as any)).toBeUndefined();
  });
});
