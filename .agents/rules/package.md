# package

跟发布、引入第三方包相关的一些规则

## imports and exports

- 只通过子路径导入：`@xstools/utility/<domain>`
- 无根入口 `"."`，不要新增 `@xstools/utility` 整包导出（除非明确要改架构）
- `_exports` 对应的三方库放 `dependencies`（`^` 范围），不要 bundle，以便 tree-shake 和与业务仓去重
- 新域必须同步改 `package.json` `exports` 与 `tsdown`配置

## changeset

- 修改代码后, 在 `.changeset`目录下自动添加 `conventional` 风格的改动文件
  - 文件名使用 `随机word`组合，防止多人合作的时候碰撞
  - 内容里不需要 `scope`, 比如 `fix: xxx`, 直接写 `xxx`, `changeset` 会根据类型自动加 `scope`
