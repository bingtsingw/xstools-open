import { pathToSegments } from '../_internal';

const isUnsafeKey = (key: PropertyKey): boolean => key === '__proto__';

/**
 * Dynamically get a nested value from an object.
 *
 * Own keys are preferred over deep paths, so `'a.b'` prefers an own `'a.b'` key
 * over nested `a` → `b`. Only `undefined` falls back to `defaultValue`; `null`
 * is returned as is.
 *
 * Reference: https://github.com/toss/es-toolkit/blob/main/src/compat/object/get.ts
 *
 * @example
 * get({ a: { b: 3 } }, 'a.b'); // => 3
 * get({ a: { b: 3 } }, 'a.c'); // => undefined
 * get({ a: { b: 3 } }, 'a.c', null); // => null
 */
export function get<T extends object, K extends keyof T>(data: T, path: K): T[K];
export function get<T extends object, K extends keyof T>(data: T | null | undefined, path: K): T[K] | undefined;
export function get<T extends object, K extends keyof T, D>(
  data: T | null | undefined,
  path: K,
  defaultValue: D,
): Exclude<T[K], undefined> | D;
export function get<T, P extends string>(data: T, path: P): string extends P ? any : Get<T, P>;
export function get<T, P extends string, D = Get<T, P>>(
  data: T,
  path: P,
  defaultValue: D,
): Exclude<Get<T, P>, null | undefined> | D;
export function get<D>(data: any, path: string): D;
export function get(data: any, path: PropertyKey, defaultValue?: any): any;
export function get(data: any, path: PropertyKey, defaultValue?: any): any {
  if (data === null || data === undefined) {
    return defaultValue;
  }

  if (isUnsafeKey(path)) {
    return defaultValue;
  }

  // symbol is always a direct key; never parse as a deep path
  if (typeof path === 'symbol') {
    const value = data[path];
    return value === undefined ? defaultValue : value;
  }

  const key = typeof path === 'number' && Object.is(path, -0) ? '-0' : path.toString();

  if (Object.hasOwn(data, key)) {
    const value = data[key];
    return value === undefined ? defaultValue : value;
  }

  const segments = pathToSegments(key);

  if (segments.length === 0) {
    return defaultValue;
  }

  let current: any = data;
  let index: number;

  for (index = 0; index < segments.length; index++) {
    if (current === null || current === undefined) {
      break;
    }

    const segment = segments[index]!;
    if (isUnsafeKey(segment)) {
      return defaultValue;
    }

    current = current[segment];
  }

  if (current === null && index === segments.length) {
    return current;
  }

  return current ?? defaultValue;
}

/**
 * See the definition of `@types/lodash`.
 */
type Get<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof Exclude<T, undefined>
    ? FieldWithPossiblyUndefined<Exclude<T, undefined>[Left], Right> | Extract<T, undefined>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? FieldWithPossiblyUndefined<IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>, Right>
        : undefined
      : undefined
  : P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
        : undefined
      : IndexedFieldWithPossiblyUndefined<T, P>;

type FieldWithPossiblyUndefined<T, Key> = Get<Exclude<T, undefined>, Key> | Extract<T, undefined>;

type IndexedFieldWithPossiblyUndefined<T, Key> = GetIndexedField<Exclude<T, undefined>, Key> | Extract<T, undefined>;

type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
    ? 'length' extends keyof T
      ? number extends T['length']
        ? number extends keyof T
          ? T[number]
          : undefined
        : undefined
      : undefined
    : undefined;
