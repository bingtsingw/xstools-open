import type { MiddlewareHandler } from 'hono';
import { parseQueryInteger } from './_utils';

/**
 * page: 当前页码
 * pageSize: 每页条数
 */
export interface PagePagination {
  Variables: {
    page: {
      query: { page: number; pageSize: number };
      where: { offset: number; limit: number };
    };
  };
}

interface PagePaginationOptions {
  page?: {
    default?: number;
    min?: number;
  };
  pageSize?: {
    default?: number;
    min?: number;
    max?: number;
  };
}

type PagePaginationMiddleware = MiddlewareHandler<
  PagePagination,
  string,
  {
    in: {
      /** 仅在类型层存在；API 生成器据此识别页码分页端点。 */
      readonly __paginationKind?: 'page';
    };
  }
>;

/**
 * 页码分页（kind 为 `page`，不用 `offset` 作为对外术语）。
 * 解析 `page` / `pageSize`，写入 `c.get('page')`。
 * 类型上会在 Hono `in` 上留下 `__paginationKind`，供 API 生成器识别分页端点。
 *
 * @example
 * ```ts
 * app.get('/items', pagination.page(), (c) => {
 *   const { where } = c.get('page');
 *   return c.json({ data: [] });
 * });
 * ```
 */
export const pagePagination = (options?: PagePaginationOptions): PagePaginationMiddleware => {
  const PAGE_DEFAULT = options?.page?.default ?? 1;
  const PAGE_MIN = options?.page?.min ?? 1;

  const PAGE_SIZE_DEFAULT = options?.pageSize?.default ?? 10;
  const PAGE_SIZE_MIN = options?.pageSize?.min ?? 1;
  const PAGE_SIZE_MAX = options?.pageSize?.max ?? 100;

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

    const offset = (page - 1) * pageSize;

    ctx.set('page', {
      query: { page, pageSize },
      where: { offset, limit: pageSize },
    });

    await next();
  } as PagePaginationMiddleware;
};
