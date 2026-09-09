import type { MiddlewareHandler } from 'hono';
import { parseQueryInteger } from './_utils';

/**
 * cursor: 不透明游标，缺省或空串表示第一页
 * limit: 本页条数
 */
export interface CursorPagination {
  Variables: {
    cursor: {
      query: { cursor?: string; limit: number };
      where: { cursor?: string; limit: number };
    };
  };
}

interface CursorPaginationOptions {
  limit?: {
    default?: number;
    min?: number;
    max?: number;
  };
}

type CursorPaginationMiddleware = MiddlewareHandler<
  CursorPagination,
  string,
  {
    in: {
      /** 仅在类型层存在；API 生成器据此识别游标分页端点。 */
      readonly __paginationKind?: 'cursor';
    };
  }
>;

const parseQueryCursor = (value: string | undefined): string | undefined => {
  if (value === undefined || value === '') {
    return undefined;
  }

  return value;
};

/**
 * 单向游标分页（kind 为 `cursor`）。
 * 解析 `cursor` / `limit`，写入 `c.get('cursor')`。
 * 不解码 cursor，原样交给业务。类型上会在 Hono `in` 上留下 `__paginationKind`。
 *
 * @example
 * ```ts
 * app.get('/items', pagination.cursor(), (c) => {
 *   const { where } = c.get('cursor');
 *   return c.json({ data: [], nextCursor: undefined });
 * });
 * ```
 */
export const cursorPagination = (options?: CursorPaginationOptions): CursorPaginationMiddleware => {
  const LIMIT_DEFAULT = options?.limit?.default ?? 10;
  const LIMIT_MIN = options?.limit?.min ?? 1;
  const LIMIT_MAX = options?.limit?.max ?? 100;

  return async function (ctx, next) {
    const cursor = parseQueryCursor(ctx.req.query('cursor'));

    let limit = parseQueryInteger(ctx.req.query('limit')) ?? LIMIT_DEFAULT;
    if (limit < LIMIT_MIN) {
      limit = LIMIT_MIN;
    } else if (limit > LIMIT_MAX) {
      limit = LIMIT_MAX;
    }

    ctx.set('cursor', {
      query: { cursor, limit },
      where: { cursor, limit },
    });

    await next();
  } as CursorPaginationMiddleware;
};
