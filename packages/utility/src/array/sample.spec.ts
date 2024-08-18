import { describe, expect, test } from 'bun:test';
import { sample } from './sample';

describe('sample', () => {
  test('normal usage', () => {
    const arr = [1, 2, 3];
    expect(arr.includes(sample(arr)!)).toBeTrue();
  });

  test('empty array', () => {
    expect(sample(undefined!)).toBeUndefined();
    expect(sample(null!)).toBeUndefined();
    expect(sample([])).toBeUndefined();
  });

  test('string', () => {
    // @ts-expect-error
    expect(sample('test')).toBeUndefined();
  });
});
