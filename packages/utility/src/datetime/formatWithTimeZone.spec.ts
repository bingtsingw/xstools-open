import { describe, expect, test } from 'bun:test';
import { formatWithTimeZone } from './formatWithTimeZone';

describe('formatWithTimeZone', () => {
  test('formatWithTimeZone', () => {
    expect(formatWithTimeZone(new Date('2023-12-25T12:00:00Z'), '+08:00', 'yyyy-MM-dd HH:mm:ss')).toBe(
      '2023-12-25 20:00:00',
    );

    expect(formatWithTimeZone(new Date('2023-12-25T12:00:00-05:00'), '+08:00', 'yyyy-MM-dd HH:mm:ss')).toBe(
      '2023-12-26 01:00:00',
    );
  });
});
