# package

跟发布、引入第三方包相关的一些规则

## imports and exports

- 只通过子路径导入：`@xstools/utility/<domain>`
- 无根入口 `"."`，不要新增 `@xstools/utility` 整包导出（除非明确要改架构）
- 三方库走 `_exports` + `devDependencies`，不要往 `runtime dependencies` 塞
- 新域必须同步改 `package.json` `exports` 与 `tsdown`配置

## changeset

- 修改代码后, 在`.changeset`目录下自动添加`conventional`风格的改动文件
