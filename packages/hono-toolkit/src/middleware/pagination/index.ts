import { cursorPagination } from './cursor';
import { pagePagination } from './page';

export type { CursorPagination } from './cursor';
export type { PagePagination } from './page';
export type { PaginationKind } from './_utils';

export const pagination: {
  page: typeof pagePagination;
  cursor: typeof cursorPagination;
} = {
  page: pagePagination,
  cursor: cursorPagination,
};
