---
'@xstools/hono-toolkit': minor
---

分页改为 `pagination.page()` / `pagination.cursor()`，在 Hono in 上留下 `__paginationKind`，供 API 生成器识别分页端点。`pagination()` 不再可直接调用。
