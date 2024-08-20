import { describe, expect, test } from 'bun:test';
import { formatCurrency } from './currency';

describe('format', () => {
  test('formatCurrency', () => {
    expect(formatCurrency(2)).toEqual('¥ 0.02');
    expect(formatCurrency(100)).toEqual('¥ 1.00');
    expect(formatCurrency(999)).toEqual('¥ 9.99');

    expect(formatCurrency(2, { decimals: 0 })).toEqual('¥ 0');
    expect(formatCurrency(2, { decimals: 1 })).toEqual('¥ 0.0');
    expect(formatCurrency(2, { decimals: 2 })).toEqual('¥ 0.02');

    expect(formatCurrency(100, { decimals: 0 })).toEqual('¥ 1');
    expect(formatCurrency(100, { decimals: 1 })).toEqual('¥ 1.0');
    expect(formatCurrency(999, { decimals: 0 })).toEqual('¥ 10');
    expect(formatCurrency(999, { decimals: 1 })).toEqual('¥ 10.0');
    expect(formatCurrency(999, { decimals: 2 })).toEqual('¥ 9.99');
    expect(formatCurrency(999, { decimals: 3 })).toEqual('¥ 9.990');

    expect(formatCurrency(2, { symbol: '' })).toEqual('0.02');
    expect(formatCurrency(100, { symbol: '$' })).toEqual('$ 1.00');
    expect(formatCurrency(999, { symbol: 'Є' })).toEqual('Є 9.99');

    expect(formatCurrency(2, { sign: true })).toEqual('¥ +0.02');
    expect(formatCurrency(2, { sign: false })).toEqual('¥ 0.02');
    expect(formatCurrency(100, { sign: true })).toEqual('¥ +1.00');
    expect(formatCurrency(100, { sign: false })).toEqual('¥ 1.00');
    expect(formatCurrency(999, { sign: true })).toEqual('¥ +9.99');

    expect(formatCurrency(-2, { sign: false })).toEqual('¥ -0.02');
    expect(formatCurrency(-2, { sign: true })).toEqual('¥ -0.02');
    expect(formatCurrency(-100, { sign: true })).toEqual('¥ -1.00');
    expect(formatCurrency(-999, { sign: true })).toEqual('¥ -9.99');
  });
});
