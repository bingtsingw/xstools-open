# merge / mergeWith

交互对照页（标签、指标卡、分表）：[merge.html](./merge.html)。下文是同一份内容的 Markdown，给 Agent / 检索用。

`@xstools/utility/object` 的深合并，对照 lodash 4.17.21 与 es-toolkit 1.50.0 现代 API（`es-toolkit/object`）。

es-toolkit 的 `merge` 与 `mergeWith` 默认路径不一致，下文分开写。「es-toolkit mergeWith」均指 customizer 返回 `undefined` 的默认路径。本库 `merge(a, b)` 与这条路径相同。

对照版本：lodash 4.17.21 · es-toolkit 1.50.0 · `packages/utility/src/object/merge*.ts`。

## 定位

- 对标 lodash 形的「原地深合并 + mergeWith」
- API 宽度跟 es-toolkit 现代版：二元、只扫自有可枚举字符串 key
- 默认策略跟 es-toolkit 的 **`mergeWith`** 对齐，并保证 `merge` ≡ 默认 `mergeWith`（lodash 也是这样；es-toolkit 现代版不是）
- 同型才递归（POJO+POJO / Array+Array）；异型则 source 赢并 clone
- 环引用用内部 `WeakMap`，不把 `stack` 暴露给 customizer

日常 POJO / 数组下标深合并、`undefined` 跳过、`mergeWith` concat —— 三家一样。分叉集中在「对象和数组交叉」和「要不要 lodash 那套特殊对象 / 继承属性」。

## API

| 维度 | xstools | lodash 4 | es-toolkit merge | es-toolkit mergeWith |
| --- | --- | --- | --- | --- |
| 签名 | `merge(t, s)` / `mergeWith(t, s, fn)` | `merge(t, ...sources)` / `mergeWith(t, ...sources, fn)` | `merge(t, s)` | `mergeWith(t, s, fn)` |
| customizer 参数 | 5：value ×2, key, target, source | 6：再加 `stack` | — | 5：无 `stack` |
| `merge` ≡ 默认 `mergeWith` | 对齐 | 对齐（noop） | 不同 | 自身即默认路径 |
| 是否改 target | 改，并返回它 | 改，并返回它 | 改，并返回它 | 改，并返回它 |
| 多 source | 否，两次调用或 `reduce` | rest 参数 | 否 | 否 |

## 默认合并策略

| 规则 | xstools | lodash 4 | es-toolkit merge | es-toolkit mergeWith 默认 |
| --- | --- | --- | --- | --- |
| POJO + POJO | 递归合进 target | 同左 | 同左 | 同左 |
| Array + Array | 按下标合，不 concat | 同左 | 同左 | 同左 |
| target POJO + source Array | 换成 clone 后的数组 | 换成新数组再合（source 赢） | 保住对象，写入 `0` / `1` / … 下标 | 换成 clone 后的数组 |
| target Array + source POJO | 换成 clone 后的对象 | 保住数组，对象 key 挂到数组上 | 保住数组，对象 key 挂到数组上 | 换成 clone 后的对象 |
| source 嵌套 POJO/Array 且 target 非同型 | clone 进 `{}` / `[]` | clone（`initCloneObject` / `[]`） | clone 进 `{}` / `[]` | clone 进 `{}` / `[]` |
| 已有同型嵌套 | 原地改 target 里的那个对象/数组 | 原地改 | 原地改 | 原地改 |
| `undefined` 覆盖已有值 | 否 | 否 | 否 | 否 |
| 缺 key 时写入 `undefined` | 是 | 是（`key not in object`） | 是 | 是 |
| `null` | 覆盖 | 覆盖 | 覆盖 | 覆盖 |
| Date / class / Map / 函数 | 按引用赋 | 按引用赋（非 plain） | 按引用赋 | 按引用赋 |

lodash 在对象↔数组上不对称：数组作 source 会换掉对象，对象作 source 却合进数组。本库两边都是 source 赢。

## 键、安全、环

| 维度 | xstools | lodash 4 | es-toolkit 现代 |
| --- | --- | --- | --- |
| 扫描哪些 key | `Object.keys`（自有可枚举字符串） | `keysIn`（含原型链） | `Object.keys` |
| symbol | 忽略 | 忽略 | 忽略 |
| 继承属性 | 忽略 | 会合进来 | 忽略 |
| 写路径 unsafe | `__proto__` / `constructor` / `prototype` 全跳过 | `safeGet` 跳过 `__proto__` 与函数 `constructor`；仍可能 `defineProperty` 写 `__proto__` | 只跳过 `__proto__` |
| 环引用 | `WeakMap`：再遇到同一 source 复用已合并对象 | `Stack`，同样复用 | 无，会爆栈 |
| 菱形引用（a、b 指向同一对象） | 两个 key 共享同一 clone | 共享 | 各 clone 一次（无 stack） |
| 非 object target/source | 原样返回 target（no-op） | primitive target 会 `Object(target)` 装箱 | 给 `null` / `undefined` 赋值会 `TypeError` |

## 大家都一样

| 输入 | 结果 |
| --- | --- |
| `merge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 5 })` | `{ a: 1, b: { x: 1, y: 2 }, c: 5 }` |
| `merge({ a: [1, 2] }, { a: [3] })` | `{ a: [3, 2] }`（下标覆盖，多余元素保留） |
| `merge({ a: [{ b: 2 }, { d: 4 }] }, { a: [{ c: 3 }, { e: 5 }] })` | `{ a: [{ b: 2, c: 3 }, { d: 4, e: 5 }] }` |
| `merge({ a: 1, b: 2 }, { b: undefined, c: 3 })` | `{ a: 1, b: 2, c: 3 }` |
| `merge({ a: { x: 1 } }, { a: null })` | `{ a: null }` |
| `merge({ a: null }, { a: [1, 2] })` | `{ a: [1, 2] }` |
| `merge({}, { a: new Date() }).a` | 同一 Date 引用 |

## 会分叉的用例

| 输入 | xstools | lodash | es-toolkit merge | es-toolkit mergeWith |
| --- | --- | --- | --- | --- |
| `merge({ x: {} }, { x: [1, 2] })` | `{ x: [1, 2] }` | `{ x: [1, 2] }` | `{ x: { 0: 1, 1: 2 } }` | `{ x: [1, 2] }` |
| `merge({ x: [] }, { x: { a: 1 } })` | `{ x: { a: 1 } }` | `{ x: [] }` 且带 `a: 1` | `{ x: [] }` 且带 `a: 1` | `{ x: { a: 1 } }` |
| `merge({ x: 's' }, { x: { a: 1 } })` | `{ x: { a: 1 } }` clone | 同左 | 同左 | 同左 |
| `const n={a:1}; n.self=n; merge({b:2}, n)` | `{ a:1, b:2, self: 结果自己 }` | 同左（Stack） | `RangeError` 爆栈 | `RangeError` 爆栈 |
| `merge({}, Object.create({ inherited: 1 }))` 且另有自有 `own` | `{ own: 2 }` | `{ inherited: 1, own: 2 }` | `{ own: 2 }` | `{ own: 2 }` |
| `merge({ a: 1 }, { constructor: { p: true }, a: 2 })` | `{ a: 2 }`（`constructor` 不写） | 可能写入 `constructor` | 可能写入 `constructor` | 可能写入 `constructor` |
| `merge(null, { a: 1 })` | 返回 `null` | 装箱后的对象 | `TypeError` | `TypeError` |

从 lodash 迁过来最容易踩的：

```ts
merge({ x: [1, 2] }, { x: { a: 1 } });
```

lodash / es-toolkit `merge` 得到带 named property 的数组；本库得到 `{ x: { a: 1 } }`。数组 concat 仍然要自己写 `mergeWith`。

## mergeWith customizer

| 行为 | xstools | lodash | es-toolkit 现代 |
| --- | --- | --- | --- |
| 返回非 `undefined` | 直接赋给 `target[key]` | `assignMergeValue` | 直接赋 |
| 返回 `undefined` | 走默认策略 | 走默认策略 | 走默认策略（与 `merge` 不同） |
| 返回 `null` | 保留 `null`，不回退 | 保留 `null` | 保留 `null` |
| 无法用 customizer 写成 `undefined` | 是（`undefined` 表示回退） | 是 | 是 |
| 传入 `stack` | 否 | 第 6 参 | 否 |
| unsafe key 是否仍调 customizer | 否，先 skip | 会进循环，`safeGet` 读不到 | 先 skip `__proto__` |

## 刻意不做

lodash / es-toolkit compat 有、本库没有：

| 能力 | lodash / compat | 为何不做 |
| --- | --- | --- |
| `...sources` rest | 一次合多个 source | 与 `difference` 等二元 API 一致；调用方可 `reduce` |
| `keysIn` 继承属性 | class 实例原型上的可枚举字段也会合 | 本库 object 域只扫 `Object.keys` |
| symbol 键 | compat 会合 `getSymbols` | 与 `pick` / `omitBy` / `shake` 一致，忽略 |
| Buffer / TypedArray 深拷 | `cloneBuffer` / `cloneTypedArray` | 当非 POJO，按引用赋 |
| `arguments` 转普通对象 | `toPlainObject` | 极少见，避免 `isArguments` 依赖 |
| customizer `stack` | 给用户看环检测结构 | 环只做内部 `WeakMap`，不泄漏实现 |
| 数组 array-like 互转 | 有 `length` 的类数组可当成数组底 | 只认 `Array.isArray` |

相对 es-toolkit 现代版多做的：

| 点 | 说明 |
| --- | --- |
| `merge` ≡ `mergeWith` 默认 | 现代版这两条默认路径在对象↔数组上不一致 |
| 环 + 菱形引用 | clone 嵌套 POJO 时必须记 visited，否则带自引用的配置图会爆栈 |
| 写路径三条 unsafe key | merge 是写；只挡 `__proto__` 不够 |
| 非 object 入参 no-op | 不抛 `TypeError`，也不装箱 |
