export const isError = (err: unknown): err is Error => {
  // 1. 引用校验（最快，覆盖 95% 情况）
  if (err instanceof Error) return true;

  // 2. 基础排除
  if (err === null || typeof err !== 'object') return false;

  // 3. 严谨的鸭子类型校验
  return (
    typeof (err as any).message === 'string' &&
    typeof (err as any).name === 'string' &&
    // 真实的错误几乎一定包含`stack`字符串, 或满足内置的`Error`标志
    (typeof (err as any).stack === 'string' || Object.prototype.toString.call(err) === '[object Error]')
  );
};
