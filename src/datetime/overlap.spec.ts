import { describe, expect, test } from 'bun:test';
import { isOverlap, isOverlaps } from './overlap';

describe('datetime', () => {
  test('isOverlap', () => {
    const oneStart = new Date('2023-01-01');
    const oneEnd = new Date('2023-12-30');
    const oneEndPlus = new Date('2023-12-31');
    const twoStart = new Date('2023-05-01');
    const twoEnd = new Date('2024-12-31');

    expect(isOverlap({ start: oneStart, end: oneEnd }, { start: twoStart, end: twoEnd })).toBe(true);
    expect(isOverlap({ start: oneStart, end: oneEnd }, { start: oneEnd, end: twoEnd })).toBe(true);
    expect(isOverlap({ start: oneStart, end: oneEnd }, { start: oneEndPlus, end: twoEnd })).toBe(false);
    expect(isOverlap({ start: oneStart, end: oneStart }, { start: twoStart, end: twoStart })).toBe(false);
    expect(isOverlap({ start: oneStart, end: oneStart }, { start: oneStart, end: oneStart })).toBe(true);

    expect(() => isOverlap({ start: oneEnd, end: oneStart }, { start: twoStart, end: twoEnd })).toThrow('时间段无效');
    expect(() => isOverlap({ start: oneStart, end: oneEnd }, { start: twoEnd, end: twoStart })).toThrow('时间段无效');
  });

  test('isOverlaps', () => {
    const notOverlayDates = [
      { start: new Date('2023-01-02'), end: new Date('2023-01-03') },
      { start: new Date('2023-01-02'), end: new Date('2023-01-03') },
      { start: new Date('2023-01-03'), end: new Date('2023-01-04') },
      { start: new Date('2023-01-02'), end: new Date('2023-01-010') },
    ];

    expect(
      isOverlaps(
        {
          start: new Date('2023-01-01'),
          end: new Date('2023-01-01'),
        },
        notOverlayDates,
      ),
    ).toBe(false);

    expect(
      isOverlaps(
        {
          start: new Date('2023-01-01'),
          end: new Date('2023-01-01'),
        },
        [
          ...notOverlayDates,
          {
            // 只要有一个时间段交叉就为true
            start: new Date('2022-01-01'),
            end: new Date('2023-01-05'),
          },
        ],
      ),
    ).toBe(true);
  });
});
