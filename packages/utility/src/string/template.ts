/**
 * template is used to replace data by name in template strings.
 *
 * Reference: https://github.com/sodiray/radash/blob/master/src/string.ts
 *
 * @example
 * template('Hello, {{ name }}', { name: 'ray' }) // => Hello, ray
 * template('Hello, {{ name }}', {age: 1}) // => Hello,
 */
export const template = (str: string, data: Record<string, any>) => {
  const regex = /\{\{\s*(.+?)\s*\}\}/g;

  return Array.from(str.matchAll(regex)).reduce((acc, match) => {
    const toReplace = match[0]; // {{ xxx }}
    const key = match[1]!; // xxx
    return acc.replace(toReplace, data[key] || '');
  }, str);
};
