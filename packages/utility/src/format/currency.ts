/**
 * Format an amount in fen (分) as a yuan (元) currency string.
 *
 * @param currency - Amount in fen (分).
 * @param options.decimals - Fraction digits. Default: `2`.
 * @param options.symbol - Currency symbol prefix. Default: `'¥'`. Empty string omits the symbol.
 * @param options.sign - Prefix `+` for positive amounts. Default: `false`.
 *
 * @example
 * formatCurrency(2) // => '¥ 0.02'
 * formatCurrency(2, { decimals: 0 }) // => '¥ 0'
 * formatCurrency(2, { sign: true }) // => '¥ +0.02'
 * formatCurrency(2, { symbol: '$' }) // => '$ 0.02'
 */
export const formatCurrency = (
  currency: number,
  options?: { decimals?: number; symbol?: string; sign?: boolean },
): string => {
  const { decimals = 2, symbol = '¥', sign = false } = options || {};

  const dm = decimals < 0 ? 0 : decimals;

  let num = (currency / 100).toFixed(dm);

  if (sign) {
    const _sign = currency > 0 ? '+' : '';
    num = _sign + num;
  }

  if (symbol) {
    num = symbol + ' ' + num;
  }

  return num;
};
