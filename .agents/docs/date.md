# date

时间相关自实现 API（`@xstools/utility/date`）。以 `date-fns` 为底库时，UTC / 固定 offset 上下文见 `@xstools/utility/date-fns`。

## 选型（date-fns）

- 纯 TS、类 Lodash 纯函数、易扩展
- 缺失能力在本包补充：`utc` / `ot`、通用 `parseOffset` 等

## `./date` API

| 符号 | 说明 |
| --- | --- |
| `cnWeekDay` | ISO 日期 → 中文「周x」 |
| `parseOffset` | `±HH` / `±HHMM` / `±HH:MM` → 分钟；非法 / IANA → `ParamError` |
| `getTimezoneOffset` | 读系统 `Date#getTimezoneOffset`，格式 `+08:00`；是否可信由调用方判断 |

```ts
import { parseOffset, getTimezoneOffset } from '@xstools/utility/date';
import { ot, startOfDay } from '@xstools/utility/date-fns';

parseOffset('+08:00'); // => 480
startOfDay(date, { in: ot('+08:00') });
```

## `./date-fns` 中的自研上下文

| 组件 | 说明 |
| --- | --- |
| `UTCDateMini` / `utc` | UTC；get/set → UTC 方法 |
| `OTDateMini` / `ot` | 仅固定 offset；内部用 `parseOffset` |
| `extends` | `areIntervalsOverlap(s)` 等 |

实现只依赖 `Date.UTC` / UTC get-set / `getTime`/`setTime`，不依赖 Intl / IANA。

## 进度

| 项 | 状态 |
| --- | --- |
| `UTCDateMini` / `utc` | ✅ |
| `OTDateMini` / `ot` | ✅ |
| `cnWeekDay` / `parseOffset` / `getTimezoneOffset`（`./date`） | ✅ |
| `./datetime` → `./date` | ✅ |
| `extends` 区间重叠 | ✅ |
| `addVipDays` 重做 | ⏳ Phase 5 |
