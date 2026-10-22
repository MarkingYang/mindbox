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

The complete package is published on GitHub. For a fixed stable snapshot of both installer and Skill, use:

```bash
npx --yes --package=github:MarkingYang/mindbox#v1.0.2 mindbox-install --tag v1.0.2
```

The unpinned command follows the default branch. No build step, npm dependencies or API key is required to run the installed renderer. This is a Skill for an existing assistant; it does not install an independent Agent or MCP server. [Public installation verification](https://github.com/MarkingYang/mindbox/releases/download/v1.0.2/installation-verification.json)

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

## Update or remove

```bash
npx --yes --package=github:MarkingYang/mindbox mindbox-install --update
npx skills remove mindbox --agent codex -g
```

For installed-version checks, pinned tags, one-version rollback and failure recovery, see [version management](versioning.md). The unified installer preserves the previous package; the generic Skills CLI update remains available without those recovery checks.

Updates are user-initiated: run the update command when you want the latest published repository version, then start a new assistant session. Use `npx skills list -g` to see globally installed Skills. The website uses Skills CLI as its primary installation and update route.

Updates keep the shared installation current across its linked host paths, including WorkBuddy. Re-run the npx installer to repair links. Existing unrelated WorkBuddy installations are preserved, with an actionable error rather than overwritten. To remove the WorkBuddy link, remove only `~/.workbuddy/skills/mindbox`; the shared source belongs to Skills CLI. Remove for each target separately if desired, or use `npx skills remove mindbox -g` to choose the installed destinations. Project installations omit `-g`. CLI options are owned by the external [Skills CLI](https://github.com/vercel-labs/skills); the repository pins its development test version in `package-lock.json`.

The external installer downloads resources and has its own telemetry policy. To opt out of its telemetry/security-audit requests on macOS/Linux:

```bash
DISABLE_TELEMETRY=1 npx --yes --package=github:MarkingYang/mindbox mindbox-install
```

PowerShell: set `$env:DISABLE_TELEMETRY = '1'` before running the same command. Mindbox's installed renderer does not perform update checks, telemetry or network requests.

## Manual ZIP installation

Download `mindbox-v1.0.2.zip` from the [stable release](https://github.com/MarkingYang/mindbox/releases/tag/v1.0.2), with its `SHA256SUMS` file. Verify the archive checksum, then extract the complete `mindbox/` folder, not just `SKILL.md`.

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
