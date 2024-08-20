/**
 * Returns the part of this string by length.
 *
 * @example
 * substring('123', 2) // => '12'
 * substring('123', 10) // => '123'
 * substring('今天很开心🌸🌸🌸', 6) // => '今天很开心🌸'
 *
 * --- WHY NOT NATIVE ---
 * '今天很开心🌸🌸🌸'.substring(0, 6) // => '今天很开心\ud83c'
 * '今天很开心🌸🌸🌸'.substring(0, 7) // => '今天很开心🌸'
 */
export const substring = (s: string, length: number): string => {
  if (typeof s !== 'string') {
    return '';
  }

  const temp = s.substring(0, length * 2);

  return [...temp].slice(0, length).join('');
};
