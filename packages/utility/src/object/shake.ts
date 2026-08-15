/** Drop exactly-`undefined` values and symbol keys so the result type matches runtime. */
type Shaken<T> = {
  [K in keyof T as K extends symbol ? never : 0 extends 1 & T[K] ? K : [T[K]] extends [undefined] ? never : K]: Exclude<
    T[K],
    undefined
  >;
};

/**
 * Removes (shakes out) undefined entries from an object.
 * Optional second argument shakes out values by custom evaluation.
 *
 * Only `Object.keys` are considered — own symbol keys are ignored. Nullish or
 * non-object `obj` yields `{}`.
 *
 * Reference: https://github.com/sodiray/radash/blob/master/src/object.ts
 *
 * @param obj - The source object.
 * @param filter - Predicate invoked with `value`; return `true` to omit. Defaults to `value === undefined`.
 * @returns A new object without the shaken-out properties.
 *
 * @example
 * shake({ a: 1, b: undefined, c: 3 }) // => { a: 1, c: 3 }
 * shake({ a: 1, b: null, c: false }, (value) => !value) // => { a: 1 }
 */
export function shake<T extends object>(obj: T | null | undefined): Shaken<T>;
export function shake<T extends object>(obj: T | null | undefined, filter: (value: T[keyof T]) => boolean): Partial<T>;
export function shake<T extends object>(
  obj: T | null | undefined,
  filter: (value: T[keyof T]) => boolean = (value) => value === undefined,
): Partial<T> {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return {};
  }

  const result: Partial<T> = {};
  const keys = Object.keys(obj) as Array<keyof T>;

  for (const key of keys) {
    const value = obj[key];
    if (!filter(value)) {
      result[key] = value;
    }
  }

  return result;
}
