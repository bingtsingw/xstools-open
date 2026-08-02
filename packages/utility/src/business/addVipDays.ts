// TODO(date-refactor): uncomment and rework in Phase 5
// import { addDays, parseISO, startOfDay } from 'date-fns';
// import { ot } from '../_exports/date-fns/ot';
//
// /**
//  * 延长/减少 VIP 天数。
//  */
// export const addVipDays = ({
//   vipTo,
//   duration,
//   offset,
// }: {
//   vipTo?: string;
//   duration: number;
//   offset: string;
// }): Date => {
//   let from = new Date();
//
//   // 如果已经是 vip, 天数则从最新开始算起; 如果不是 vip 或者已过期, 天数从当前算起
//   if (vipTo) {
//     const vipToDateTime = parseISO(vipTo);
//     if (vipToDateTime > from) {
//       from = vipToDateTime;
//     }
//   }
//
//   let extraDay = 1;
//   if (duration < 0) {
//     extraDay = -1;
//   }
//
//   return addDays(startOfDay(from, { in: ot(offset) }), extraDay + duration);
// };

export {};
