import type { MiddlewareHandler } from 'hono';

/**
 * page: 当前页码
 * pageSize: 每页条数
 * pageSkip: 跳过条数(不是跳过多少页, 而是跳过多少条)
 */
export interface Pagination {
  Variables: {
    page: {
      query: { page: number; pageSize: number; pageSkip: number };
      where: { offset: number; limit: number };
    };
  };
}

interface PaginationOptions {
  page?: {
    default?: number;
    min?: number;
  };
  pageSize?: {
    default?: number;
    min?: number;
    max?: number;
  };
  pageSkip?: {
    default?: number;
  };
}

const parseQueryInteger = (value: string | undefined): number | undefined => {
  if (value === undefined || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.trunc(parsed);
};

export const pagination = (options?: PaginationOptions): MiddlewareHandler<Pagination> => {
  const PAGE_DEFAULT = options?.page?.default ?? 1;
  const PAGE_MIN = options?.page?.min ?? 1;

  const PAGE_SIZE_DEFAULT = options?.pageSize?.default ?? 10;
  const PAGE_SIZE_MIN = options?.pageSize?.min ?? 1;
  const PAGE_SIZE_MAX = options?.pageSize?.max ?? 100;

  const PAGE_SKIP_DEFAULT = options?.pageSkip?.default ?? 0;

  return async function (ctx, next) {
    let page = parseQueryInteger(ctx.req.query('page')) ?? PAGE_DEFAULT;
    if (page < PAGE_MIN) {
      page = PAGE_MIN;
    }

    let pageSize = parseQueryInteger(ctx.req.query('pageSize')) ?? PAGE_SIZE_DEFAULT;
    if (pageSize < PAGE_SIZE_MIN) {
      pageSize = PAGE_SIZE_MIN;
    } else if (pageSize > PAGE_SIZE_MAX) {
      pageSize = PAGE_SIZE_MAX;
    }

    const pageSkip = parseQueryInteger(ctx.req.query('pageSkip')) ?? PAGE_SKIP_DEFAULT;
    const offset = pageSkip + (page - 1) * pageSize;

    ctx.set('page', {
      query: { page, pageSize, pageSkip },
      where: { offset, limit: pageSize },
    });

    await next();
  };
};
