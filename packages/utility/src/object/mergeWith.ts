import { getTag } from './getTag';

const isObjectLike = (value: unknown): boolean => typeof value === 'object' && value !== null;

const isUnsafeToWriteKey = (key: string): boolean =>
  key === '__proto__' || key === 'constructor' || key === 'prototype';

const isPlainObject = (value: unknown): value is Record<string, any> => {
  if (!isObjectLike(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  if (proto !== null && proto !== Object.prototype && Object.getPrototypeOf(proto) !== null) {
    return false;
  }

  return getTag(value) === '[object Object]';
};

/**
 * Deeply merges `source` into `target` using a customizer, mutating `target`.
 *
 * If the customizer returns `undefined`, the default strategy applies: same-type
 * plain objects / arrays recurse in place; otherwise the source value wins, and
 * nested plain objects / arrays are cloned. `undefined` in `source` does not
 * overwrite an existing defined value. `merge(a, b)` is `mergeWith` with this
 * default. Own enumerable string keys only; `__proto__` / `constructor` /
 * `prototype` are skipped. Cycles in `source` reuse the already-merged object.
 *
 * Reference: https://es-toolkit.dev/reference/object/mergeWith.html
 *
 * @param target - Destination object. Modified in place.
 * @param source - Source object to merge from.
 * @param customizer - Invoked as `(targetValue, sourceValue, key, target, source)`. Return `undefined` to use the default merge.
 * @returns The mutated `target`.
 *
 * @example
 * mergeWith({ a: 1, b: 2 }, { b: 3, c: 4 }, (targetValue, sourceValue) => {
 *   if (typeof targetValue === 'number' && typeof sourceValue === 'number') {
 *     return targetValue + sourceValue;
 *   }
 * }) // => { a: 1, b: 5, c: 4 }
 *
 * mergeWith({ a: [1] }, { a: [3] }, (targetValue, sourceValue) => {
 *   if (Array.isArray(targetValue)) {
 *     return targetValue.concat(sourceValue);
 *   }
 * }) // => { a: [1, 3] }
 */
export const mergeWith = <T extends Record<PropertyKey, any>, S extends Record<PropertyKey, any>>(
  target: T,
  source: S,
  customizer: (targetValue: any, sourceValue: any, key: string, target: T, source: S) => any,
): T & S => {
  const stack = new WeakMap<object, object>();

  const mergeDeep = (currentTarget: any, currentSource: any): any => {
    if (currentTarget === currentSource) {
      return currentTarget;
    }

    if (!isObjectLike(currentTarget) || !isObjectLike(currentSource)) {
      return currentTarget;
    }

    const stacked = stack.get(currentSource);
    if (stacked !== undefined) {
      return stacked;
    }

    const dest: Record<string, any> = currentTarget;
    const src: Record<string, any> = currentSource;
    stack.set(src, dest);

    const keys = Object.keys(src);

    for (const key of keys) {
      if (isUnsafeToWriteKey(key)) {
        continue;
      }

      const sourceValue = src[key];
      const targetValue = dest[key];
      const customized = customizer(targetValue, sourceValue, key, dest as T, src as S);

      if (customized !== undefined) {
        dest[key] = customized;
        continue;
      }

      if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        dest[key] = mergeDeep(targetValue, sourceValue);
      } else if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        dest[key] = mergeDeep(targetValue, sourceValue);
      } else if (Array.isArray(sourceValue)) {
        dest[key] = mergeDeep([], sourceValue);
      } else if (isPlainObject(sourceValue)) {
        dest[key] = mergeDeep({}, sourceValue);
      } else if (targetValue === undefined || sourceValue !== undefined) {
        dest[key] = sourceValue;
      }
    }

    return dest;
  };

  return mergeDeep(target, source) as T & S;
};
