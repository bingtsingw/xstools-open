import { Exception } from '../exception';

export const areIntervalsOverlap = (intervalLeft: Interval, intervalRight: Interval): boolean | never => {
  if (intervalLeft.start > intervalLeft.end || intervalRight.start > intervalRight.end) {
    throw new Exception.Server.InternalErrorException('时间段无效');
  }

  if (intervalLeft.end < intervalRight.start || intervalRight.end < intervalLeft.start) {
    return false;
  }

  return true;
};

export const areIntervalsOverlaps = (time: Interval, compares: Interval[]): boolean => {
  for (const compare of compares) {
    if (areIntervalsOverlap(time, compare)) {
      return true;
    }
  }

  return false;
};
