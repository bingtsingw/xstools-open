import { isError } from '../../predicate';
import type { ITaggedError } from './createTaggedError';

/**
 * Check whether `err` is a tagged error.
 *
 * - No `constructor`: any `Error` with a string `_tag`.
 * - With `constructor`: must be a tagged-error class (static `is`); delegates to
 *   `constructor.is(err)`. Constructors without static `is` (e.g. `Error`) yield
 *   `false` — use `instanceof` yourself if that is what you need.
 */
export const isTaggedError = <
  // 1. 定义 E 必须是一个构造函数，且拥有静态 is 方法
  E extends (abstract new (...args: any[]) => any) & { is: (err: unknown) => err is any },
>(
  err: unknown,
  constructor?: E,
): err is typeof constructor extends undefined ? ITaggedError : InstanceType<E> => {
  // A. 基础协议检查（未传类时）
  if (constructor === undefined) {
    return isError(err) && typeof (err as any)._tag === 'string';
  }

  // B. 仅接受带静态 is 的 tagged 构造类
  if (typeof constructor.is === 'function') {
    return constructor.is(err);
  }

  return false;
};
