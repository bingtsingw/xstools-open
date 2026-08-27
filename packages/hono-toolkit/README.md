# @xstools/hono-toolkit

Hono 应用的辅助中间件与工具。`hono` 是 peerDependency，调用方需自行安装。

## validate

未传 `hook` 时，校验失败会 `throw ZodError`，不会像 `@hono/zod-validator` 默认那样直接返回 400。

请在 `app.onError` 中处理，否则会变成未捕获异常（通常 500）：

```ts
import { ZodError } from 'zod';

app.onError((err, c) => {
  if (err instanceof ZodError) {
    return c.json({ message: err.message }, 400);
  }

  throw err;
});
```

传入第三参 `hook` 可覆盖该行为。
