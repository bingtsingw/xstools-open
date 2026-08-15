import { mergeWith } from './mergeWith';

const useDefaultMerge = (): undefined => undefined;

/**
 * Deeply merges `source` into `target`, mutating `target`.
 *
 * Same-type plain objects recurse; arrays merge by index (not concatenated).
 * When types differ, `source` wins — nested plain objects / arrays are cloned
 * so `source` is not mutated. `undefined` in `source` does not overwrite an
 * existing defined value. Equivalent to `mergeWith` when the customizer always
 * returns `undefined`.
 *
 * Reference: https://es-toolkit.dev/reference/object/merge.html
 *
 * @param target - Destination object. Modified in place.
 * @param source - Source object to merge from.
 * @returns The mutated `target`.
 *
 * @example
 * merge({ a: 1, b: { x: 1, y: 2 } }, { b: { y: 3, z: 4 }, c: 5 })
 * // => { a: 1, b: { x: 1, y: 3, z: 4 }, c: 5 }
 *
 * merge({ a: [1, 2] }, { a: [3] }) // => { a: [3, 2] }
 * merge({ a: 1, b: 2 }, { b: undefined, c: 3 }) // => { a: 1, b: 2, c: 3 }
 */
export const merge = <T extends Record<PropertyKey, any>, S extends Record<PropertyKey, any>>(
  target: T,
  source: S,
): T & S => mergeWith(target, source, useDefaultMerge);
