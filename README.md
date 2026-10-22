# Mindbox

**English** · [简体中文](README.zh-CN.md)

[![Release](https://img.shields.io/github/v/release/MarkingYang/mindbox)](https://github.com/MarkingYang/mindbox/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Unfold ideas. Make thinking visible.**

Turn notes, documents and unfinished ideas into an editable mind map. Mindbox is an Agent Skill with **16 complete styles**. It delivers **one interactive HTML file** you can open offline, revise and share.

[Try the live website](https://markingyang.github.io/mindbox/) · [Explore 16 examples](https://markingyang.github.io/mindbox/showcase/index.html) · [Install](#start-with-one-sentence) · [Download v1.0.2](https://github.com/MarkingYang/mindbox/releases/tag/v1.0.2)

[![Four Mindbox styles, generated with the same renderer as the installed Skill](docs/images/overview.svg)](https://markingyang.github.io/mindbox/showcase/index.html)

## Start with one sentence

Requires **Node.js 22.20+** and an assistant that can run local Skills. Choose your assistant and install:

```bash
npx skills add MarkingYang/mindbox -g
```

Then give your assistant some material and ask:

> Use Mindbox to turn these notes into a mind map. Choose a style suitable for reviewing the material and give me editable, interactive HTML.

Or choose a style by name:

> 用 Mindbox，把这份资料整理成思维导图，用彩虹经典。

Select your assistant when prompted. For extra adapters such as WorkBuddy, multi-host setup, or the pinned v1.0.2 release, use the [unified installer](docs/installation.md). In Codex, you can explicitly invoke `$mindbox`. Start a new assistant session if the Skill has not appeared. [Installation and host compatibility →](docs/installation.md)

[Your first map: install, generate, edit and share →](docs/quickstart.md) · [Find and install Mindbox →](docs/discovery.md)

## A map you can keep working on

- **Choose a complete look.** Sixteen styles for reading, planning, writing and brainstorming, including restrained outlines, colorful branches, hand-drawn notes and the little donkey in 浮生小趣.
- **Explore at your own pace.** Fold branches, pan, zoom or follow the reading tour.
- **Edit directly.** Double-click a node to change text; Tab adds a child, Enter a sibling and Delete removes a branch. Undo is available.
- **Switch to Markdown.** Edit the text and hierarchy, then return to the map with your changes preserved.
- **Keep one portable file.** Fonts and code are embedded. Recipients need a browser; they do not need Mindbox, a server or an account.
- **Share the view you need.** Save the latest HTML, export a lossless PNG or create an animated WebP reading guide. WebP export requires browser WebP encoding support.

![A short doodle story exported by Mindbox's shared reader](assets/showcase/doodle-story.webp)

## Start from your task

| You want to… | Try… |
| --- | --- |
| Review a book or course | Minimalist · 极简, or 知识提纲 |
| Explain a plan or decision | Slate · 石板经典, or 商务蓝图 |
| Shape a talk or an article | Rainbow · 彩虹经典, or 概念分组 |
| Develop ideas or reflect on everyday life | Doodle · 脑洞涂鸦, or 浮生小趣 |

Ask the assistant to recommend a style when unsure. Chinese names, English aliases and six-character style codes such as `MMB0Q4` work; legacy IDs such as `P39` remain compatible. These are task suggestions, not popularity rankings. [All 16 styles →](skills/mindbox/references/style-guide.md)

## Continue the conversation

> Keep the content, but switch to Doodle.

> Add the risks we discussed under the launch plan. Keep the existing notes.

> Turn the final branch into three next steps.

Follow-up changes to the same topic update the same HTML; a new topic or an explicit save-as creates another file. After browser edits, save and give your assistant the **latest HTML**. The paired Markdown is an initial snapshot, not a file that stays synchronized with browser edits. [Editing guide →](docs/html-editing.md)

## Install, update and verify

Project and Skill share **v1.0.2**. The [release](https://github.com/MarkingYang/mindbox/releases/tag/v1.0.2) includes the complete Skill ZIP, checksums, release metadata and an [installation verification record](https://github.com/MarkingYang/mindbox/releases/download/v1.0.2/installation-verification.json).

Prefer a single host? Use the standard Skills CLI:

```bash
npx skills add MarkingYang/mindbox --skill mindbox --agent codex -g
```

This follows the repository's default branch. For a stable snapshot, use the pinned command in the installation guide. The unified installer also supports version inspection, explicit updates and one-version rollback. [Installation](docs/installation.md) · [Version management](docs/versioning.md) · [Manual ZIP install](docs/installation.md#manual-zip-installation)

Installation checks exercise copied resources and actual rendering through the supported host paths. They do not represent a model-driven conversation in every assistant. Local Doubao Work discovery was also verified; see the compatibility guide for its limits.

## How it fits into your assistant

Your assistant reads the material and organizes the content. Mindbox's bundled renderer provides the layout, styles and interactions. The website, CLI and installed Skill share that renderer, with parity checks for all 16 styles.

Mindbox's installed renderer and generated HTML work offline. Models, document access, costs and data policies belong to your existing assistant. This release focuses on the Skill; dedicated Agent and MCP adapters are planned separately. [Capabilities](skills/mindbox/references/usage.md) · [Roadmap](ROADMAP.md)

## Develop and contribute

```bash
git clone https://github.com/MarkingYang/mindbox.git
cd mindbox
npm ci
npm run check
npm run dev
```

Open `http://127.0.0.1:4173/`. For package changes, also run `npm run test:install`. Generated maps do not require this development server.

[Examples and source material](examples/README.md) · [Content format](docs/format.md) · [Architecture](docs/architecture.md) · [Verification](docs/verification.md) · [Contributing](CONTRIBUTING.md) · [Report a problem](https://github.com/MarkingYang/mindbox/issues)

Custom domain: **mindbox.ink**. DNS and domain binding are configured; HTTPS certificate issuance is still pending. The GitHub Pages address redirects to this domain. [Website and domain status](docs/website.md)

## License

Mindbox code is MIT licensed. Bundled fonts keep their individual OFL licenses; see [third-party notices](THIRD_PARTY_NOTICES.md).
