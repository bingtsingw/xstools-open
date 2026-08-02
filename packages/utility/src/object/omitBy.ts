/**
 * Creates a new object composed of the own enumerable string-keyed properties
 * that do not satisfy the predicate.
 *
 * Only `Object.keys` are considered — own symbol keys are ignored. Nullish or
 * non-object `obj` yields `{}`.
 *
 * Reference: https://es-toolkit.dev/reference/object/omitBy.html
 *
 * @param obj - The source object.
 * @param shouldOmit - Predicate invoked with `(value, key)`; return `true` to omit.
 * @returns A new object without the omitted properties.
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
