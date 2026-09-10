type StringKey<T> = Extract<keyof T, string>;

/**
 * Creates a new object with the same string keys, values produced by `getNewValue`.
 *
 * Only `Object.keys` are considered — own symbol keys are ignored. Nullish or
 * non-object `obj` yields `{}`.
 *
 * Reference: https://es-toolkit.dev/reference/object/mapValues.html
 *
 * @param obj - The object to iterate over.
 * @param getNewValue - Invoked with `(value, key, obj)` for each own enumerable string key.
 * @returns A new object with mapped values.
 *
 * @example
 * mapValues({ a: 1, b: 2 }, (value) => value * 2) // => { a: 2, b: 4 }
 * mapValues({ a: 1, b: 2 }, (_value, key) => key) // => { a: 'a', b: 'b' }
 */
export const mapValues = <T extends object, V>(
  obj: T | null | undefined,
  getNewValue: (value: T[StringKey<T>], key: StringKey<T>, obj: T) => V,
): { [K in StringKey<T>]: V } => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return {} as { [K in StringKey<T>]: V };
  }

  const result = {} as { [K in StringKey<T>]: V };
  const keys = Object.keys(obj) as Array<StringKey<T>>;

  for (const key of keys) {
    result[key] = getNewValue(obj[key], key, obj);
  }

  return result;
};
