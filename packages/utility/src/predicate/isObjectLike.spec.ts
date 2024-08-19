import { describe, expect, test } from 'bun:test';
import { stubArgs, stubFalse } from '../_internal';
import { FALSY } from '../constants';
import { isObjectLike } from './isObjectLike';

describe('isObjectLike', () => {
  test('should return `true` for objects', () => {
    expect(isObjectLike({ a: 1 })).toBe(true);
    expect(isObjectLike(Object(0))).toBe(true);
    expect(isObjectLike(Object(false))).toBe(true);
    expect(isObjectLike(Object('a'))).toBe(true);
    expect(isObjectLike([1, 2, 3])).toBe(true);
    expect(isObjectLike(stubArgs)).toBe(true);
    expect(isObjectLike(new Date())).toBe(true);
    expect(isObjectLike(new Error())).toBe(true);
    expect(isObjectLike(/x/)).toBe(true);
  });

  test('should return `false` for non-objects', () => {
    const values = FALSY.concat(true, 1, 'a', Symbol);
    const expected = values.map(stubFalse);

    const actual = values.map(isObjectLike);

    expect(actual).toEqual(expected);
  });
});
