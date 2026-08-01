/**
 * Creates a new object composed of the own enumerable properties that do not
 * satisfy the predicate.
 *
 * Reference: https://es-toolkit.dev/reference/object/omitBy.html
 *
 * @example
 * omitBy({ a: 1, b: 'omit', c: 3 }, (value) => typeof value === 'string') // => { a: 1, c: 3 }
 * omitBy({ a: 1, b: null, c: 3 }, (value) => value === null) // => { a: 1, c: 3 }
 */
export const omitBy = <T extends Record<PropertyKey, any>>(
  obj: T | null | undefined,
  shouldOmit: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return {};
  }

  const result: Partial<T> = {};
  const keys = Object.keys(obj) as Array<keyof T>;

  for (const key of keys) {
    const value = obj[key];
    if (!shouldOmit(value, key)) {
      result[key] = value;
    }
  }

  return result;
};
