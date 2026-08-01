# code

## JSDoc

- 注释中英文皆可
- 公开API至少一句说明 + @example, 私有API和变量常量不必非要写注释.
- 抛出错误需要在`jsdoc`中使用`@throws`

## code style

- 禁止使用 `==` 进行判断
- 导出方法的时候，有重载用 `function`，其余用 `const`。
- 可选配置：≤2 个可选尾参用位置参数；≥3 个相关字段用对象参数（如 `formatCurrency(n, { decimals, symbol, sign })`）。`ErrorOptions`、三方再导出的上游签名、legacy `exception` 除外

## code detail
- 抛出错误优先使用`Tagged Error`
- 为了兼容性，使用`Object.prototype.hasOwnProperty.call`，不使用`Object.hasOwn`