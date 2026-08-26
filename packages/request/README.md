# @xstools/request

基于 Axios 的轻量请求实例工厂，提供统一的错误类型、可选的 PATCH 方法伪装和 Bearer Token 注入。

## 安装

```sh
pnpm add @xstools/request
```

## 基础用法

```ts
import { createInstance } from '@xstools/request';

const request = createInstance({
  baseURL: 'https://api.example.com',
  headers: { Accept: 'application/json' },
});

const response = await request.get<{ id: string }>('/users/me');

response.status;
response.headers;
response.data.id;
```

## 从 1.x 迁移

2.0 起，请求成功时返回完整的 `AxiosResponse`，不再自动解包 `data`：

```ts
// 1.x
const user = await request.get<User>('/users/me');
user.id;

// 2.0
const response = await request.get<User>('/users/me');
response.data.id;
```

## 鉴权请求

`tokenProvider` 会在每次请求前执行，并始终覆盖实例或单次请求中已有的 `Authorization` 请求头。

```ts
import { createRequest } from '@xstools/request';

const request = createRequest({
  baseURL: 'https://api.example.com',
  tokenProvider: async () => getAccessToken(),
});
```

## PATCH 兼容模式

默认保留原生 `PATCH`。仅在兼容环境无法使用 PATCH 时开启 `methodSpoofing`；此时请求会转为 `POST`，并添加 `_method=patch` 与 `X-HTTP-Method-Override: patch`。

```ts
const request = createInstance({
  baseURL: 'https://api.example.com',
  methodSpoofing: true,
});
```

## 错误处理

```ts
import { CanceledError, NetworkError, ResponseError, TimeoutError } from '@xstools/request';

try {
  await request.get('/users/me');
} catch (error) {
  if (ResponseError.is(error)) {
    console.error(error.status, error.code, error.response);
  } else if (TimeoutError.is(error)) {
    console.error('请求超时');
  } else if (CanceledError.is(error)) {
    console.error('请求已取消');
  } else if (NetworkError.is(error)) {
    console.error('网络连接失败');
  }
}
```

HTTP 响应失败会抛出 `ResponseError`，取消请求抛出 `CanceledError`，超时抛出 `TimeoutError`，其余无响应的 Axios 请求失败抛出 `NetworkError`。非 Axios 异常会原样抛出。
