import { zValidator } from '@hono/zod-validator';

/**
 * `zValidator` 封装。
 *
 * 未传 `hook` 时，校验失败会 `throw` ZodError（不是 zValidator 默认的 400 响应）。
 * 调用方必须在 `app.onError` 里处理 `ZodError`，否则会变成未捕获异常（通常 500）。
 * 传入第三参 `hook` 可覆盖该行为。
 */
export const validate = ((target, schema, hook) => {
  return zValidator(
    target,
    schema,
    hook ??
      ((result) => {
        if (!result.success) {
          throw result.error;
        }
      }),
  );
}) as typeof zValidator;
