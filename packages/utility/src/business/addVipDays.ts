import { addDays, isValid, ot, parseISO, startOfDay, utc } from '../_exports/date-fns';
import { ParamError } from '../error';

/**
 * 延长 / 减少 VIP 天数。
 *
 * - 仍在有效期内：从当前 `vipTo` 起算
 * - 未开通或已过期：从当前时刻起算
 * - 结果对齐业务 `offset` 下的日初，并额外 ±1 天（赠送到当日结束 / 对称扣减）
 * - 无时区的 `vipTo` 字符串按 **UTC 墙钟** 解析（`parseISO(..., { in: utc })`）
 *
 * @example
 * addVipDays({ vipTo: '2099-01-01 15:59:00', duration: 0, offset: '+08:00' }).toISOString()
 * // => '2099-01-01T16:00:00.000Z'
 *
 * @throws {ParamError} 当 `duration` 非有限数字、`offset` 非法，或 `vipTo` 无法解析
 */
export const addVipDays = ({ vipTo, duration, offset }: { vipTo?: string; duration: number; offset: string }): Date => {
  if (!Number.isFinite(duration)) {
    throw new ParamError('Invalid VIP duration');
  }

  let from = new Date();

  if (vipTo !== undefined && vipTo !== '') {
    const vipToDateTime = parseISO(vipTo, { in: utc });
    if (!isValid(vipToDateTime)) {
      throw new ParamError('Invalid VIP expiry date');
    }
    if (vipToDateTime > from) {
      from = vipToDateTime;
    }
  }

  const extraDay = duration < 0 ? -1 : 1;

  return addDays(startOfDay(from, { in: ot(offset) }), extraDay + duration);
};
