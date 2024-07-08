/**
 * Checks if the given number is between two numbers.
 *
 * * Numbers can be negative or positive.
 * * Starting number is inclusive.
 * * Ending number is exclusive.
 * * The start and the end of the range can be ascending OR descending order.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range. Inclusive.
 * @param {number} end The end of the range. Exclusive.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
export function inRange(number: number, start: number, end?: number): boolean {
  const isTypeSafe =
    typeof number === 'number' && typeof start === 'number' && (typeof end === 'undefined' || typeof end === 'number');

  if (!isTypeSafe) {
    return false;
  }

  if (typeof end === 'undefined') {
    // eslint-disable-next-line no-param-reassign
    end = start;
    // eslint-disable-next-line no-param-reassign
    start = 0;
  }

  return number >= Math.min(start, end) && number < Math.max(start, end);
}

export const toFloat = <T extends number | null = number>(value: any, defaultValue?: T): number | T => {
  const def = defaultValue === undefined ? 0.0 : defaultValue;
  if (value === null || value === undefined) {
    return def;
  }
  const result = parseFloat(value);
  return isNaN(result) ? def : result;
};

export const toInt = <T extends number | null = number>(value: any, defaultValue?: T): number | T => {
  const def = defaultValue === undefined ? 0 : defaultValue;
  if (value === null || value === undefined) {
    return def;
  }
  const result = parseInt(value, 10);
  return isNaN(result) ? def : result;
};
