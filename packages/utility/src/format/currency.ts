export const formatCurrency = (
  currency: number,
  options?: { decimals?: number; symbol?: string; sign?: boolean; F2Y?: boolean },
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
