# @xstools/polyfill

按需安装 JavaScript 运行时缺失的 Web 与 ECMAScript API。每个子路径都是独立的副作用入口：导入后立即检测并安装对应 polyfill；宿主已经提供原生实现时不会覆盖它。

```sh
pnpm add @xstools/polyfill
```

## 使用方式

只导入应用需要兼容的 API：

```ts
import '@xstools/polyfill/object-has-own';
import '@xstools/polyfill/mini-abort-controller';
```

包没有根入口，必须通过子路径导入。这样不会意外安装不需要的全局 API。

### `object-has-own`

为不支持 `Object.hasOwn` 的运行时安装与原生方法等价的自有属性判断：

```ts
import '@xstools/polyfill/object-has-own';

Object.hasOwn({ value: 1 }, 'value'); // true
```

### `mini-abort-controller`

为同时缺少 `AbortController` 和 `AbortSignal` 的运行时安装面向微信小程序请求封装的最小 fallback。它支持 `abort()`、`signal.aborted`、`signal.reason`、`onabort`、`addEventListener` / `removeEventListener`、`{ once: true }` 和 `throwIfAborted()`。

```ts
import '@xstools/polyfill/mini-abort-controller';

const controller = new AbortController();
controller.signal.addEventListener('abort', () => {
  console.log(controller.signal.reason);
});
controller.abort('cancelled');
```

该 fallback 不实现 `AbortSignal.abort()`、`AbortSignal.timeout()`、`AbortSignal.any()` 或完整的 `EventTarget` API。未来完整的浏览器 polyfill 将通过 `@xstools/polyfill/abort-controller` 提供；两个入口不能同时导入，因为它们都会安装全局 `AbortController`。
