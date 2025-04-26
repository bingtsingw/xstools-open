import { afterEach, describe, expect, test } from 'bun:test';
import { getTimezoneOffset } from './getTimezoneOffset';

describe('getTimezoneOffset', () => {
  afterEach(() => {
    process.env.TZ = 'UTC';
  });

  test('UTC', () => {
    process.env.TZ = 'UTC';
    expect(getTimezoneOffset()).toBe('+00:00');
  });

  test('Asia/Shanghai', () => {
    process.env.TZ = 'Asia/Shanghai';
    expect(getTimezoneOffset()).toBe('+08:00');
  });

  test('Asia/Tokyo', () => {
    process.env.TZ = 'Asia/Tokyo';
    expect(getTimezoneOffset()).toBe('+09:00');
  });

  test('America/New_York', () => {
    process.env.TZ = 'America/New_York';
    expect(getTimezoneOffset()).toBe('-04:00');
  });
});
