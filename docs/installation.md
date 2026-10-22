# Install Mindbox / 安装 Mindbox

## Requirements

- Node.js **22.20+** for the Skills CLI and renderer. Check with `node --version`.
- An assistant with local Skill discovery and permission to run Node.js. The assistant supplies document access and the model.
- A modern browser for generated HTML. No Node.js, server or Mindbox installation is needed to view a result. PNG/WebP export requires browser canvas support; animated WebP needs WebP encoding.

## Recommended: standard Skills CLI

```bash
npx skills add MarkingYang/mindbox -g
```

Choose your assistant when prompted, then start a new session. This follows the public repository's default branch. [First map walkthrough →](quickstart.md)

### Unified installer: multiple hosts and extra adapters

```bash
npx --yes --package=github:MarkingYang/mindbox mindbox-install
```

This npx entry uses the pinned Skills CLI to install five native targets, then links WorkBuddy to the same shared source. Doubao Work can discover the shared directory. No host-selection prompts or manual copying are needed. It installs Mindbox only, not the assistants themselves. The entry installs globally across projects. For a single host or a project installation, use Skills CLI directly (omit `-g` for a project):

```bash
npx skills add MarkingYang/mindbox --skill mindbox --agent codex -g
npx skills add MarkingYang/mindbox --skill mindbox --agent claude-code -g
```

The optional adapter can also pin both installer and Skill (standard Skills CLI pins are below):

```bash
npx --yes --package=github:MarkingYang/mindbox#v1.0.3 mindbox-install --tag v1.0.3
```

The unpinned command follows the default branch. No build step, npm dependencies or API key is required to run the installed renderer. This is a Skill for an existing assistant; it does not install an independent Agent or MCP server. [Public installation verification](https://github.com/MarkingYang/mindbox/releases/download/v1.0.3/installation-verification.json)

## Assistant compatibility

| Assistant | Installation route | Verification scope |
| --- | --- | --- |
| Codex | Skills CLI target `codex`; global `~/.agents/skills/` | Installer and renderer checks |
| Claude Code | Target `claude-code`; `~/.claude/skills/` | Installer and renderer checks |
| Cursor | Target `cursor`; shared `~/.agents/skills/` (also supported by Cursor) | Installer and renderer checks |
| OpenClaw | Target `openclaw`; `~/.openclaw/skills/` (or CLI-detected legacy directory) | Installer and renderer checks |
| CodeBuddy | Target `codebuddy`; `~/.codebuddy/skills/` | Installer and renderer checks |
| WorkBuddy | Mindbox installer links `~/.workbuddy/skills/mindbox` (respects `WORKBUDDY_CONFIG_DIR`) to the shared Skill | Shared link; local desktop UI showed Mindbox as installed |
| Doubao Work / 豆包工作 | Discovers `~/.agents/skills/mindbox` from the shared installation | Local desktop UI found Mindbox after refresh; not a native CLI target |

Do not pass `--agent workbuddy` or `--agent doubao`: these names are not registered in the tested Skills CLI. The Mindbox npx entry supplies the WorkBuddy adapter; the upstream CLI alone does not. Do not invent a `~/.doubao/skills` directory. The ordinary Doubao chat app/webpage is not a local Skill runtime. For Doubao Work, open the local Skill list and verify discovery before claiming installation success; Node execution permission and access to the Skill directory are also required.

These checks validate package placement, resource integrity and actual rendering through each installed path, not a model-driven task in every assistant.

Primary references: [Cursor Skill directories](https://cursor.com/docs/skills), [Skills CLI host matrix](https://github.com/vercel-labs/skills/blob/main/docs/agents.md), [WorkBuddy configuration compatibility](https://www.codebuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Project). Local Doubao Work discovery was verified after installation into the shared directory. Other versions may differ; the upstream CLI has no Doubao adapter.

## First use

Open a new assistant session if it has not discovered the new Skill.

> 用 Mindbox，把这份资料整理成思维导图，用彩虹经典。输出可编辑的独立 HTML。

> Use Mindbox to map these notes. Choose a style suitable for revision.

In Codex, use `$mindbox` for explicit invocation. Other hosts may expose Skills through a menu or natural matching. Do not assume an identical slash command works everywhere.

Then try:

> 保留内容，换成脑洞涂鸦。

Continue editing directly in the generated HTML. Save the latest HTML before asking the assistant for further changes; the paired Markdown is a snapshot, not a live synchronized file. See [direct editing](html-editing.md).

## Skill commands

Use these commands for a standard global installation / 全局安装统一命令：

| Action / 操作 | Command / 命令 |
| --- | --- |
| Install / 安装 | `npx skills add MarkingYang/mindbox -g` |
| List installed / 查看安装 | `npx skills list -g` |
| Update or upgrade only Mindbox / 更新或升级 | `npx skills update mindbox -g` |
| Remove Mindbox / 卸载 | `npx skills remove mindbox -g` |
| Reinstall or repair / 重新安装或修复 | `npx skills add MarkingYang/mindbox -g` |
| Inspect installed package / 本地版本与完整性 | `node "<skill-dir>/scripts/manage.cjs" --status` |
| Check stable release, read-only / 只读检查新版本 | `node "<skill-dir>/scripts/manage.cjs" --check` |

`<skill-dir>` means the actual installed Mindbox directory shown by `skills list -g`; replace it before running. The usual shared global directory is `~/.agents/skills/mindbox`. On macOS/Linux, for example: `node ~/.agents/skills/mindbox/scripts/manage.cjs --check`. In PowerShell: `node "$env:USERPROFILE/.agents/skills/mindbox/scripts/manage.cjs" --check`.

Update and upgrade are the same operation. Keep the `mindbox` name: omitting it updates other installed Skills too. Only update when requested, then open a new assistant session. An update follows the recorded source/ref; a pinned install remains pinned. Reinstall from `MarkingYang/mindbox` to return to the default branch, selecting the assistants again. Removal asks for confirmation and targets all standard assistant directories. For a specific destination use, for example, `npx skills remove mindbox --agent claude-code -g`; shared universal directories can serve more than one assistant. Generated HTML is independent and is not deleted by removing the Skill. Back up personal changes to installed Skill files before replacement.

更新／升级是同一个操作；保留命令中的 `mindbox`，只更新这份 Skill。安装或更新后开启新助手会话。卸载时确认操作；已生成的 HTML 保留。重新安装用同一条 `add` 命令，按提示再次选择助手。

For project-only installation, omit `-g`; run these from that project:

```bash
npx skills add MarkingYang/mindbox --skill mindbox --agent codex
npx skills list
npx skills update mindbox -p
npx skills remove mindbox
```

The global and project scopes are separate. Use the directory actually loaded by the assistant for version inspection. CLI options belong to the external [Skills CLI reference](https://github.com/vercel-labs/skills/blob/main/docs/cli.md); tests pin its version in `package-lock.json`.

Do not use `npx skills check` as a read-only check: the tested CLI 1.7.4 routes it to its updater. Mindbox's `manage.cjs --check` only compares the installed version against GitHub's latest stable release, reports network errors, and never replaces files. See [version management](versioning.md) for pins, ZIP replacement and legacy backups.

### Fixed release / 固定版本

```bash
npx skills add https://github.com/MarkingYang/mindbox/tree/v1.0.3 --skill mindbox -g
```

Replace the tag with another existing published release to change versions. This explicitly replaces installed Skill content, so keep your own backup of local edits. Standard CLI installation/update does not create the optional installer's one-version rollback snapshot.

### Remove extra adapters

The optional Mindbox installer adds a WorkBuddy link that is not registered in Skills CLI. Before removing the shared package, remove only that link: `~/.workbuddy/skills/mindbox` (or `<WORKBUDDY_CONFIG_DIR>/skills/mindbox`). Check that it is a symlink/junction pointing to the shared Mindbox package; leave an independent directory untouched. Then run `npx skills remove mindbox -g` to remove the standard native destinations. Windows junction removal must remove the link, not its target. Other WorkBuddy Skills and generated maps stay untouched.

The optional installer retains one prior package in `~/.agents/.mindbox/previous`. After uninstalling, you may delete this Mindbox-only backup if no longer needed; never delete the whole `.agents` directory or its lockfile. Re-running the optional installer repairs a missing adapter link while preserving unrelated existing installations.

The external CLI downloads resources and has its own telemetry policy. To opt out of telemetry/security-audit requests on macOS/Linux:

```bash
DISABLE_TELEMETRY=1 npx skills add MarkingYang/mindbox -g
```

PowerShell: set `$env:DISABLE_TELEMETRY = '1'` before running the install command. Mindbox's installed renderer performs no network requests, background updates or telemetry.

## Manual ZIP installation

Download `mindbox-v1.0.3.zip` from the [stable release](https://github.com/MarkingYang/mindbox/releases/tag/v1.0.3), with its `SHA256SUMS` file. Verify the archive checksum, then extract the complete `mindbox/` folder, not just `SKILL.md`.

- Codex: `~/.codex/skills/mindbox/`, or `<CODEX_HOME>/skills/mindbox/` if you configured `CODEX_HOME`.
- Claude Code: `~/.claude/skills/mindbox/`.

The folder must contain `SKILL.md`, `scripts/`, `references/`, `assets/runtime/`, `version.json` and license notices. Back up an existing manual installation before replacing it. CLI-installed updates and manual ZIP replacement are separate update methods.

## Local development installation

From any temporary project directory:

```bash
npx skills add /absolute/path/to/mindbox --skill mindbox --agent codex --copy -y
```

This copies the checked-in Skill into the temporary project. For the full local entry, run `node bin/install.cjs --source /absolute/path/to/mindbox`. The repository's `npm run test:install` exercises the real installer, WorkBuddy adapter, repeated installation and renderer without touching global installations.

## Slow installation / 安装长时间转圈

Prefer the same direct route used by other public Skills:

```bash
npx skills add MarkingYang/mindbox -g
```

The older `npx --yes --package=github:MarkingYang/mindbox mindbox-install` command asks npm to download a GitHub package and prepare its dependency before Mindbox can print progress. A spinner at that point does not identify the failing request. Earlier installer code then downloaded the repository again. The revised installer reuses its bundled Skill for a first install or a matching version pin. Explicit remote updates still fetch the requested source.

If only the npm spinner is visible for a long time, cancel with Ctrl+C and retry using the standard command. To see npm's download requests, add `--loglevel verbose` before `skills`: `npx --loglevel verbose skills add MarkingYang/mindbox -g`. Review logs before sharing them.

If the Skills CLI reports a GitHub clone error, changing npm's registry does not fix the GitHub connection. Check access to GitHub and retry. Do not disable TLS verification or switch to an untrusted mirror. No fixed installation duration is promised.

Already in a complete local checkout with dependencies installed? Run `node bin/install.cjs --source .` from its root to use the local files. This is a local development/recovery route, not an extra step required of ordinary users.

## Troubleshooting

| Symptom | Next step |
| --- | --- |
| `ENOENT ... git-clone.../package.json` | npm fetched a repository without the root manifest. Ensure `package.json`, `bin/install.cjs`, `package-lock.json` and the complete Skill are committed and pushed to the remote default branch. For unpublished local development, run `node bin/install.cjs --source .` from the repository root. |
| Skill not found in a new repository | Ensure `skills/mindbox/SKILL.md` and runtime assets were pushed; an empty remote cannot install the local files. |
| `node` / `npx` not found | Install Node.js 22.20+ and reopen the terminal/assistant. |
| Skill installed but not selected | Start a new session; invoke `$mindbox` in Codex or choose the host's Skill menu. |
| 模板资源校验失败 | Reinstall the complete Skill. Maintainers should rebuild the package; do not patch generated runtime files by hand. |
| 文件已存在 | Use a new output filename. Use `--force` only for an intentional overwrite. |
| Diagram too small | Expand only the branch you need, zoom in, or use the reading tour. Limits are capacity bounds, not readability guarantees. |
| WebP export unavailable | Use a browser with WebP canvas encoding. Mindbox reports the failure instead of renaming another format. |
