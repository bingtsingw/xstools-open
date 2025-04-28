import { addMinutes } from 'date-fns';

export function fromZonedTime(date: Date | string | number, timeZone: string): Date {
  // 转换输入为 Date 对象
  const inputDate = date instanceof Date ? date : new Date(date);

  // 解析时区字符串
  const matches = timeZone.match(/^([+-])(\d{2}):(\d{2})$/);
  if (!matches) {
    throw new Error('时区格式无效，请使用如 "+08:00" 的格式');
  }

  const sign = matches[1] === '+' ? 1 : -1;
  const hours = matches[2] ? parseInt(matches[2], 10) : 0;
  const minutes = matches[3] ? parseInt(matches[3], 10) : 0;

  // 计算时区偏移（分钟）
  const targetOffset = sign * (hours * 60 + minutes);
  const localOffset = inputDate.getTimezoneOffset();
  const diffMinutes = targetOffset + localOffset;

  // 调整时间并格式化
  return addMinutes(inputDate, diffMinutes);
}
