export type PaginationKind = 'page' | 'cursor';

export const parseQueryInteger = (value: string | undefined): number | undefined => {
  if (value === undefined || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.trunc(parsed);
};
