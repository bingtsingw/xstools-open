import { describe, expect, test } from 'bun:test';
import { sleep } from '../promise';
import { attempt } from './attempt';

describe('attempt', () => {
  test('should return the result of the function', () => {
    expect(attempt(() => 1)).toEqual([null, 1]);
  });

  test('should return the error of the function', () => {
    expect(
      attempt(() => {
        throw new Error('test');
      }),
    ).toEqual([new Error('test'), null]);
  });

  test('should work with non-Error thrown values', () => {
    expect(
      attempt(() => {
        throw 'string error';
      }),
    ).toEqual(['string error', null]);
  });

  test('should return the result of the promise', async () => {
    const [error, result] = attempt(async () => 1);
    expect(error).toBeNull();
    expect(await result).toBe(1);
  });

  test('should return the result of the promise that throws an error', async () => {
    const [error, result] = attempt(async () => {
      await sleep(100);
      throw new Error('test');
    });

    expect(error).toBeNull();

    try {
      await result;
    } catch (tryError) {
      expect(tryError).toBeInstanceOf(Error);
      expect(error).toBeNull();
    }
  });
});
