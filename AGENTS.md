# AGENTS

本仓库的 Agent 约定入口。改 `@xstools/utility` 前先读对应规则。  
其它包暂无专项规则；无对应规则时按本仓库既有代码风格。

## 顶级索引

| 类型 | 目录             | 含义                                       |
| ---- | ---------------- | ------------------------------------------ |
| 规则 | `.agents/rules/` | 已拍板，必须遵守                           |
| 文档 | `.agents/docs/`  | 架构与参考，按需阅读                       |
| 规划 | `.agents/memos/` | 进行中备忘，**不是**强制规范，无需具体索引 |

## 具体索引

### 规则 `.agents/rules/`

| 场景                     | 文件                       |
| ------------------------ | -------------------------- |
| 包发布、子路径、三方依赖 | `.agents/rules/package.md` |
| 编码风格                 | `.agents/rules/code.md`    |

### 文档 `.agents/docs/`

| 场景              | 文件                                           |
| ----------------- | ---------------------------------------------- |
| utility 架构总览  | `.agents/docs/architecture.md`                 |
| 时间 / date 域    | `.agents/docs/date.md`                         |
| object merge 对照 | `.agents/docs/merge.md`（交互页 `merge.html`） |

## 硬性要求

- 改代码前：先查「具体索引」里相关规则；涉及架构时再读对应 `docs`
- 代码改动后，如果有需要，则更新`.agents/docs/`下的文档
- `.agents/memos/` 仅作讨论备忘，不会提交到`git`，也不要当强制规范执行
