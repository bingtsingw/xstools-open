# @xstools/radash

## 0.2.0

### Minor Changes

- [`9c3c4c4`](https://github.com/bingtsingw/xstools-open/commit/9c3c4c4bae9be4b6612433961edd9426ce504ba1) Thanks [@bingtsingw](https://github.com/bingtsingw)! - move to @xstools/radash

## [0.1.1](https://github.com/bingtsingw/radash/compare/0.1.0...0.1.1) (2024-04-05)


### Code Refactoring

* update typed.ts ([294d90d](https://github.com/bingtsingw/radash/commit/294d90d251646a360962c0f58fe2687dad4bec7c))


### Continuous Integration

* update ci ([a675281](https://github.com/bingtsingw/radash/commit/a675281353fa4fd2f94cd732989e84304ce03663))


### Chores

* remove unused files ([1e1225c](https://github.com/bingtsingw/radash/commit/1e1225c190275d9e2f4bf0810aab4b38f2071cab))
* upgrade xstools-dev ([b14402d](https://github.com/bingtsingw/radash/commit/b14402d15324b27e4f0bd6a0ac46e943468ddca7))

## 0.1.0 (2024-04-05)


### Features

* add all function to the async module ([#305](https://github.com/bingtsingw/radash/issues/305)) ([d5fc623](https://github.com/bingtsingw/radash/commit/d5fc6235671d62f6cadfa597fe6a352b650c9111))
* add type guards ([#103](https://github.com/bingtsingw/radash/issues/103)) ([7a8a959](https://github.com/bingtsingw/radash/commit/7a8a9593350020493aab1b762bdb9b431efa0932))
* **async:** add index argument to `reduce` callback ([#291](https://github.com/bingtsingw/radash/issues/291)) ([f722205](https://github.com/bingtsingw/radash/commit/f722205a5af99c13efc43119481d966a4ed3c9d5))
* **curry:** add isPending method to debounce function ([#294](https://github.com/bingtsingw/radash/issues/294)) ([44e9bb8](https://github.com/bingtsingw/radash/commit/44e9bb87d4a61cbab5479ad2e23b6cb3c4016436))
* **curry:** add isThrottled method to throttle ([#293](https://github.com/bingtsingw/radash/issues/293)) ([34e6e03](https://github.com/bingtsingw/radash/commit/34e6e032a680d8bb4dc6fec2f113a74a30f762f8))
* support sync calls in tryit function ([#312](https://github.com/bingtsingw/radash/issues/312)) ([1817ace](https://github.com/bingtsingw/radash/commit/1817ace33d7dd59cb251d8288c37286fef6f8f9a))
* use built-in Array.isArray for isArray ([#285](https://github.com/bingtsingw/radash/issues/285)) ([ef1a730](https://github.com/bingtsingw/radash/commit/ef1a730c2ec19f1b8bcb175169abcec6006b1592))


### Bug Fixes

* address pick issue when key not in object ([#112](https://github.com/bingtsingw/radash/issues/112)) ([dc7b2cc](https://github.com/bingtsingw/radash/commit/dc7b2cceba591b47ba79bcfd6b8c4a3321de267b))
* defer function rethrowing undefined ([#270](https://github.com/bingtsingw/radash/issues/270)) ([31c1397](https://github.com/bingtsingw/radash/commit/31c1397437d7fb7a78e97499c8d46f992c49844c))
* diff function when root is [] ([#111](https://github.com/bingtsingw/radash/issues/111)) ([282ca62](https://github.com/bingtsingw/radash/commit/282ca62bc56f1487fa89b32bd5bc3e1e37991829))
* fix typo in object.assign docs ([#328](https://github.com/bingtsingw/radash/issues/328)) ([b41291b](https://github.com/bingtsingw/radash/commit/b41291b9b06ccf52340ccd90413e8eab94668dce))
* Improve type inference for `chain` function ([#370](https://github.com/bingtsingw/radash/issues/370)) ([caf1a86](https://github.com/bingtsingw/radash/commit/caf1a866e5b30fc977bcdc81db1b3bf71f042bd0))
* move types to be first entry in package.json exports ([#227](https://github.com/bingtsingw/radash/issues/227)) ([618cae2](https://github.com/bingtsingw/radash/commit/618cae2c67b099989f8c6a896de89c218d450f4e))
* **object:** fixed `pick` not working when target object is proxied or has custom `hasOwnProperty` ([#295](https://github.com/bingtsingw/radash/issues/295)) ([b97e47d](https://github.com/bingtsingw/radash/commit/b97e47d2ed19dbf395c5c00f36726d62f79fd93b))
* replace escape condition on falsy values ([#309](https://github.com/bingtsingw/radash/issues/309)) ([28f8114](https://github.com/bingtsingw/radash/commit/28f8114c14d4638a3aeb6095fff5cc3826eb2038))
* Replace zues > zeus in README.md ([#89](https://github.com/bingtsingw/radash/issues/89)) ([57c94e3](https://github.com/bingtsingw/radash/commit/57c94e31ccb8dbb590966af9aecaf8f0ea0ea5e7))
* split number from letters in snake func ([#311](https://github.com/bingtsingw/radash/issues/311)) ([c378bd1](https://github.com/bingtsingw/radash/commit/c378bd1bc401045ed7d8e5e47b275d2159ce43d5))
* typo ([#59](https://github.com/bingtsingw/radash/issues/59)) ([4410892](https://github.com/bingtsingw/radash/commit/44108924b1d553d58ee7fc527f398f8755656de2))


### Documentation

* add docs for async.all function ([#307](https://github.com/bingtsingw/radash/issues/307)) ([b749277](https://github.com/bingtsingw/radash/commit/b74927744f631903853c917b6424d68c5f56eccc))
* add docs for new functions in v11.0.0 ([#313](https://github.com/bingtsingw/radash/issues/313)) ([f791dcf](https://github.com/bingtsingw/radash/commit/f791dcf5de7123e89721851f4ae10ae59a18465c))
* add links between sort and alphabetical ([#301](https://github.com/bingtsingw/radash/issues/301)) ([23db98d](https://github.com/bingtsingw/radash/commit/23db98d124a3ed9b766fcf4aeced7f70cfcc8c0b))
* added warning about default TTL in memo ([#260](https://github.com/bingtsingw/radash/issues/260)) ([82fea7a](https://github.com/bingtsingw/radash/commit/82fea7a65f7652fab390fd403bf958adad5126e9))
* fix typo in trim documentation ([#302](https://github.com/bingtsingw/radash/issues/302)) ([b50d64a](https://github.com/bingtsingw/radash/commit/b50d64a7abb54bd16b68ea022ba1e5629daab113))
* fix typos in tryit.mdx ([#297](https://github.com/bingtsingw/radash/issues/297)) ([21f0b9a](https://github.com/bingtsingw/radash/commit/21f0b9a457a1c09d9abb756a9a93c7d565bd0dd1))
* mention that unique does not preserve order ([#374](https://github.com/bingtsingw/radash/issues/374)) ([342924b](https://github.com/bingtsingw/radash/commit/342924bcb2777e8ce0f168bd3c106b38808e80e1))
* remove deprecated zip doc page ([#235](https://github.com/bingtsingw/radash/issues/235)) ([40b2059](https://github.com/bingtsingw/radash/commit/40b205917b628dc504e3f9ab761602edcbe2f402))
* updated get func doc to show more examples ([#275](https://github.com/bingtsingw/radash/issues/275)) ([9a95643](https://github.com/bingtsingw/radash/commit/9a95643ee43793b5f461347560d2d436e22dd863))


### Styles

* format text ([043c9e9](https://github.com/bingtsingw/radash/commit/043c9e9160392aac34dfbdec95268ca121352a74))


### Chores

* add front-end engineering ([2d20e0d](https://github.com/bingtsingw/radash/commit/2d20e0d9cc933d45a1e5e4c704cc1b738e52a530))
* add release-it support ([a4027f4](https://github.com/bingtsingw/radash/commit/a4027f4252903203e0c387873786ae02cbfbc263))
* add typecheck ([7472ba4](https://github.com/bingtsingw/radash/commit/7472ba484d5e159aacaed83c1cde34bbce9d40c8))
* lint and format js ([63b43cb](https://github.com/bingtsingw/radash/commit/63b43cbc0e592696461392cf4a4f60ab1c7c3ab1))
* move to pnpm and bun ([5541a41](https://github.com/bingtsingw/radash/commit/5541a418f53d755b773930eebfed635235ee4809))
* remove cdn ([019ce6c](https://github.com/bingtsingw/radash/commit/019ce6cd0597c6acf30f360b0e6e6660c62bccff))
* update license ([8815d1c](https://github.com/bingtsingw/radash/commit/8815d1ca86ede882175e6f3199c163cdfcd82ec5))
* update package info ([ad20c5e](https://github.com/bingtsingw/radash/commit/ad20c5e6c28420eebc524798d21c0ceedc92f675))
