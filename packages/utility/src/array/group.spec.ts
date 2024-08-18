import { describe, expect, test } from 'bun:test';
import { groupBy } from './group';

describe('groupBy', () => {
  test('conventional usage', () => {
    expect(groupBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ 4: [4.2], 6: [6.1, 6.3] });
    expect(groupBy(['one', 'two', 'three'], (v) => v.length)).toEqual({ 3: ['one', 'two'], 5: ['three'] });
    expect(
      groupBy(
        [
          { score: 10, 'test-key': '2022-10-01 00:00:00' },
          { score: 20, 'test-key': '2022-10-02 00:00:00' },
          { score: 30, 'test-key': '2022-10-01 00:00:00' },
          { score: 40, 'test-key': '2022-10-03 00:00:00' },
          { score: 50, 'test-key': '2022-10-03 00:00:00' },
          { score: 60, 'test-key': '2022-10-03 00:00:00' },
        ],
        (data) => new Date(data['test-key']).toISOString().substring(0, 10),
      ),
    ).toEqual({
      '2022-10-01': [
        { score: 10, 'test-key': '2022-10-01 00:00:00' },
        { score: 30, 'test-key': '2022-10-01 00:00:00' },
      ],
      '2022-10-02': [{ score: 20, 'test-key': '2022-10-02 00:00:00' }],
      '2022-10-03': [
        { score: 40, 'test-key': '2022-10-03 00:00:00' },
        { score: 50, 'test-key': '2022-10-03 00:00:00' },
        { score: 60, 'test-key': '2022-10-03 00:00:00' },
      ],
    });
  });

  test('empty array', () => {
    expect(groupBy([] as { category: string; name: string }[], (item) => item.category)).toEqual({});
  });

  test('array with one element', () => {
    expect(groupBy([{ category: 'fruit', name: 'apple' }], (item) => item.category)).toEqual({
      fruit: [{ category: 'fruit', name: 'apple' }],
    });
  });

  test('numeric key', () => {
    expect(
      groupBy(
        [
          { score: 1, name: 'John' },
          { score: 2, name: 'Jane' },
          { score: 1, name: 'Joe' },
        ],
        (item) => item.score,
      ),
    ).toEqual({
      '1': [
        { score: 1, name: 'John' },
        { score: 1, name: 'Joe' },
      ],
      '2': [{ score: 2, name: 'Jane' }],
    });
  });

  test('symbol key', () => {
    const TYPE_A = Symbol('A');
    const TYPE_B = Symbol('B');

    expect(
      groupBy(
        [
          { type: TYPE_A, score: 1, name: 'John' },
          { type: TYPE_A, score: 2, name: 'Jane' },
          { type: TYPE_B, score: 1, name: 'Joe' },
        ],
        (item) => item.type,
      ),
    ).toEqual({
      [TYPE_A]: [
        { type: TYPE_A, score: 1, name: 'John' },
        { type: TYPE_A, score: 2, name: 'Jane' },
      ],
      [TYPE_B]: [{ type: TYPE_B, score: 1, name: 'Joe' }],
    });
  });

  test('duplicate keys', () => {
    expect(
      groupBy(
        [
          { category: 'fruit', name: 'apple' },
          { category: 'fruit', name: 'apple' },
        ],
        (item) => item.category,
      ),
    ).toEqual({
      fruit: [
        { category: 'fruit', name: 'apple' },
        { category: 'fruit', name: 'apple' },
      ],
    });
  });
});
