import { describe, expect, test } from 'bun:test';
import { toArgs } from './toArgs';

describe('toArgs', () => {
  test('converts an array to an arguments object', () => {
    const result = toArgs([1, 2, 3]);

    expect(result.toString()).toBe('[object Arguments]');

    (function (..._args) {
      expect(arguments).toEqual(result);
    })(1, 2, 3);
  });
});
