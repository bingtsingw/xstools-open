import { getTag } from '../object';

/**
 * Checks if the given value is an `Error` (including cross-realm duck typing).
 *
 * Reference: https://es-toolkit.dev/compat/reference/predicate/isError.html
 *
 * @param err - The value to check.
 * @returns `true` if `err` is an `Error` or Error-like across realms.
 *
 * @example
 * isError(new Error()); // => true
 * isError({ name: 'Error', message: '' }); // => false
 * isError(null); // => false
 */
export const isError = (err: unknown): err is Error => {
  // 1. 引用校验（最快，覆盖 95% 情况）
  if (err instanceof Error) {
    return true;
  }

  // 2. 基础排除
  if (err === null || typeof err !== 'object') {
    return false;
  }

  // 3. 严谨的鸭子类型校验
  const candidate = err as { message?: unknown; name?: unknown; stack?: unknown };
  return (
    typeof candidate.message === 'string' &&
    typeof candidate.name === 'string' &&
    // 真实的错误几乎一定包含`stack`字符串, 或满足内置的`Error`标志
    (typeof candidate.stack === 'string' || getTag(err) === '[object Error]')
  );
};
