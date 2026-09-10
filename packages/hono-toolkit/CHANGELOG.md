# @xstools/hono-toolkit

## 2.0.0

### Major Changes

- [`7536641`](https://github.com/bingtsingw/xstools-open/commit/75366411700adcd4a535c53a524055a62bc7e2b7) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 移除页码分页的 `pageSkip` 配置

### Minor Changes

- [`7536641`](https://github.com/bingtsingw/xstools-open/commit/75366411700adcd4a535c53a524055a62bc7e2b7) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 分页改为 `pagination.page()` / `pagination.cursor()`，在 Hono in 上留下 `__paginationKind`，供 API 生成器识别分页端点。`pagination()` 不再可直接调用。

### Patch Changes

- [`fb81685`](https://github.com/bingtsingw/xstools-open/commit/fb816852793d50d4571a69cd273246ca9ab11af1) Thanks [@bingtsingw](https://github.com/bingtsingw)! - fix: generate pagination namespace declarations

## 1.2.0

### Minor Changes

- [`a14d057`](https://github.com/bingtsingw/xstools-open/commit/a14d057eeb69be4bd1fd1839907e07a6d14d0645) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add zod to peer deps

## 1.1.0

### Minor Changes

- [`4028bde`](https://github.com/bingtsingw/xstools-open/commit/4028bdeb4ec9cf19b754ae76f3e070d538dbc93b) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add apiValidate

## 1.0.0

### Major Changes

- [`e0fdc88`](https://github.com/bingtsingw/xstools-open/commit/e0fdc88feed9b0c745c5988e52341b874598e388) Thanks [@bingtsingw](https://github.com/bingtsingw)! - first release
