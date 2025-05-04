/**
 * Returns the part of this string by length.
 *
 * @example
 * subString('123', 2) // => '12'
 * subString('123', 10) // => '123'
 * subString('今天很开心🌸🌸🌸', 6) // => '今天很开心🌸'
 *
 * --- WHY NOT NATIVE ---
 * '今天很开心🌸🌸🌸'.subString(0, 6) // => '今天很开心\ud83c'
 * '今天很开心🌸🌸🌸'.subString(0, 7) // => '今天很开心🌸'
 */
export const subString = (s: string, length: number): string => {
  if (typeof s !== 'string') {
    return '';
  }

  return [...s].slice(0, length).join('');
};
