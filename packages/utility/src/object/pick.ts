/**
 * Creates a new object composed of the own properties listed in `keys`.
 *
 * Missing keys are skipped. Nullish `obj` yields `{}`.
 *
 * Reference: https://es-toolkit.dev/reference/object/pick.html
 *
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // => { a: 1, c: 3 }
 * pick({ a: 1 }, ['a', 'b']) // => { a: 1 }
 * pick(null, ['a']) // => {}
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T | null | undefined,
  keys: readonly K[],
): Pick<T, K> => {
  if (obj === null || obj === undefined) {
    return {} as Pick<T, K>;
  }

  if (keys === null || keys === undefined) {
    return {} as Pick<T, K>;
  }

  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }

  return result;
};
