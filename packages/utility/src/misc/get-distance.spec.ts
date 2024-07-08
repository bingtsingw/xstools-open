import { describe, expect, test } from 'bun:test';
import { getDistance } from './get-distance';

describe('misc', () => {
  test('getDistance', () => {
    expect(getDistance({ latitude: 1.1111, longitude: 1 }, { latitude: 1.1111, longitude: 1 })).toEqual(0);

    expect(() => {
      getDistance({ latitude: '11' as any, longitude: 1 }, { latitude: 1, longitude: 1 });
    }).toThrow('坐标参数错误');

    const distance = getDistance(
      { latitude: 39.916668, longitude: 116.383331 },
      { latitude: 31.150681, longitude: 121.124176 },
    );

    expect(distance).toEqual(1065706.56);
  });
});
