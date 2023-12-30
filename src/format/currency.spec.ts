import { describe, expect, test } from 'bun:test';
import { formatCurrency } from './currency';

describe('format', () => {
  test('formatCurrency', () => {
    expect(formatCurrency(2)).toEqual('¥ 0.02');
    expect(formatCurrency(100)).toEqual('¥ 1.00');
    expect(formatCurrency(999)).toEqual('¥ 9.99');

    expect(formatCurrency(2, { decimals: 0 })).toEqual('¥ 0');
    expect(formatCurrency(100, { decimals: 0 })).toEqual('¥ 1');
    expect(formatCurrency(999, { decimals: 0 })).toEqual('¥ 10');

    expect(formatCurrency(2, { symbol: '' })).toEqual('0.02');
    expect(formatCurrency(100, { symbol: '' })).toEqual('1.00');
    expect(formatCurrency(999, { symbol: '' })).toEqual('9.99');

    expect(formatCurrency(2, { sign: true })).toEqual('¥ +0.02');
    expect(formatCurrency(100, { sign: true })).toEqual('¥ +1.00');
    expect(formatCurrency(999, { sign: true })).toEqual('¥ +9.99');

    expect(formatCurrency(-2, { sign: true })).toEqual('¥ -0.02');
    expect(formatCurrency(-100, { sign: true })).toEqual('¥ -1.00');
    expect(formatCurrency(-999, { sign: true })).toEqual('¥ -9.99');
  });
});
