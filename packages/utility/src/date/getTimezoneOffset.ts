/**
 * 获取当前时区偏移量
 * @returns 时区偏移量，格式为 `+08:00` 或 `-08:00`
 *
 * @example
 * getTimezoneOffset(); // '+00:00'
 */
export const getTimezoneOffset = (): string => {
  const offset = new Date().getTimezoneOffset();
  const sign = offset > 0 ? '-' : '+';
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
  const minutes = String(Math.abs(offset) % 60).padStart(2, '0');

  return `${sign}${hours}:${minutes}`;
};
