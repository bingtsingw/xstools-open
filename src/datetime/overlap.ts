import { _exception } from '../exception';

interface Comparable {
  valueOf: () => number;
}

interface CompareDatetime {
  start: Comparable;
  end: Comparable;
}

export const isOverlap = (one: CompareDatetime, two: CompareDatetime) => {
  if (one.start > one.end || two.start > two.end) {
    throw new _exception.server.InternalErrorException('时间段无效');
  }

  if (one.end < two.start || two.end < one.start) {
    return false;
  }

  return true;
};

export const isOverlaps = (time: CompareDatetime, compares: CompareDatetime[]): boolean => {
  for (const compare of compares) {
    if (isOverlap(time, compare)) {
      return true;
    }
  }

  return false;
};
