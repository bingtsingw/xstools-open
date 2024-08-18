import { toArgs } from './toArgs';

export const stubTrue = (): true => {
  return true;
};

export const stubFalse = (): false => {
  return false;
};

export const stubZero = (): number => {
  return 0;
};

export const stubArgs = toArgs([1, 2, 3]);
