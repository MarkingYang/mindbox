# 中英八字体选型

核查日期：2026-10-20。目标是知识工作者的思维导图，选择可离线嵌入的字体，并以三款常用方向加一款趣味字体覆盖每种语言。

## 结论与口径

没有取得可核实的小红书、Notion、Xmind 跨平台字体使用率排名；Google Fonts Analytics 本次无法读取。因此不将以下选择称为“全网前三”。社区星标只能反映项目关注度，不能当作实际用户数、使用率或平台排名。选择综合官方产品字体分类、社区关注、阅读用途、风格差异与字库许可。

| 语言 | 代号 | 字体 | 角色 | 选择理由 |
| --- | --- | --- | --- | --- |
| 中文 | T06 | Noto Sans SC | 常用 · 通用黑体 | 清晰正文与商务资料；与宋体形成明显区分 |
| 中文 | T05 | Noto Serif SC | 常用 · 阅读宋体 | 适合书籍、长文、优雅阅读 |
| 中文 | T09 | 霞鹜文楷 | 常用 · 人文手写 | 文楷主仓库 26,366 星；书写感兼顾清晰度；嵌入版本为 LXGW WenKai TC |
| 中文 | T08 | 站酷快乐体 | 趣味 · 圆润标题 | 选择其明确的活泼形态，适合短标签；不声称热度排名 |
| 英文 | T10 | Inter | 常用 · 商务无衬线 | 官方定位于界面等多种应用；公开仓库 19,986 星 |
| 英文 | T11 | Lora | 常用 · 阅读衬线 | 提供与 Inter 明显不同的阅读气质；按衬线用途选入，不声称排名前三 |
| 英文 | T12 | JetBrains Mono | 常用 · 代码等宽 | 官方面向开发者设计；公开仓库 13,101 星，适配代码知识整理 |
| 英文 | T13 | Excalifont | 趣味 · 手绘白板 | Excalidraw 官方常量文档列为默认手绘字体；直接嵌入其拉丁字库 |

## 官方证据

- [Notion 页面字体](https://www.notion.com/help/customize-and-style-your-content)：Default / Serif / Mono 三种分类。这里借鉴分类思路，不声称 Inter、Lora、JetBrains Mono 是 Notion 使用的字体。
- [Excalidraw 字体常量](https://github.com/excalidraw/excalidraw/blob/master/dev-docs/docs/@excalidraw/excalidraw/api/constants.mdx)：Excalifont 为手绘默认字体。
- [Xmind Global Font](https://xmind.com/user-guide/global-font-new)：全图统一字体与 CJK 支持。
- [Inter 官方](https://rsms.me/inter/)：字体用途与可读性设计。
- [JetBrains Mono 官方](https://www.jetbrains.com/lp/mono/)：开发者等宽字体。
- [Noto CJK 官方](https://github.com/notofonts/noto-cjk)：Sans / Serif 字体系列。
- [霞鹜文楷官方](https://github.com/lxgw/LxgwWenKai)、[站酷快乐体官方](https://github.com/googlefonts/zcool-kuaile)。
- [Lora 源仓库](https://github.com/cyrealtype/Lora-Cyrillic)。

repositorySignals 的原始核查值见 references/font-evidence.json。Lora 仓库 502 星、Noto CJK 4,101 星、站酷快乐体 25 星也原样记录；没有只挑有利数据来构造统一排名。

## 展示与兼容

独立字体墙已移除，字体名称直接标在八张导图范例下方。四张中文、四张英文，范例采用对应语言以展示真实字形。正式内容不翻译或替换。切换英文字体时，中文由配套中文字体补充，无法将英文字库本身当成中文字库。

四款中文为常用字子集，英文覆盖基础拉丁及其所用扩展；未覆盖字符由系统补充。字体与 OFL 许可随 HTML 内嵌，无字体 CDN 运行依赖。旧字体代号仍用于兼容导入，不出现在八项精选之外。
