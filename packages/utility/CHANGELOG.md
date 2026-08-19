# @xstools/utility

## 1.0.0-beta.2

### Minor Changes

- [#36](https://github.com/bingtsingw/xstools-open/pull/36) [`9feef30`](https://github.com/bingtsingw/xstools-open/commit/9feef3094b99e173047cb951ee5c8c1af7f909db) Thanks [@HanShoujun](https://github.com/HanShoujun)! - reexport date-fns local

## 1.0.0-beta.1

### Minor Changes

- [`be18209`](https://github.com/bingtsingw/xstools-open/commit/be1820951ebe3dcf505e81d5605caab722249cfe) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 新增 object/merge 与 object/mergeWith，深合并且默认策略对齐

- [`e4f886e`](https://github.com/bingtsingw/xstools-open/commit/e4f886e3d78cef39fafa00b35fcd594e775d5e3d) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 新增 object/shake，默认剔除 undefined 属性

## 1.0.0-beta.0

### Major Changes

- [`3f41534`](https://github.com/bingtsingw/xstools-open/commit/3f41534644029d1ccdd0de0ac7edf61ab2bb3c4b) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 1.0-beta

### Minor Changes

- [`93b72fa`](https://github.com/bingtsingw/xstools-open/commit/93b72faa9402bb724673c0d1e59ef57aa7112e23) Thanks [@bingtsingw](https://github.com/bingtsingw)! - restore addVipDays under business with ot/utc-based day boundaries

- [`f092798`](https://github.com/bingtsingw/xstools-open/commit/f09279876de0a6faa198b3406ef06a1a568ef23f) Thanks [@bingtsingw](https://github.com/bingtsingw)! - formatCurrency 非有限按 0 处理；starlize\* 支持 MaybeString

- [`86695a2`](https://github.com/bingtsingw/xstools-open/commit/86695a2b05e0c75869d248e4e35671f1fc22b84c) Thanks [@bingtsingw](https://github.com/bingtsingw)! - weightedSample / subString 改抛 ParamError

- [`f2b136e`](https://github.com/bingtsingw/xstools-open/commit/f2b136e54c9f8aff0b639bea72701dbb973fe312) Thanks [@bingtsingw](https://github.com/bingtsingw)! - replace @date-fns/tz with self-implemented OTDateMini and ot (offset timezone)

- [`a1de4fc`](https://github.com/bingtsingw/xstools-open/commit/a1de4fc90fb49bfc152bc5941bd3146732e03464) Thanks [@bingtsingw](https://github.com/bingtsingw)! - areIntervalsOverlap 无效区间改抛 ParamError

- [`40377d7`](https://github.com/bingtsingw/xstools-open/commit/40377d7e65673b4a5d3a4087ef67b2af2bb6825f) Thanks [@bingtsingw](https://github.com/bingtsingw)! - move cnWeekDay from date to business; reject invalid dates with ParamError

- [`e3ff134`](https://github.com/bingtsingw/xstools-open/commit/e3ff134e9360964118844e32b5fe1b0dd45e073e) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 优化error文档、isTaggedError语义

- [`8a69483`](https://github.com/bingtsingw/xstools-open/commit/8a694831fbf440845dfd29fb51fb52f6ff7d9f44) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 新增 array/xor 与 object/omitBy

- [`e91b4ec`](https://github.com/bingtsingw/xstools-open/commit/e91b4ec00781fd3a11b52045f74fbf3be99bbffb) Thanks [@bingtsingw](https://github.com/bingtsingw)! - formatBytes 可选 decimals 改为 options 对象

- [`7ce9084`](https://github.com/bingtsingw/xstools-open/commit/7ce908499496fa746e36ddb78d06eed519922ac5) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add object/pick

- [`13d79f5`](https://github.com/bingtsingw/xstools-open/commit/13d79f51e05666bc093f2fe4fd3d1e3a7b39d2b5) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add weightedSample

- [`c37ea16`](https://github.com/bingtsingw/xstools-open/commit/c37ea1677328c17a163d947cc6c5e1973eee450a) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 优化array模块

- [`6cb0ee8`](https://github.com/bingtsingw/xstools-open/commit/6cb0ee83ebd3f773e90c90bcbe88e517e5c38cfa) Thanks [@bingtsingw](https://github.com/bingtsingw)! - restrict UTCDateMini/OTDateMini constructors to timestamp/Date/strict ISO; reject component args

- [`b3ace21`](https://github.com/bingtsingw/xstools-open/commit/b3ace21714d020d422bb1ae28796cb44a89ddfdf) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add parseOffset

- [`770e82d`](https://github.com/bingtsingw/xstools-open/commit/770e82de84d61259dd33a47a0e3476db0cb3bbc0) Thanks [@bingtsingw](https://github.com/bingtsingw)! - uuid25 assert 改抛 LogicError

- [`784098c`](https://github.com/bingtsingw/xstools-open/commit/784098c907f3f2fef30160f998ee6db7ae0a654d) Thanks [@bingtsingw](https://github.com/bingtsingw)! - remove legacy exception module; use @xstools/utility/error instead

- [`b0abfea`](https://github.com/bingtsingw/xstools-open/commit/b0abfea130d93e876683547f46a15b197422e1d8) Thanks [@bingtsingw](https://github.com/bingtsingw)! - getDistance 改抛 ParamError；districtStartWith 重命名为 isDistrictAcceptable

- [`b8c218b`](https://github.com/bingtsingw/xstools-open/commit/b8c218bb0cb86ac54c584e232b58c92f227a159f) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 优化business模块

- [`24cc82e`](https://github.com/bingtsingw/xstools-open/commit/24cc82e7bac9174602d45a5a4075c03a7aea4e51) Thanks [@bingtsingw](https://github.com/bingtsingw)! - rename datetime export path to date

- [`36da6e3`](https://github.com/bingtsingw/xstools-open/commit/36da6e39b04b8aba82aa4361837a14077c71b8bb) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add toEpoch

### Patch Changes

- [`b8972a7`](https://github.com/bingtsingw/xstools-open/commit/b8972a7abceecbfec90065bd8fb9a3d75dcf9672) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 清理 formatCurrency 死选项 F2Y，并加固 formatBytes 非法数值兜底

- [`da9cdb6`](https://github.com/bingtsingw/xstools-open/commit/da9cdb695f3078a5199ebe74c130f71af4c3fd22) Thanks [@bingtsingw](https://github.com/bingtsingw)! - fix empty Map/Set checks and align predicate export style

- [`ae5754d`](https://github.com/bingtsingw/xstools-open/commit/ae5754d2bc152d0c58a0419f0d0d3f307cb52ccd) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 完善 predicate 文档与边界；isArguments 签名改为 (value: unknown)；isError 复用 getTag

- [`5c2e53f`](https://github.com/bingtsingw/xstools-open/commit/5c2e53f284c341e52ddd122009fd64ad1c403b75) Thanks [@bingtsingw](https://github.com/bingtsingw)! - sleep 对非法 ms 按 0 处理

- [`f22c152`](https://github.com/bingtsingw/xstools-open/commit/f22c152e686207664a7a0d22be3d963c9357656f) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 优化`string`相关函数健壮性

- [`96657ef`](https://github.com/bingtsingw/xstools-open/commit/96657efc021c1c4db69480d68e0f3cde4c42dc4b) Thanks [@bingtsingw](https://github.com/bingtsingw)! - correct getTag undefined branch

- [`5ee12ed`](https://github.com/bingtsingw/xstools-open/commit/5ee12ed0a46a49eb4adf349569eafd1b3451a6ad) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 完善`get`的逻辑, 处理edge case

- [`601440e`](https://github.com/bingtsingw/xstools-open/commit/601440ef7829383c9231d562cfdcf90554db4f34) Thanks [@bingtsingw](https://github.com/bingtsingw)! - attempt / attemptAsync 改为 const，并补齐 E 默认与非 Error 测试

- [`c94cc89`](https://github.com/bingtsingw/xstools-open/commit/c94cc89d26b066de09d37f7a1e85de2fefc5575a) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 将 rankByPath 改为纯函数，并统一 sample 参数为 readonly

- [`35e5a30`](https://github.com/bingtsingw/xstools-open/commit/35e5a3092d90db7b759feddf3380db643e7c3dfe) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 完善 \_exports 文档与 cuid2 长度边界

- [`0b48ac3`](https://github.com/bingtsingw/xstools-open/commit/0b48ac37accb32be6ff38c25ce50425567b6e535) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 完善 object JSDoc；pick 非 object soft-fail；统一 hasOwnProperty；omitBy 注明不含 symbol

- [`2f6117b`](https://github.com/bingtsingw/xstools-open/commit/2f6117b0b31be66b63838f8774d782fd109f07b7) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 优化`string`模块

- [`9e52e7b`](https://github.com/bingtsingw/xstools-open/commit/9e52e7b1da139c7f7ac3c009125103b061fcbb22) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 统一 string 域 nullish 入参，并导出 MaybeString 类型

- [`40377d7`](https://github.com/bingtsingw/xstools-open/commit/40377d7e65673b4a5d3a4087ef67b2af2bb6825f) Thanks [@bingtsingw](https://github.com/bingtsingw)! - reject invalid inputs in addVipDays with ParamError

## 0.24.1

### Patch Changes

- [`d0650ee`](https://github.com/bingtsingw/xstools-open/commit/d0650ee4e60f8555bf627250fed0a7266ed8af3f) Thanks [@bingtsingw](https://github.com/bingtsingw)! - 修复tsdown编译问题

## 0.24.0

### Minor Changes

- [`6cf9f1f`](https://github.com/bingtsingw/xstools-open/commit/6cf9f1f79bea7db9107fd94cd636a8c040e78f8c) Thanks [@bingtsingw](https://github.com/bingtsingw)! - bundle all deps

## 0.23.1

### Patch Changes

- [`55a4474`](https://github.com/bingtsingw/xstools-open/commit/55a4474acca5fea36ae045a50d6a7aeead6c067b) Thanks [@bingtsingw](https://github.com/bingtsingw)! - fix cuid2 length

## 0.23.0

### Minor Changes

- [`3cc521f`](https://github.com/bingtsingw/xstools-open/commit/3cc521fc373bb81bd4268faa8af4c9de826d7313) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add nanoid

- [`21adc51`](https://github.com/bingtsingw/xstools-open/commit/21adc512f02cd9216c2fb6267303b7da9c96304a) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add ohash

## 0.22.0

### Minor Changes

- [`599885e`](https://github.com/bingtsingw/xstools-open/commit/599885e693698beee1dfeb4819daadd791c9908b) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add LogicError

- [`83e152e`](https://github.com/bingtsingw/xstools-open/commit/83e152e15a342fcb618138872cabd6f425b2d05e) Thanks [@bingtsingw](https://github.com/bingtsingw)! - remove hashParams

### Patch Changes

- [#24](https://github.com/bingtsingw/xstools-open/pull/24) [`3c4c674`](https://github.com/bingtsingw/xstools-open/commit/3c4c6742d2d1325b7effa6d45e01c6c582c0b7af) Thanks [@HanShoujun](https://github.com/HanShoujun)! - fix hasOwn in webview

## 0.21.0

### Minor Changes

- [`469e8ae`](https://github.com/bingtsingw/xstools-open/commit/469e8ae1b9585e2d067103b8bc88262c2b9039c6) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add error

- [`beae8c4`](https://github.com/bingtsingw/xstools-open/commit/beae8c42ab822584ab710b668f12ddb630ca25b1) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add predicate/isError

## 0.20.2

### Patch Changes

- [`42bc5bd`](https://github.com/bingtsingw/xstools-open/commit/42bc5bd394f356e16dbfa78b8169adf42a136bdc) Thanks [@bingtsingw](https://github.com/bingtsingw)! - fix exports

## 0.20.1

### Patch Changes

- [`6675fe9`](https://github.com/bingtsingw/xstools-open/commit/6675fe91bf0e224eb15d5db476226b762c2751b9) Thanks [@bingtsingw](https://github.com/bingtsingw)! - fix exports

## 0.20.0

### Minor Changes

- [`142c0d4`](https://github.com/bingtsingw/xstools-open/commit/142c0d4f7a599f1475ca2f5118b656b638af17f0) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add cuid2

- [`f2b003a`](https://github.com/bingtsingw/xstools-open/commit/f2b003abe4b96dd9f54c5b76d017f5ad7a277a47) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add uuid25 function

## 0.19.0

### Minor Changes

- [`41a4bee`](https://github.com/bingtsingw/xstools-open/commit/41a4bee89826996fc7bc854c1075cf6487af16bb) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add hashParams function

## 0.18.0

### Minor Changes

- [`402954b`](https://github.com/bingtsingw/xstools-open/commit/402954bc0265f794f8b3a1309cda8f46c364affa) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add async/sleep

- [`1156423`](https://github.com/bingtsingw/xstools-open/commit/11564232a0bde9351d6c0e96a850f47646a9ea3c) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add UTCDate

- [`7ce19a2`](https://github.com/bingtsingw/xstools-open/commit/7ce19a2a87f28cf62d10ff383fcb1527212f2ba3) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add predicate utilities

- [`ac0f555`](https://github.com/bingtsingw/xstools-open/commit/ac0f555d3cf4f0949a03b787b1587cffcdc1bf34) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add string utilities

- [`b4c0aa1`](https://github.com/bingtsingw/xstools-open/commit/b4c0aa15c1862aa04dfd5c809cc6534da02c75b4) Thanks [@bingtsingw](https://github.com/bingtsingw)! - update array functions

- [`5e15909`](https://github.com/bingtsingw/xstools-open/commit/5e159090a6be172e8ba99c0eb75922669e03b732) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add predicate/isObjectLike

- [`5613104`](https://github.com/bingtsingw/xstools-open/commit/5613104effe0cf088c194b52b3a0b752cae2760c) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add getTimezoneOffset

- [`c715a2b`](https://github.com/bingtsingw/xstools-open/commit/c715a2bf2386f5cd6582c5c685d8e1a386321941) Thanks [@bingtsingw](https://github.com/bingtsingw)! - update string functions

- [`3085b4a`](https://github.com/bingtsingw/xstools-open/commit/3085b4a378611f101984c7acec0c1ea715672e8a) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add string/substring

- [`1666a0f`](https://github.com/bingtsingw/xstools-open/commit/1666a0f9183ec907e71bada38ae1eac00dd2f85a) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add util

- [`939f940`](https://github.com/bingtsingw/xstools-open/commit/939f9405721833678e0399f9819a36e66dd37317) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add array utilities

- [`9102be0`](https://github.com/bingtsingw/xstools-open/commit/9102be055accad73aa4fa4f9ef5d7e0072bfc062) Thanks [@bingtsingw](https://github.com/bingtsingw)! - remove radash

- [`195adee`](https://github.com/bingtsingw/xstools-open/commit/195adeec3334fb73ea91695d70a7063aa84a91b1) Thanks [@bingtsingw](https://github.com/bingtsingw)! - update export structure

### Patch Changes

- [`f1ffa9e`](https://github.com/bingtsingw/xstools-open/commit/f1ffa9ed27b4d450b6183491e62d449bad116568) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add generator utility tests and update docs

- [`05ff2f8`](https://github.com/bingtsingw/xstools-open/commit/05ff2f8fd203f9dd1d26aad1ee163e0fa6888df6) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add internal utilities

- [`b12dada`](https://github.com/bingtsingw/xstools-open/commit/b12dada7284131c5276e08924f5151d624ebeb6a) Thanks [@bingtsingw](https://github.com/bingtsingw)! - add object utilities

- [`e036844`](https://github.com/bingtsingw/xstools-open/commit/e0368443c54a37de5d1d1d88bc0856614f5b9e9b) Thanks [@bingtsingw](https://github.com/bingtsingw)! - replace valibot with native implement

## 0.17.0

### Minor Changes

- [#5](https://github.com/bingtsingw/xstools-open/pull/5) [`bb9cbb5`](https://github.com/bingtsingw/xstools-open/commit/bb9cbb599b1c9bc8db22cbfe1710956ecef9da13) Thanks [@KenjiGinjo](https://github.com/KenjiGinjo)! - 增加 getDistrict: 根据title address 获取城市区名

## 0.16.1

### Patch Changes

- 使用es6标准的私有属性

## 0.16.0

### Minor Changes

- [`23fe2dc`](https://github.com/bingtsingw/xstools-open/commit/23fe2dcb36ab07d635cfcd960f2465f4c3d8793c) Thanks [@bingtsingw](https://github.com/bingtsingw)! - upgrade valibot

## 0.15.0

### Minor Changes

- [`9c3c4c4`](https://github.com/bingtsingw/xstools-open/commit/9c3c4c4bae9be4b6612433961edd9426ce504ba1) Thanks [@bingtsingw](https://github.com/bingtsingw)! - move to @xstools/radash and change radash export

### Patch Changes

- Updated dependencies [[`9c3c4c4`](https://github.com/bingtsingw/xstools-open/commit/9c3c4c4bae9be4b6612433961edd9426ce504ba1)]:
  - @xstools/radash@0.2.0

## 0.14.0

### Minor Changes

- move to monorepo && upgrade deps

## [0.13.0](https://github.com/bingtsingw/xstools/compare/0.12.3...0.13.0) (2024-04-06)

### Features

- move lodash to @bingtsingw/radash ([d1c6f61](https://github.com/bingtsingw/xstools/commit/d1c6f61db24044854fc15ce1aefc891b642f0528))

### Bug Fixes

- lint error ([7ccbd28](https://github.com/bingtsingw/xstools/commit/7ccbd28de8a7f40aea47c183455e5d6dc9fc4772))

### Chores

- add xstools-dev ([542a251](https://github.com/bingtsingw/xstools/commit/542a251a9d4711f41d60de5c220d6833c188fb00))
- change module type && add return types ([6d78dbe](https://github.com/bingtsingw/xstools/commit/6d78dbeb890b45871e961b83abeefa5703749799))
- update husky config ([5ded317](https://github.com/bingtsingw/xstools/commit/5ded317655af40b5aa3c90b6824d0653f1f0085c))
- upgrade deps ([6351b6b](https://github.com/bingtsingw/xstools/commit/6351b6b2194493d757fbe4c152f835de5857dd9d))

## [0.12.3](https://github.com/bingtsingw/xstools/compare/0.12.2...0.12.3) (2024-03-31)

### Bug Fixes

- skip private property in dts ([ef2fbd7](https://github.com/bingtsingw/xstools/commit/ef2fbd7360700308ef9314630417b556adf97da1))

## [0.12.2](https://github.com/bingtsingw/xstools/compare/0.12.1...0.12.2) (2024-03-02)

### Chores

- rename functions and export types from d.ts ([b74732b](https://github.com/bingtsingw/xstools/commit/b74732b95ad33d00bc1740ba887cd527f81e8c42))

## [0.12.1](https://github.com/bingtsingw/xstools/compare/0.12.0...0.12.1) (2024-02-05)

### Bug Fixes

- forget export ([76c59e0](https://github.com/bingtsingw/xstools/commit/76c59e052e0995d9607af32cfe70dea034df8918))

## [0.12.0](https://github.com/bingtsingw/xstools/compare/0.11.2...0.12.0) (2024-02-05)

### Features

- add getDistance ([08ac433](https://github.com/bingtsingw/xstools/commit/08ac433d3999106b4bc0cb37c3da734bb47c53d0))

### Code Refactoring

- move lang to misc ([721c0a0](https://github.com/bingtsingw/xstools/commit/721c0a0bf24e96e8cf63db5ae041fc28ddc46d95))

## [0.11.2](https://github.com/bingtsingw/xstools/compare/0.11.1...0.11.2) (2023-12-30)

### Chores

- update release-it hooks ([a6d4703](https://github.com/bingtsingw/xstools/commit/a6d47036333c8bfbade6e91bca305ace3b35182f))

## [0.11.1](https://github.com/bingtsingw/xstools/compare/0.11.0...0.11.1) (2023-12-30)

### Chores

- add release-it hooks ([f32c6f1](https://github.com/bingtsingw/xstools/commit/f32c6f117b0a430fbae9d122e1038d615cf9ea65))

## [0.11.0](https://github.com/bingtsingw/xstools/compare/0.10.1...0.11.0) (2023-12-30)

### Features

- add format/starlize and format test ([e3853ce](https://github.com/bingtsingw/xstools/commit/e3853ce4d8e6beaea9dab65f615505f4a3d75293))

### Chores

- replace bun-types with @types/bun ([d3aa1ba](https://github.com/bingtsingw/xstools/commit/d3aa1ba4f4e14d28ddc233486d5e766521c8f379))
- upgrade deps ([484bf7d](https://github.com/bingtsingw/xstools/commit/484bf7d59064b8687043f083b71b8723df9029e3))

## [0.10.1](https://github.com/bingtsingw/xstools/compare/0.10.0...0.10.1) (2023-12-02)

### Code Refactoring

- migrate dayjs to date-fns ([b640bbd](https://github.com/bingtsingw/xstools/commit/b640bbd260e46183bdb14a3ff839e9a0eaff36af))

## [0.10.0](https://github.com/bingtsingw/xstools/compare/0.9.0...0.10.0) (2023-12-02)

### Features

- add fns-tz ([9951b3b](https://github.com/bingtsingw/xstools/commit/9951b3b38d55c55782cf6e673b53d6bf62283e5e))

### Documentation

- add readme ([6fa6608](https://github.com/bingtsingw/xstools/commit/6fa66084b83c4fe3c548eb837c06e60490b92251))

### Chores

- update package.json ([be5c2b0](https://github.com/bingtsingw/xstools/commit/be5c2b0ef008dfbc043372bdfd86c2b90272f930))
- upgrade deps ([b524097](https://github.com/bingtsingw/xstools/commit/b524097d83c76f784c64b740fd972180fb8cecf1))

## [0.9.0](https://github.com/bingtsingw/xstools/compare/0.8.0...0.9.0) (2023-10-06)

### Features

- add datetime.cnWeekDay and refactor module name ([cd0af6c](https://github.com/bingtsingw/xstools/commit/cd0af6c5a4d18f1a26db627a80a7ef1799f2e265))

### Tests

- add overlap.spec ([539bc5a](https://github.com/bingtsingw/xstools/commit/539bc5af93d0f35449d7d7f2dfc66d9e8832541a))

## [0.8.0](https://github.com/bingtsingw/xstools/compare/0.7.1...0.8.0) (2023-09-23)

### Features

- add lang.stringify function ([99189fe](https://github.com/bingtsingw/xstools/commit/99189fed00ebd32861b716a4fc743374c3478826))

### Chores

- bun support ([f8652b8](https://github.com/bingtsingw/xstools/commit/f8652b831cf7a428329bd37bafb7e39e733befb7))

## [0.7.1](https://github.com/bingtsingw/xstools/compare/0.7.0...0.7.1) (2023-08-30)

### Bug Fixes

- update format.currency ([fee1f26](https://github.com/bingtsingw/xstools/commit/fee1f26a60d7ee5499a9c141b2b8566dddde65c6))

## [0.7.0](https://github.com/bingtsingw/xstools/compare/0.6.0...0.7.0) (2023-08-24)

### Features

- add format.currency function ([4d87324](https://github.com/bingtsingw/xstools/commit/4d87324f8f1123bf3ce5b0a498f1366515498996))

## [0.6.0](https://github.com/bingtsingw/xstools/compare/0.5.2...0.6.0) (2023-07-24)

### Features

- add datetime util ([1a68f8c](https://github.com/bingtsingw/xstools/commit/1a68f8c579245a27af91fd610d700f6da4178fbe))

## [0.5.2](https://github.com/bingtsingw/xstools/compare/0.5.1...0.5.2) (2023-07-18)

### Bug Fixes

- remove captureStackTrace ([aa95024](https://github.com/bingtsingw/xstools/commit/aa950244d800ab7a55e27eca7bf9db56221edc0b))

## [0.5.1](https://github.com/bingtsingw/xstools/compare/0.5.0...0.5.1) (2023-07-18)

### Chores

- update scripts ([43f5375](https://github.com/bingtsingw/xstools/commit/43f5375ceef2274d9bfa61629df5bc6ca78c48b4))

## [0.5.0](https://github.com/bingtsingw/xstools/compare/0.4.2...0.5.0) (2023-07-18)

### Features

- add util sleep function ([e56edb3](https://github.com/bingtsingw/xstools/commit/e56edb3297af8d22854d4a22b36056f469286442))

## [0.4.2](https://github.com/bingtsingw/xstools/compare/0.4.1...0.4.2) (2023-07-18)

### Bug Fixes

- guard Error.captureStackTrace ([34a6d4a](https://github.com/bingtsingw/xstools/commit/34a6d4a6ba00416be5a325f41b5e68bad7a86221))

## [0.4.1](https://github.com/bingtsingw/xstools/compare/0.4.0...0.4.1) (2023-07-06)

### Bug Fixes

- exceptions support null message ([31f101b](https://github.com/bingtsingw/xstools/commit/31f101b0f273ae9dfd438ebe9ba3cda4060637eb))

## [0.4.0](https://github.com/bingtsingw/xstools/compare/0.3.3...0.4.0) (2023-07-02)

### Features

- add exception code ([9acfbca](https://github.com/bingtsingw/xstools/commit/9acfbca91e5d95fdab08292019ca12d2b2786a0d))

## [0.3.3](https://github.com/bingtsingw/xstools/compare/0.3.2...0.3.3) (2023-06-30)

### Bug Fixes

- exception accept optional messages ([ca995f4](https://github.com/bingtsingw/xstools/commit/ca995f42d2a4c90f17451a2a5825c74e66fccb3e))

## [0.3.2](https://github.com/bingtsingw/xstools/compare/0.3.1...0.3.2) (2023-06-30)

### Bug Fixes

- update exception signature ([e5014cc](https://github.com/bingtsingw/xstools/commit/e5014cc8df013a6732ffacae58bebd9fc56fde4f))

## [0.3.1](https://github.com/bingtsingw/xstools/compare/0.3.0...0.3.1) (2023-06-28)

### Bug Fixes

- declared but never read ([92e4a9f](https://github.com/bingtsingw/xstools/commit/92e4a9fd106da7b951fff2e9428c745f0b7d49c5))

## [0.3.0](https://github.com/bingtsingw/xstools/compare/0.2.3...0.3.0) (2023-06-28)

### Features

- update exceptions ([4f250da](https://github.com/bingtsingw/xstools/commit/4f250dae0766749afe912d8c7036736a3be61d61))

## [0.2.3](https://github.com/bingtsingw/xstools/compare/0.2.1...0.2.3) (2023-06-21)

### Build System

- default to cjs ([695fa62](https://github.com/bingtsingw/xstools/commit/695fa6243bc23b81f9e650c68dd7d7f5e5e114a3))

## [0.2.1](https://github.com/bingtsingw/xstools/compare/0.2.0...0.2.1) (2023-06-20)

### Bug Fixes

- export exception.BaseException ([03164b7](https://github.com/bingtsingw/xstools/commit/03164b7a4fc6665343dd6733419f505a004106b1))

## [0.2.0](https://github.com/bingtsingw/xstools/compare/0.1.4...0.2.0) (2023-06-20)

### Features

- add exceptions ([efbf071](https://github.com/bingtsingw/xstools/commit/efbf071b7739a7cb1a472d7f2550037f5c8bdc70))

## [0.1.4](https://github.com/bingtsingw/xstools/compare/0.1.3...0.1.4) (2023-06-19)

### Build System

- add types field ([7939e8f](https://github.com/bingtsingw/xstools/commit/7939e8fc86f39f762b52c7d0148a56dd49db61c2))

## [0.1.3](https://github.com/bingtsingw/xstools/compare/0.1.1...0.1.3) (2023-06-19)

### Build System

- optimize release process ([ff2fc77](https://github.com/bingtsingw/xstools/commit/ff2fc77baa8ebb71504ea3c16240769df6d7862d))
- update publish related config ([24fc6ef](https://github.com/bingtsingw/xstools/commit/24fc6ef222ef0f9f5795c25cd007fab99d162773))

## [0.1.1](https://github.com/bingtsingw/xstools/compare/0.1.0...0.1.1) (2023-06-19)

### Chores

- update npmrc ([ce61726](https://github.com/bingtsingw/xstools/commit/ce61726ef03c6556034ef8a38a112a018bf48caa))

### Build System

- add module type and exports ([c51eb30](https://github.com/bingtsingw/xstools/commit/c51eb30a75d9aed4b507b160455a4f35b29a6f1d))

## 0.1.0 (2023-06-19)

### Features

- init ([2a5ef31](https://github.com/bingtsingw/xstools/commit/2a5ef31580f2d0bc457f27db0c1c8d1a6196cc63))
- migrate utils ([2c0b83c](https://github.com/bingtsingw/xstools/commit/2c0b83c16d726308ee8a09263926a6ce2f542a7a))

### Chores

- add release test build support ([aa3c30f](https://github.com/bingtsingw/xstools/commit/aa3c30fa7c7bcec00a280f5236907a9f85af64a9))
