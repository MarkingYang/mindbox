# Versions, updates and recovery / 版本、更新与回退

## Standard Skills CLI / 日常管理

| Action / 操作 | Global command / 全局命令 |
| --- | --- |
| Install / reinstall / 安装或重装 | `npx skills add MarkingYang/mindbox -g` |
| List installed / 查看安装 | `npx skills list -g` |
| Update / upgrade Mindbox / 更新或升级 | `npx skills update mindbox -g` |
| Uninstall / 卸载 | `npx skills remove mindbox -g` |

Update and upgrade mean the same operation. Naming `mindbox` keeps other Skills out of the update/removal request. `-g` manages global installations; for a project omit `-g` for add/list/remove and use `-p` for update. Run project commands from that project. Start a new assistant session after installation or updates. Generated HTML remains independent of Skill changes.

Updates follow the recorded source/ref, not necessarily the newest GitHub release. The ordinary install follows the default branch; reinstalling with it returns a pinned installation to that branch and prompts for assistants again. Manual ZIP installs are replaced manually unless explicitly reinstalled with Skills CLI. Standard CLI updates do not create a Mindbox rollback backup. [Full installation and extra adapters](installation.md#skill-commands)

If an earlier installer recorded a local bundled source, or you installed a ZIP/local folder, first run the ordinary `add` command once to migrate to the public GitHub source. The standard updater follows the recorded source; it does not infer that migration. Existing shared WorkBuddy links remain usable.

## Inspect versions without changing files / 只读检查

Replace `<skill-dir>` with the Mindbox path shown by `npx skills list -g` (omit `-g` for a project):

```bash
node "<skill-dir>/scripts/manage.cjs" --status
node "<skill-dir>/scripts/manage.cjs" --check
node "<skill-dir>/scripts/render.cjs" --version
```

`--status` verifies the local package and reports its version/fingerprints/source; `--version` prints the installed version. Both work offline. `manage.cjs --check` explicitly contacts GitHub's latest stable release with a five-second timeout; it does not install anything. It distinguishes an update, current/ahead version, unpublished release, and unavailable network. Do not call it during ordinary generation.

On macOS/Linux the usual global command is `node ~/.agents/skills/mindbox/scripts/manage.cjs --check`; in PowerShell use `node "$env:USERPROFILE/.agents/skills/mindbox/scripts/manage.cjs" --check`. Custom, manual and project paths can differ.

**Do not substitute `npx skills check` for a read-only check.** In the tested external CLI 1.7.4, `check`, `update` and `upgrade` share the updater. Use the installed Mindbox check above when no file changes are intended.

## Pin or switch a version / 指定与切换版本

```bash
npx skills add https://github.com/MarkingYang/mindbox/tree/v1.0.3 --skill mindbox -g
```

This installs the [v1.0.3 release](https://github.com/MarkingYang/mindbox/releases/tag/v1.0.3). Substitute another existing release tag to explicitly change versions. Subsequent `skills update mindbox -g` preserves the pin; it does not jump to a newer tag. Run the ordinary install to follow the default branch again. Back up local modifications before replacement. For ZIPs, extract the complete versioned Skill folder using the [manual instructions](installation.md#manual-zip-installation).

## Optional installer and legacy recovery / 额外适配与旧安装器回退

Use this section when you need the WorkBuddy adapter or previously used the Mindbox multi-host installer. It is separate from everyday Skills CLI management:

```bash
# Inspect the optional installer's state or check the stable release
npx --yes --package=github:MarkingYang/mindbox mindbox-install --status
npx --yes --package=github:MarkingYang/mindbox mindbox-install --check
# Explicitly update and repair its extra host link
npx --yes --package=github:MarkingYang/mindbox mindbox-install --update
# Restore the one saved package, only if it exists
npx --yes --package=github:MarkingYang/mindbox mindbox-install --rollback
```

The optional installer installs five native targets and links WorkBuddy to the shared package. On a handled install/validation failure it restores its temporary snapshot; after a changed successful install it retains one previous complete package at `~/.agents/.mindbox/previous`, outside Skill discovery. Reinstalling identical content preserves that prior backup. A standard Skills CLI or manual ZIP install alone has no such saved version: do not promise `--rollback` for those installations. The backup can be older than the immediately preceding standard CLI update.

To pin both this optional installer and its content:

```bash
npx --yes --package=github:MarkingYang/mindbox#v1.0.3 mindbox-install --tag v1.0.3
```

Its installer version and installed Skill version can differ after pins or rollback. Report both accurately. A crash, power loss or external process may prevent recovery; concurrent installer runs are unsupported. Fingerprints detect drift, not publisher authenticity. [Uninstalling extra links and the optional backup](installation.md#remove-extra-adapters)

## Release policy / 发布规则

- `package.json` supplies the release version; the lockfile, Skill identity, runtime/package manifests and `vX.Y.Z` tag must agree. The v1.0.0 baseline unified project and Skill versions; older generated HTML remains readable.
- Use semantic versions: compatible fixes are patches, compatible capabilities/styles are minor releases, and intentional breaking changes require a major version. Preserve all 16 style codes and recipe meanings.
- `main` is the development channel; a published GitHub tag is an immutable stable snapshot. Fix a published package with a new version rather than replacing tags/assets.
- Rendering stays offline, with no background checks or silent upgrades. Model access and source permissions belong to the host assistant.

## Maintainer release steps

1. Update package/lockfile version and changelog.
2. Run `npm ci`, `npm run check`, `npm run test:install` and `npm run release:assets`; inspect release metadata/checksums.
3. Commit canonical source and generated Skill resources, then publish through a reviewed pull request. Do not commit `dist/`.
4. Tag the merged commit with the matching version. The release workflow rechecks identity/tests and publishes the ZIP, metadata and checksum.
5. Verify installation from the public source and the actual published tag in an isolated home. Local tests alone do not prove public installation.
