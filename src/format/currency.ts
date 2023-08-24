export const currency = (currency: number, options?: { decimals: number; symbol: string; F2Y: boolean }) => {
  const { decimals = 2, symbol = '¥' } = options || {};

  const dm = decimals < 0 ? 0 : decimals;

  return symbol + ' ' + (currency / 100).toFixed(dm);
};
