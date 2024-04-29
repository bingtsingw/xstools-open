import { describe, expect, test } from 'bun:test';
import { groupByKey } from './group-by-key';

describe('collection', () => {
  test('groupByKey', () => {
    const datas = [
      { score: 10, 'test-key': '2022-10-01 00:00:00' },
      { score: 20, 'test-key': '2022-10-02 00:00:00' },
      { score: 30, 'test-key': '2022-10-01 00:00:00' },
      { score: 40, 'test-key': '2022-10-03 00:00:00' },
      { score: 50, 'test-key': '2022-10-03 00:00:00' },
      { score: 60, 'test-key': '2022-10-03 00:00:00' },
    ];

    expect(groupByKey(datas, 'test-key', (data) => new Date(data).toISOString().substring(0, 10))).toEqual({
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

    // @ts-expect-error Argument of type '"score"' is not assignable to parameter of type '"test-key"'
    groupByKey(datas, 'score', () => ({}));
  });
});
