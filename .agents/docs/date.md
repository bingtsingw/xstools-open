# date

时间相关自实现 API（`@xstools/utility/date`）。以 `date-fns` 为底库时，UTC / 固定 offset 上下文见 `@xstools/utility/date-fns`。

## 选型（date-fns）

- 纯 TS、类 Lodash 纯函数、易扩展
- 缺失能力在本包补充：`utc` / `ot`、通用 `parseOffset` 等

## `./date` API

| 符号 | 说明 |
| --- | --- |
| `parseOffset` | `±HH` / `±HHMM` / `±HH:MM` → 分钟；非法 / IANA → `ParamError` |
| `parseStrictISOString` / `toEpoch` | 强制瞬时 ISO（须含 `Z`/offset）→ epoch；不校验日历分量（滚动行为同 `Date.parse`） |
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
| `UTCDateMini` / `utc` | UTC；仅 `[]` / 单值（timestamp/`Date`/严格 ISO）；无组件构造 |
| `OTDateMini` / `ot` | 仅固定 offset；构造为 `[offset]` 或 `[value, offset]`；无组件构造；`internal` / `offsetMinutes` 为实现细节，勿依赖 |
| `extends` | `areIntervalsOverlap(s)` 等 |

### 与「系统时区」的边界

自研 Mini **计算路径**（构造解析、`get*` / `set*` 墙钟分量、`getTimezoneOffset` / `setTime`、喂给 date-fns `{ in }`）只依赖 `Date.UTC` / UTC get-set / `getTime`/`setTime`，**不**依赖 Intl / IANA。

仍可能碰到宿主时区的情况（已知折中，勿写进「完全无关」）：

| 场景 | 行为 |
| --- | --- |
| Mini 未覆盖的原生 formatter（`toString` / `toDateString` / `toLocale*` 等） | 仍按 **宿主** TZ 格式化 |
| `./date` 的 `getTimezoneOffset()` | **有意**读系统偏移 |
| `addVipDays` 的「当前时刻」 | `new Date()`（瞬时本身无 TZ；展示另说） |
| `cnWeekDay`（`./business`） | 按 **UTC 日历日** 取周几，与宿主无关 |
