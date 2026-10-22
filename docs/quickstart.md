# Your first Mindbox map / 第一张 Mindbox 脑图

[在线体验与 16 套样式](https://markingyang.github.io/mindbox/) · [安装兼容说明](installation.md) · [编辑说明](html-editing.md)

## 1. Install / 安装

需要 Node.js 22.20+ 和能运行本地 Skill 的 AI 助手。在终端运行，按提示选择你的助手：

```bash
npx skills add MarkingYang/mindbox -g
```

This installs from the default branch. Select your assistant when prompted, then open a new assistant session. For a pinned release, manual ZIP, or WorkBuddy / Doubao Work setup, see [installation](installation.md). Viewing a generated map only needs a browser.

## 2. Give it something concrete / 给一份具体材料

把下面这段发给助手即可，不需要先准备长文档：

> 用 Mindbox 整理下面的周末计划，选一套适合生活规划的样式，生成可编辑、可离线打开的 HTML：
>
> 这个周末想做三件事。读书：读完第二章，记下三个问题。运动：周六走路半小时，下雨就在家拉伸。下周准备：列出周一最重要的三件事，提前整理要用的资料。

English example:

> Use Mindbox to map my weekend plan. Choose a suitable style and deliver editable, standalone HTML. Reading: finish chapter two and note three questions. Exercise: walk for 30 minutes on Saturday, or stretch at home if it rains. Prepare for next week: choose Monday's three priorities and gather the materials.

明确点名 Mindbox；Codex 也可用 `$mindbox`。资料读取和理解由现有助手完成，Mindbox 负责脑图布局、样式和交互。

## 3. Open and edit / 打开并修改

打开助手交付的 HTML：

- 点击节点旁的按钮，折叠或展开分支。
- 双击节点改字；选中节点后，Tab 加子节点，Enter 加同级。
- 点击“保存 HTML”，下载含最新修改的文件。

The result is one portable file with embedded fonts and code. Browser edits do not silently overwrite your original file.

## 4. Continue the conversation / 接着让 AI 改

> 保留内容，换成「浮生小趣」。

> 在“下周准备”下面补上“周日晚上检查日历”，其他分支保持不变。

如果在浏览器里改过字，先保存，再把**最新 HTML**交给助手。不要交旧 Markdown，它只是生成时的快照。

After browser edits, save and attach the latest HTML before asking the assistant to revise it. Continue the same topic in the same file, or explicitly ask to save a separate version.

## 5. Share / 分享

把保存后的 HTML 发给别人，对方用浏览器打开即可。也可在脑图内按需导出 PNG 或 WebP；WebP 编码取决于浏览器支持。

Mindbox 适合笔记、计划与想法的层级整理。精确时序和跨节点关系图请选相应工具。模型和文档权限由你使用的助手提供。

## 6. Manage Mindbox / 安装之后

| 操作 / Action | 全局命令 / Global command |
| --- | --- |
| 查看安装 / List | `npx skills list -g` |
| 更新或升级 / Update | `npx skills update mindbox -g` |
| 卸载 / Remove | `npx skills remove mindbox -g` |
| 重新安装 / Reinstall | `npx skills add MarkingYang/mindbox -g` |

更新后开启新助手会话。卸载保留生成的 HTML。项目范围、只读检查版本、固定版本和额外适配清理见[完整安装命令](installation.md#skill-commands)与[版本管理](versioning.md)。
