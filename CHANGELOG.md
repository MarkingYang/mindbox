# Changelog

## 1.0.2

- Consolidated release of the current Mindbox Agent Skill, shared renderer and 16 editable mind map styles.
- Use the standard Skills CLI installation route; the optional multi-host installer reuses its bundled Skill instead of downloading the repository twice.
- Include the lightweight reader preview, cached font resources, first-use tutorial and source-template preview fix.
- Retain MIT and all third-party font licenses. Historical release tags are retired; use v1.0.2 for pinned installations.

## 1.0.1 — 2026-10-22

- Open the editable preview immediately while resources load, retaining the selected card artwork and providing retry on failure. Closing a pending preview prevents late downloads from reopening it.
- Replace the initial all-font reader download with a small canonical shell and only the selected style fonts. Reuse the homepage WOFF2 cache, share concurrent requests and bound stalled resource loads.
- Keep generated/downloaded HTML fully offline and byte-identical to the canonical Skill reader for all 16 styles and custom compositions. Preserve the v1.0.0 reader-template URL for pages already open before this update.

## 1.0.0

- First stable Agent Skill release: turn notes, documents, code and ideas into editable offline mind maps with sixteen complete styles, including 脑洞涂鸦 and 浮生小趣.
- Include direct node and Markdown editing, undo/redo, folding, pan/zoom, reading guidance, lossless PNG and animated WebP exports. The standalone HTML embeds fonts and code; recipients only need a browser.
- Establish the v1.0.0 baseline with one version for the project, installer, Skill identity, runtime, package manifest and release archive. Preserve all sixteen style codes, recipes and older editable HTML.
- Complete Skill discovery and UI metadata for generation, same-topic revisions and style changes. Add a packaged, on-demand usage reference covering capabilities, source access, content format, browser editing, exports, version inspection and troubleshooting.
- Align installation, continuation and roadmap documentation with shipped behavior. Keep instructions concise, distinguish browser exports from CLI commands, and document explicit updates, recovery and unsupported integrations.

### Install this release

Requires Node.js 22.20+ and an assistant with local Skill support:

```bash
npx --yes --package=github:MarkingYang/mindbox#v1.0.2 mindbox-install --tag v1.0.2
```

The unified installer connects Codex, Claude Code, Cursor, OpenClaw and CodeBuddy, plus the WorkBuddy shared-directory adapter. Doubao Work uses shared Skill discovery. Open a new assistant session after installation; refresh the local Skill list in Doubao Work.

The attached ZIP is the complete portable Skill. See README and `docs/installation.md` for single-host/manual installation. The assistant supplies the model and document access; this release does not include an independent Agent, MCP server or hosted AI service.

## 0.42.0

- Replace MMH0S8 / P68 Chalk Night Talk with 浮生小趣: blue-grey canvas, warm grey donkey and apricot accents, eight character expressions and eight functional vector parts. Keep permanent IDs, the saved recipe and old name imports.
- Share the sixteen-part kit across the website gallery, actual map renderer, standalone HTML and packaged Skill. Add an everyday-work/AI example and preserve the separate32-part Doodle kit.
- Balance the functional kit as four note shapes and four annotation marks, adding a reusable question mark without inserting questions into authored content.
- Update the everyday-work example to demonstrate all sixteen parts, echo question marks only on authored questions, and link the kit directly to its complete example.
- Keep style-only frontmatter normalization stable and retain the current recipe when revising an existing HTML from complete Markdown without metadata, avoiding a false content mismatch or unintended switch to the default style.
- Rebuild the showcase directory cleanly and regenerate old lesson/study URLs with the current reader, so stale exports are not copied into the staged website.
- Normalize UTF-8 BOM on file input as well as stdin, preserving the selected style and allowing BOM-prefixed Markdown fences to render.

## 0.41.1

- Simplify all16 “给 Agent 用” prompts to the chosen style, editable mindmap request and one line of flexible source examples. Align the generic installation-area prompt; keep HTML delivery and same-topic continuation in the Skill contract.

## 0.41.0

- Replace the OS-drawn preset select with an opaque grouped picker using clear system UI typography, separate name/purpose/UID fields and readable task headings. Keep all16 preset identities and style-only content preservation.
- Fit the scrollable list within the viewport and support keyboard traversal, selection, Escape and outside dismissal.

## 0.40.0

- Remove the fixed300-node parser/editor ceiling. Generate detail according to the content rather than an arbitrary node quota, retaining input/resource guards. Verify continued editing at500 and1000 nodes and1000-node rendering across all16 styles and five layouts.
- Replace homepage capacity marketing with two-way diagram/Markdown editing. Keep source notes and metadata equivalent in the full browser editor, including explicit deletion; CLI fence-only patches retain their context-preserving convention.

## 0.39.0

- Organize the32 doodle parts by visual role:9 paper containers,9 marks and14 companions. Separate gallery ordering from stable rendering identities and use role-specific responsive grids and preview scales.
- Keep terminal ideas light, reserve secondary paper frames for unfolding topics, place multi-line highlights beneath the final line, and reduce small decorative marks.
- Regenerate the homepage reading story with the canonical renderer and retain all16 preset recipes.

## 0.38.0

- Add16 original audience-matched content examples, primary-source topic signals and a browsable full-map collection. Style cards preview and open their matching content; ordinary style switching retains the current map.
- Refine doodle expressions and branch-character legibility while preserving32 parts, density restraint and all preset identities.
- Preserve authored reading order when balanced geometry rearranges branches for left/right placement.
- Add an18.3-second real WebP reading story to the homepage, with an explicit static overview, viewport/visibility pausing and reduced-motion defaults. Lossless delta-frame repacking preserves all28 decoded frames and durations while reducing delivery bytes.

## 0.37.0

- Replace the extra minimal-style toggle with a Markdown editing view in all16 standalone styles and the website reader. Use the selected style as the sole map presentation.
- Apply Markdown through the shared content model, preserving stable surviving IDs, notes and a unified undo history. Keep invalid input editable and retain drafts in saved HTML.
- Save/reopen both views, synchronize direct node edits back to Markdown, and extract pending drafts for AI continuation. Keep PNG/WebP exports tied to validated map content.

## 0.36.0

- Expand Brainstorm Doodle to32 original reusable SVG components:14 character poses and18 paper/mark parts, presented in eight groups. Preserve existing component IDs and the P67/MMP0A7 recipe.
- Compose the new parts in actual maps using stable node identity and branch families. Use one secondary decoration slot, remove branch characters in compact layouts, and retain lighter deep-level typography.
- Keep site previews, standalone HTML and the packaged Skill on the same vector renderer.

## 0.35.0

- Display actual design scale:100% means original style typography, independent of full-map fit. Compute zoom limits from the smallest authored text and viewport; keep the percentage stable across branch folding. Clicking the percentage restores original size.
- Save absolute scale alongside the legacy fit ratio; retain old HTML compatibility and restore text size across viewport changes.
- Size PNGs for2x sampling and28px minimum text where the64MP/32760px budget allows. Report capped exports instead of promising unlimited clarity.
- Choose animation grouping, camera context, aspect and output dimensions from content, targeting24px focused text. Small diagrams use smaller frames; tall labels can use taller frames. Keep all nodes and rasterize each vector camera directly.

## 0.34.0

- Lighten folding controls with a20px visible mark and separate36/44px hit target. Keep selection strokes and spacing stable at high zoom, without thickening the selected preset border.

- Reuse the canonical editable reader for homepage tryout and HTML downloads. Trim only unused fonts; all16 styles and internal recipes match the Skill builder byte for byte. Legacy generated example pages now use the same reader.
- Add a complete in-page reader experience, concise operation help and a versioned quality page with160 reproducible structural cases and public20-level/298-node fixtures.
- Read back staged and delivered bytes before removing recovery copies. Include exact HTML/content/source hashes and an independent read-only `--check` command.
- Fix release-note extraction for bare version headings and generate notes alongside release assets. Add an explicit public-source readiness check that distinguishes unpublished packages from network failure and actual installation evidence.


## 0.33.0

- Separate branch folding from double-click text editing with one screen-sized, context-aware minus/count control. Preserve count markers for collapsed branches and omit controls on leaves.
- Anchor the operated node when folding/expanding and retain actual scale within zoom limits.
- Expose Space and Left/Right tree navigation, contextual hints and accessible action/state labels. Keep folding UI out of exported media.


## 0.32.0

- Raise screen zoom to at least2000%, with a larger adaptive ceiling for dense maps and pointer-anchored wheel zoom. Preserve saved high zoom.
- Size full-tree PNG by authored text metrics, within64MP/32760px; avoid applying screen magnification blindly to raster output.
- Render animated WebP through local vector cameras and spatially split reading groups. Add path context, overview bookends, and complete node coverage across16 styles and five layouts.


## 0.31.0 — 2026-10-21

- Raised PNG and animated WebP resolution budgets and rasterized SVG directly at final pixel dimensions; improved WebP quality and reduced redundant animation phases.
- Added validated same-file HTML revision with preserved matching node IDs, style, view and fence-only source notes.
- Made same-topic follow-ups update the active HTML; separate topics/explicit variants use new files.
- Replaced narrow Agent prompts with editable topic placeholders and examples; default delivery remains HTML.

## 0.30.0 — 2026-10-21

- Added installed version/status, explicit latest-release checks and a complete Skill package fingerprint.
- Added unified upgrade, version pinning, one-version rollback and recovery after handled failed installation/validation.
- Kept repeated installs from replacing the meaningful previous backup.
- Added release identity checks, version/support policy and open-source/license documentation; retained MIT and all font notices.

## 0.29.0 — 2026-10-21

- Removed public Markdown downloads from the website and showcase; kept intermediate Markdown and extraction internally.
- Made HTML the default Skill delivery link.
- Added one npx installation entry: Skills CLI manages five native targets; a shared link enables WorkBuddy without duplicating the runtime.
- Verified Mindbox discovery in local WorkBuddy and Doubao Work desktop skill lists. Other client versions may differ.

## 0.28.0 — 2026-10-21

- Established Mindbox.ink website identity with navy/blue logo, favicons and social sharing assets.
- Added real same-content style switching to the homepage and direct links to generated reader examples.
- Refined the16-style gallery, installation entry and responsive presentation without changing template recipes.
- Prepared static site metadata,404, sitemap and GitHub Pages deployment; domain/DNS activation remains an external setup step.

## 0.27.0 — 2026-10-21

- Added permanent six-character alphanumeric style UIDs with an MM prefix and interleaved sequence/allocated characters, shared by the website, Markdown and Skill generation/restyling.
- Kept all legacy P IDs and recipe meanings compatible; names and UIDs resolve to the same preset.
- Standardized the website installation entry on Skills CLI with copyable installation and update commands.

## 0.26.1 — 2026-10-21

- Removed Markdown from the HTML export menu and its download handler.
- Kept Markdown for initial generation and CLI extraction; HTML remains the maintained document.

## 0.26.0 — 2026-10-21

- Made saved HTML the maintained document, with a canonical tree and derived Markdown snapshot.
- Added shared direct editing across all 16 styles: rename, child/sibling insertion, subtree deletion, undo/redo and keyboard save.
- Removed Markdown import from the generated reader without adding a CRUD toolbar.
- Preserved stable IDs, source notes, current style, saved collapse and view state.
- Added `--extract` for low-context AI continuation from saved HTML; old HTML remains readable.

## 0.25.0 — 2026-10-21

First Skill-focused GitHub repository distribution, following the local 0.24.0 prototype.

- Migrated the existing 16 templates, shared renderer and adaptive deeper levels.
- Packaged complete runtime/font resources for Skills CLI installation without a repository build.
- Added bilingual onboarding, editable examples and a source-derived preview.
- Added Node-only deterministic ZIP packaging and staged paired-file replacement with rollback on handled failures.
- Added isolated Codex/Claude Code installation checks, repository CI, release assets and optional Pages deployment.
- Kept dedicated Agent and MCP integrations in phase two.

The local prototype history is not represented as previously published GitHub releases.
