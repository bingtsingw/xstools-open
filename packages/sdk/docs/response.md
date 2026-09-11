## Alicloud

阿里云的响应结合了错误码和HTTP状态两种模式，部分请求会返回`4xx`表示错误，部分请求又会返回`2xx`然后在`body`中包含错误信息，`isErrorAlicloudCode`对各种错误形态都做了处理。

## DingTalk

钉钉的响应是错误码模式，`HTTP` 永远返回 `200 OK`，在返回的 `body` 中包含错误码和错误信息：

```ts
// `0 ok` 代表接口无错误，其他均代码接口返回有错误
{
  errcode: 0,
  errmsg: 'ok',
}
```

## Xcloud

Xcloud 使用 HTTP 状态表示请求是否成功，`2xx` 表示请求正常，返回正常数据；`4xx` 或 `5xx` 表示请求失败，返回错误信息。

```ts
{
  data: {
    // 上游业务数据
  },
}
```
