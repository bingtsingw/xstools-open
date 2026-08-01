/**
 * 生成 20 位业务 oid：前 6 位日期，中间 8 位时间相关伪随机，后 6 位随机数。
 *
 * 非加密 ID，仅用于可读业务标识，不可当安全令牌或唯一性保证。
 *
 * @example
 * oid() // => 24123141323885749088
 */
export const oid = (): string => {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, ''); // 24-12-31 -> 241231
  const time = now.getMilliseconds().toString() + now.getTime().toString();
  const timeRand = (parseInt(time, 10) / 42).toString(10).slice(0, 8);

  return date + timeRand + Math.random().toString().slice(2, 8);
};
