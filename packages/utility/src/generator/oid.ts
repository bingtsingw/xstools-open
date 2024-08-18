/**
 * 生成20位的oid, 前6位为日期, 中间8位为时间相关的伪随机, 后6位为随机数
 *
 * @example
 * oid() // => 24123141323885749088
 */
export const oid = (): string => {
  const now = new Date('2024-12-31T00:00:00.000Z');
  const date = now.toISOString().slice(2, 10).replace(/-/g, ''); // 24-12-31 -> 241231
  const time = now.getMilliseconds().toString() + now.getTime().toString();
  const timeRand = (parseInt(time, 10) / 42).toString(10).slice(0, 8);

  return date + timeRand + Math.random().toString().slice(2, 8);
};
