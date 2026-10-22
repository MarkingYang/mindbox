# Verification / 验收记录

## v1.0.3 lifecycle command verification

Local checks: `npm ci`, `npm run check` (156 tests), `npm run test:install`, Skill metadata validation and release packaging passed. The lifecycle integration uses the real Skills CLI 1.7.4 with a temporary OS home inherited by its updater subprocesses and an isolated Git transport fixture. It verifies global install/list/targeted update/remove/reinstall, fixed-ref retention, project install/update/remove, and the preservation of an unrelated installed Skill and a saved user HTML file. The installed Mindbox release checker reports an available update without changing package bytes or the lockfile.

Website tests execute the actual command-copy handlers for the homepage and first-use tutorial, including clipboard-unavailable selection fallback. A local Chrome check opened the management disclosure and clicked the update copy button, which reported success. These checks cover commands and UI behavior, not model conversations in every assistant or public release availability before publication.


## 1.0.1 reader loading · 2026-10-22

The old click path fetched a 6,243,576-byte all-font template before opening its modal, then discarded unused fonts. On one measured connection that transferred roughly 4.63 MB after compression. The homepage already requested the font files separately. Replacing the clicked preview's text also removed its SVG during the wait.

The new shell is 197,110 bytes (63,640 bytes with gzip); licensed font metadata is 43,152 bytes (3,319 bytes with gzip). Selected WOFF2 files use the same URLs as the homepage, so cache hits avoid transferring them again. A first visit with uncached fonts still needs those selected fonts; the shell reduction is not a claim that the complete offline HTML is 192 KB or that every connection has the same opening time.

151 tests and the isolated six-host install/reinstall/upgrade/recovery/rollback check passed. Loader tests reconstruct byte-identical canonical offline HTML for all 16 styles and a custom composition, verify selected-font/concurrent-request reuse, timeout and retry, preserve the card SVG, and reject late results after close or a newer request. Native Chrome opened the local 浮生小趣 preview with all 33 nodes. The screenshot is kept locally in ignored `artifacts/reader-loading/preview.png`; no live deployment or public v1.0.1 install is implied by these local checks.

Public follow-up: [all four CI matrix jobs](https://github.com/MarkingYang/mindbox/actions/runs/39700705474), [Pages deployment](https://github.com/MarkingYang/mindbox/actions/runs/39700705477) and the [v1.0.1 release workflow](https://github.com/MarkingYang/mindbox/actions/runs/39700996554) passed. A fresh credential-free pinned GitHub install exercised generation, revision, restyling and final validation through six host paths. The downloaded release ZIP passed SHA-256 and CRC checks. The live loader fetched the small shell, font metadata and three required font files, assembled canonical HTML in 1,696 ms on one connection, then repeated in 7 ms with zero new requests; these timings exclude browser layout and are not a universal speed guarantee. The [public acceptance receipt](https://github.com/MarkingYang/mindbox/releases/download/v1.0.2/installation-verification.json) records these checks.

## Custom domain DNS and HTTP · 2026-10-22

Bound `mindbox.ink` in the GitHub Pages repository settings. Replaced its previous server IP with two GitHub Pages apex A records (`185.199.108.153` and `185.199.109.153`), and changed `www` to a CNAME to `markingyang.github.io`. The user requested keeping this three-record configuration; no further records are required for basic Pages hosting.

DNSPod's saved records and the public Google DNS response matched. The apex HTTP response was 200 with the Mindbox homepage title; `www` returned a GitHub-served 301 to the apex. HTTPS validation still failed, the Pages API reported no certificate, and enabling HTTPS returned `The certificate does not exist yet`. Certificate issuance and HTTPS enforcement remain unfinished. The unrelated local source-preview changes and the immutable v1.0.0 tag were preserved.

## Public v1.0.0 installation and website · 2026-10-22

The published tag is `v1.0.0`, pointing to `eea20d1bd86c955ea636496eba5b768f9dd162aa`. Its [release](https://github.com/MarkingYang/mindbox/releases/tag/v1.0.2) contains the complete ZIP, SHA256SUMS, release metadata and a [public installation receipt](https://github.com/MarkingYang/mindbox/releases/download/v1.0.2/installation-verification.json).

Repeated the pinned GitHub npx installation with a fresh cache, disabled Git credentials and an isolated home. All six configured host paths matched the immutable release package, generated the 33-node 浮生小趣 example, revised it to three nodes, preserved its source notes, switched to 商务蓝图 in the same file and passed the final artifact check. This checks installation and rendering through the host paths, not a real model conversation in every host. Existing user installations were untouched.

Enabled GitHub Pages with Actions. [Deployment 39633938973](https://github.com/MarkingYang/mindbox/actions/runs/39633938973) passed checks and deployment; the public HTTPS homepage returned 200 and rendered the style catalogue in the browser. The custom domain still needs DNS configuration. Pending local source-preview changes were excluded from this immutable release and its deployment.

## Compact preset picker · 2026-10-21

Removed the380px popup minimum and its coupling to trigger width. The trigger now fits within260px; the popup uses intrinsic content width within280–320px and stays inside12px viewport margins. Font sizes and complete name/purpose/UID labels are retained.

Browser measurements: desktop trigger260px, popup280px; controlled320px and390px iframe layouts both use a280px popup, contain all16 options and show no horizontal text overflow. End/Enter selected彩色研讨 with the correctUID while retaining the topic; Escape returned focus to the trigger. Build,139 tests and package checks passed. Local evidence: artifacts/compact-picker/. These are responsive browser layout checks, not physical-device tests.

## 0.41.1 · concise Agent prompts

2026-10-21: all16 style cards use the same two-line usage template: the selected style name and editable-mindmap request, followed by flexible examples of source material. The generic installation-area prompt uses the same concise language. HTML delivery and same-topic continuation remain responsibilities of the installed Skill.

Browser checked every card's actual copy action: all16 generated texts exactly matched their displayed style name and the approved two-line template. The same generated string is passed to clipboard.writeText; this check read the backing prompt field, not the operating-system clipboard. The concept-grouping example and screenshot are local in artifacts/usage-prompts/. Package checks, isolated install/reinstall/upgrade/recovery/rollback checks and the135 existing tests passed. Installed0.41.1 package identity matched the repository bundle.

The initial full test run also included a separately added tests/fusheng.test.cjs and failed because its src/fusheng.cjs dependency was absent at that moment. That evolving style work was outside this copy-only change; the135 existing tests were rerun separately, and no full-suite green result is claimed here.

## 0.41.0 · readable preset picker

2026-10-21: replaced the native16-preset select/optgroup popup shown in the user's screenshot with an opaque in-page list. System UI typography, separate style/purpose/UID fields, explicit line heights and padding avoid relying on dim OS group-heading styling or single-line label truncation. Measured text/background contrasts are15.51:1 for primary text,5.75:1 for secondary text,6.79:1 for group headings and5.63:1 for selected UID text. Preset recipes and node artwork fonts remain governed by the same library.

Browser checked all16 options: each selected UID matched the current style heading and retained the current topic. Home/End traversal, Enter selection, ArrowDown opening and Escape dismissal/focus return worked. The final option fit within the menu viewport. At390px, the menu spans x12–378 within the frame; all16 options exist, and no name/purpose/UID text has horizontal overflow. Keyboard navigation brought the first item in the final group fully into view. Screenshots are local in ignored artifacts/preset-readability/; the controlled390px iframe is a layout check, not a physical mobile-device test.

All135 tests and package checks passed;11 focused picker/reader-export/site tests also passed on Node22.20. Isolated installation/reinstall/upgrade/recovery/rollback checks and Skill metadata validation passed. The shared local package was updated to0.41.0, integrity/fingerprint parity verified, with0.40.0 available as rollback. Local release assets were rebuilt; no public publication is implied.

## 0.40.0 · content-driven scale and bidirectional editing

2026-10-21: removed the fixed300-node checks from both Markdown parsing and canonical-tree normalization. Skill instructions choose detail/depth from the topic rather than a numeric node target; source-size, label-size and depth guards remain technical protections. Homepage/README copy presents bidirectional diagram/Markdown editing rather than capacity numbers. Existing independent HTML files retain their embedded runtime.

Reproduced and fixed a full-editor parity bug: deleting every note/metadata field in the Markdown view previously restored old source context through the CLI fence-only merge convention. Browser model revisions now replace that context exactly. Explicit CLI/AI fence-only patches still preserve unrelated context. Regression tests cover text, sibling order, hierarchy, stable matching IDs, source-note deletion, undo/redo and model restoration across all16 presets.

All135 tests and package checks passed. The32 focused parser/edit/content-scale/HTML-continuation tests also passed on Node22.20. Tests accept500 and1000 nodes, continue to501/1001, and roundtrip the complete tree. A1000-node fixture renders all1000 labels in16 styles × five layouts; P67 reading plans cover each node once within the existing focus/pixel budgets. The1000-node actual standalone HTML passed structural artifact validation including overlap checks. These are tested samples, not a new node ceiling or an unlimited-device performance guarantee. Isolated install/reinstall/upgrade/recovery/rollback checks and Skill metadata validation passed. Shared local Skill0.40.0 integrity was verified with0.39.0 rollback.

Browser checked the new homepage card and an actual1000-node reader DOM/footer. In a separate small reader, direct rename/add/delete appeared in Markdown; Markdown edits changed the tree and removed all notes, and a further direct rename appeared in Markdown again. A save-only QA adapter exposed the actual Save HTML blob; its six-node canonical tree and Markdown were read back as equivalent, with P67, Markdown view and the deleted notes absent. The browser URL policy blocked file:// reopening, so saved-file verification used read-only payload/artifact inspection rather than executing the downloaded file. Logs, receipts and screenshot are local in ignored artifacts/content-parity/.

## 0.39.0 · doodle catalogue and composition

2026-10-21: reorganized the32 stable parts into9 paper containers,9 marks and14 companions. Role-specific grids use three columns for paper/marks and seven columns for companions on wide screens; the390px layout retains three compact columns for paper/marks and two columns for companions. The catalogue's display order is independent of the fixed generation pose table. A regression test reverses both metadata catalogues and verifies identical node artwork.

Secondary paper frames now apply only to unfolding depth-two topics; terminal text stays light. Multi-line underlining follows the last baseline, and small corner marks occupy roughly one third of otherwise eligible slots. Compact density and deeper-level restraint remain intact. Skill instructions now require parallel siblings and supporting details beneath their parent idea, without implied cause, priority or completion from decoration.

All132 tests and package checks passed;27 focused tests also passed on Node22.20. The isolated install/reinstall/upgrade/recovery/rollback suite and Skill metadata validation passed. The actual shared local Skill was upgraded from0.38.0 to0.39.0 and its renderer fingerprint matched the canonical package. This does not publish the repository or upgrade existing independent HTML files.

Browser checked: all32 catalogue cards appear once; the actual site in a390px iframe has390px scroll width. Inspected both companion rows and paper/mark scales. A three-line node's underline stays beneath the last line. Space folding changed the nine-node fixture to five visible nodes and reopening restored nine; Markdown-to-map roundtrip retained nine. Evidence is in ignored artifacts/doodle-arrangement/. Re-exported the canonical13-node story as28 frames at960×604 over18.3 seconds; lossless repacking preserves every decoded frame and duration, resulting in261300 bytes. Media/source/SVG fingerprints pass the current test. These checks do not imply all browsers were tested.

## 0.38.0 · audience examples and doodle story

2026-10-21: authored16 distinct audience-matched examples,28–42 nodes and4–7 levels including the center. The primary-source topic file records seven dated signals and their populations/limits; it does not claim measured title popularity, Mindbox adoption or future outcomes. Source Markdown owns full content; generated covers show partial branches. All131 tests and package checks passed. The35 focused Node22.20 tests, isolated installation/reinstall/upgrade/recovery/rollback suite and Skill metadata validation passed. The shared local Skill is0.38.0 with verified parity and0.37.0 rollback.

Refined doodle expressions and branch-character scale while preserving32 component IDs and density restraint. Browser-checked the actual export of the13-node story through the canonical reader; a save-only QA adapter exposed its real WebP blob. The final story is960×604,28 frames,18.3 seconds and262900 bytes. A lossless delta-frame repack was verified against all28 decoded original frames and their durations; the original export was2756020 bytes. This adds no further pixel loss, but does not turn the original raster animation into vector media or prove that its original WebP encoding was lossless. Media/source/SVG hashes and reading labels are committed with the asset; sampled frames remain local in ignored artifacts/showcase-content/.

The story exposed a pre-existing order defect: balanced geometry emits right-side branches before left-side branches. Reading now orders siblings using the authored children list, with an80-case16-style×5-layout test. Re-exported and decoded the movie after that fix; frame12 now follows the second authored chapter rather than the third.

Browser checked: homepage story loads as an actual WebP; explicit static/play toggles work; leaving the viewport restores the poster. A controlled matchMedia fixture with reduced-motion=true starts static and permits explicit play; this was not a real OS preference change. At390px, the real page had390px scroll width, a352.906px displayed story and all16 cards. Dark P60 opened29 nodes; P40 opened its correct40-node example, and its Markdown included the nested duplicate-submit case. A style-only switch retained that topic. The complete example collection displayed16 cards; display metadata omits internal legacy labels. The server returns image/webp and image/png with200 responses.

Homepage, catalogue, full gallery, source links, static fallback and existing editable selected-style/Markdown reader are integrated. Compatibility study-notes.html is regenerated from the new learning example. Local release assets were generated; no GitHub publication, public deployment, real touch-device test or new user-conversion experiment was performed.

## 0.37.0 · selected map ↔ Markdown

2026-10-21: all16 styles now expose one selected map style plus a Markdown editing view. Canonical build,127 tests, runtime/package parity and the isolated install/reinstall/upgrade/recovery/rollback suite passed. The28 focused editor/player/HTML-continuation/reader-export tests passed on Node22.20. Skill metadata validation passed; the shared local Skill is0.37.0 with verified package integrity and0.36.0 rollback.

Browser checked the real P67 reader: incomplete Markdown blocked the map switch without losing text; a corrected revision added two nodes (22→24); map undo/redo returned22→24; direct node renaming appeared in Markdown. A save-only QA adapter exposed the production save blob through a visible download link, leaving model, serialization and rendering unchanged. Both valid edits and invalid drafts were actually downloaded and reopened. The valid file retained24 nodes, source notes, the P67 recipe and Markdown view; the invalid file restored its exact draft while retaining that24-node valid tree. An unchanged map/Markdown round trip did not mark content dirty. Escape exited the textarea to the map button. This does not claim a real IME or touch-device check.

The production page at390px in an iframe had a362×363.5px editor and390px page scroll width, with no horizontal page overflow. Final screenshots and actual saved HTML evidence are local in ignored artifacts/markdown-editor/. No fresh media encoding benchmark was run; PNG/WebP operations remain available in validated map view. Existing independent HTML files require regeneration/refresh to acquire the new runtime. No GitHub publication or deployment was performed.

## 0.36.0 · 32-part Brainstorm Doodle

2026-10-21: expanded P67/MMP0A7 to32 SVG parts, with14 character poses and18 paper/mark parts in eight groups. Original component IDs and preset recipe remain intact. Canonical build,124 tests and package resource checks passed. The20 focused renderer/hierarchy/edit tests also passed on Node22.20. Skill metadata validation and isolated install/reinstall/upgrade/recovery/rollback checks passed.

The actual site displayed32 cards and eight groups. Browser inspection covered the new paper edges, marks, eight new poses, and the canonical25-node complete reader. Space folded a branch from25 to20 visible nodes and expanded back to25. At390px in an iframe of the unmodified production page, the gallery used two157.453px columns; page scroll width equalled its390px viewport. This is responsive viewport evidence, not a real touch-device claim. Screenshots are local in ignored artifacts/doodle32/. No new media encoding benchmark was run; the SVG components flow through the unchanged exporter.

The235-node renderer fixture exercises all32 actual components across five structures, while the25-node example has a bounded character count. Compact layouts retain only the root character; framed leaf nodes do not also carry corner marks. Existing deep-level styling remains light. Full site/Skill parity tests passed; the shared local Skill was upgraded to0.36.0 with verified package integrity. Local release assets were generated; no GitHub publication or deployment was performed.

## 0.35.0 content-based scale and media

2026-10-21: build,124 tests and package parity passed. Five new cases cover genuine100% scale, content-derived limits, PNG budget reporting, adaptive animation dimensions, restoring native scale on large windows, and root-collapse stability (the first test combines limit/scale checks). The160-case structural report targets at least24px focused text across16 styles, five layouts and the20-level/298-node fixtures. This is model coverage, not a universal browser guarantee.

Browser verified that Fit on the298-node fixture displayed5.4%, clicking the percentage restored100%, and the computed detail ceiling was429.8% for the tested1280×720 viewport. The ceiling is a result of that content/viewport, not a new fixed percentage promise. Folding and expanding retained100% and the exact scale(1) transform. A saved HTML contained absolute scale1; reopening in1280px and390px iframe windows displayed100% in both.

A save-only QA adapter exposed production-generated export blobs as download links; rasterization and encoding were unchanged. Actual decoded files: seven-node PNG2424×496; WebP960×604,16 frames. The298-node PNG decoded3158×20262 (within64MP); WebP1567×945,130 frames and79.5s. First/last overview hashes matched intentionally, while a focused frame differed. The fixture's minimum computed focused text was24.48px. A large PNG can hit the pixel cap; lossless encoding does not make its overview legible at every display size. Receipts and sampled frames are local in ignored `artifacts/content-scale/`.

The user's existing298-node HTML was refreshed in place, preserving source, canonical tree, IDs, recipe and saved view. Its content-specific animation plan is1890×1127 with minimum24.48px focused text; this is calculated geometry, not an encoded export of the private file. The local shared Skill was upgraded to0.35.0. The23 focused Node22.20 tests, isolated installation/upgrade/rollback suite and metadata validation passed. Release assets were built and ZIP/hash checked locally. No GitHub publication or deployment was performed.


## 0.34.0 reader consistency and fold polish

2026-10-21: the full build,119 tests and package-resource checks passed. Byte-parity checks cover all16 presets plus an internal custom recipe through the website shell and canonical builder. The generated structural report covers16 styles × five layouts × two public fixtures (20 child levels and298 nodes),160 cases total. These are structural checks, explicitly not browser coverage or content-accuracy checks.

Browser verified the complete homepage reader:13 nodes, double-click editing, retention after “继续编辑”, and a close warning rendered inside the page. Downloaded the website's actual25-node HTML and independently checked its exact bytes against the canonical builder; the file matched.

At2000% on the synthetic298-node reader, the visible fold mark measured20×20 CSS px inside a36×36 hit area. The selected-node outline measured1px with non-scaling stroke and no dashes. Folding32 descendants changed298→266 visible nodes and expanding restored298. The operated node's center and screen width had zero measured change. Coarse-pointer hit size remains44px in CSS; real touch hardware was not exercised. Screenshots and the browser measurement receipt are in the same ignored artifact directory.

The user's existing298-node, six-level HTML was refreshed in place. Its canonical content tree, node IDs, style recipe and saved view matched the prior file. Local shared Skill installation is0.34.0 with verified package integrity. Standalone files already generated before an upgrade require refresh to receive runtime changes.

The isolated installer/reinstall/upgrade/failure-recovery/rollback suite and12 focused Node22.20 tests passed. Skill metadata validation passed. Release assets and version-section notes were generated locally; the ZIP and its hash were independently checked. Public source inspection still reports the GitHub package unpublished. No push, tag, public release, deployment or DNS change was performed.


## 0.33.0 branch interaction

2026-10-21: full build,107 tests and package parity passed. The anchor math was checked in both folding directions across16 styles × five layouts. The isolated installation/reinstall/upgrade/failure-recovery/rollback suite passed. Node22.20 targeted reader/view/fold checks passed.

Browser capture of the prior reader showed a selected branch with an almost invisible scale-dependent minus marker. The updated reader exposed a36px contextual button: click selected a branch, minus hid5 descendants (22→17 visible nodes), plus restored them, double-click opened only text editing, and Space/Left/Right operated the branch independently. The operated node's screen center and width matched exactly before/after the measured fold. A leaf selection had no fold button. Nested folds survived parent collapse/re-expansion (20/22 visible) and Save HTML retained the inner collapsed ID with the transient button hidden. Keyboard labels/states and coarse-pointer44px CSS are present; real touch hardware and a full screen-reader audit were not exercised. Screenshots and saved proof are local in ignored `artifacts/fold-interaction/`.


## 0.32.0 adaptive zoom and reading export

2026-10-21: full build,105 tests and package parity passed. A synthetic298-node tree was checked across all16 styles × five layouts: DFS groups covered every node exactly once, target bounds stayed in the focus camera and focused text exceeded18px at the export viewport. Separate tests cover high zoom and bounded adaptive PNG sizing. Node.js22.20 reader/adaptive tests and the real isolated installation/upgrade/rollback suite passed.

Browser verified2219% zoom, saved/reopened at the same zoom, and returned to100% with Fit. A save-only local QA adapter downloaded actual production exports. The298-node PNG decoded3209×19942 (about64MP); WebP decoded1920×1080,130 frames,79.5s and11.6MB. Sampled focus frames differed from overview frames; first and last intentionally matched. The smallest focused target font in this fixture was28.2px. This is fixture evidence, not a guarantee of arbitrary content, browser memory or aesthetic quality. The PNG pixel cap can still reduce sampling on extreme maps. Artifacts are local in ignored `artifacts/adaptive-reading/`.

The user-provided298-node Harness HTML was refreshed in place; the full text tree, node IDs, recipe and saved view matched the prior file. Its computed reading viewport is1920×1080 with73 groups and minimum23.6px focused text. These are layout checks; browser media decoding above used the synthetic fixture.

The shared local Skill and staged site are refreshed to0.32.0; previously generated standalone HTML embeds its own runtime and needs an in-place refresh to receive fixes. No GitHub publication or deployment was performed.


## 0.31.0 export clarity and topic continuation

2026-10-21: full build,100 tests, package checks and real isolated installer/reinstall/upgrade/rollback checks passed. The15 reader/continuation tests also passed on Node.js22.20.0. Tests cover same-path revision, surviving IDs/view/style/source notes, invalid changes preserving the previous file, and explicit separate variants.

Browser export comparison used the same41-node source and preset with the old0.30.0 and new0.31.0 production rendering/encoding paths. A local QA adapter replaced only the final save action with a visible download link so generated blobs could be downloaded and decoded. PNG changed2965×2624→5929×5248; animated WebP1482×1312→2964×2624. The new animation decoded65 frames with distinct reading frames; both exports have about4× the previous pixel count for this example. The WebP is about36.5MB versus10.2MB previously: higher clarity increases size. This is a bounded raster export, not lossless/vector animation. Evidence is local in ignored `artifacts/export-clarity/receipt.json` and exported files.

Browser verified the selected-style Agent template, editable topic placeholder, source examples and same-topic continuation text. The previous model-selection HTML was refreshed in place with its content/IDs preserved. The local Skill was upgraded to0.31.0. No GitHub publication or deployment was performed.

## 0.30.0 version management and licensing

2026-10-21: full build,97 tests and package checks passed. Real Skills CLI tests in an isolated OS home covered all six installation routes, canonical generation/restyling parity, older-version upgrade, identical reinstall preserving the previous backup, failed source/failed integrity recovery, installer lock-record preservation, rollback and a render after rollback. The five version/license tests and the same installation suite also passed under Node.js22.20.0.

The packed npm entry reported0.30.0 through npm exec. Skill validation, release packaging and static staging passed. A live explicit release check returned `unpublished`; no stable release was fabricated. Browser verified/copied the unified upgrade command and the version/rollback link. The actual local installation was upgraded0.29.0→0.30.0 with complete package integrity verified and0.29.0 retained as the previous package.

The standalone HTML now retains the root MIT text in an invisible comment, alongside existing font notices; no license UI was added. No GitHub commit/push, tag, release publication, website deployment or DNS change was performed. Cross-platform code paths and the prepared release workflow are not evidence that all operating systems or a public release have been exercised.

## 0.29.0 installation and delivery update

2026-10-21: build, 92 tests, package parity and isolated installation checks passed. The unified npx package entry was packed and invoked through npm exec. The pinned Skills CLI installed five native targets; the WorkBuddy adapter linked its local Skill directory to the same canonical package. Each installed route rendered MMB0Q4 and restyled MMP0A7 with canonical HTML parity; repeated installation passed. Adapter tests preserve foreign existing installations and observe shared updates.

On this Mac, Doubao Work's skill management initially found no Mindbox in the legacy Codex-only installation. After shared installation and refresh, its Local category showed Mindbox. WorkBuddy 5.8.3 initially did not list the CodeBuddy-only placement; after adding its own shared link, its Installed Skills search showed Mindbox. This verifies local discovery, not a complete model-driven session in every host or other client versions. The legacy manual Codex package was backed up locally and linked to the shared 0.29.0 installation.

Browser checked the updated installation command and copy feedback. Public Markdown download controls/links are removed; internal Markdown generation/extraction remains. Skill frontmatter validation, static staging and release packaging passed. The GitHub-source command still requires the repository changes to be pushed; no push, public deployment or DNS change was performed.

## 0.28.0 — Mindbox.ink website

2026-10-21: full build,90 tests, package parity and isolated Skills CLI installs passed. Local static staging/release assets succeeded. Browser checked four homepage styles with identical13-node text, install-copy feedback and a rendered output preview; no browser console errors were observed. Inspected390px/768px iframe layouts and fixed the mobile brand-name visibility. Website links, brand assets, PNG signatures/dimensions and domain metadata resolve in build checks. The local installed Skill was refreshed. Pages workflow and DNS instructions are prepared; no GitHub push, hosted deployment or DNS changes were performed.

## 0.27.0 — Permanent style UIDs

2026-10-21: full build, 88 tests and package checks passed. All16 styles generated byte-identical HTML through UID, name and legacy P inputs. Reordering did not change identity; UID restyling preserved source content. Skills CLI temporary Codex/Claude Code installs generated and restyled using UIDs. Skill frontmatter validation passed in an isolated Python environment. Browser verified six-character badges, UID search and instruction-copy feedback. Local installed Skill was refreshed to 0.27.0. No GitHub publication was performed.

## 0.26.1 — Two export choices

2026-10-21: removed the Markdown menu and its download handler. Full build, 86 tests, package checks and Skills CLI installation checks passed. Browser confirmed only PNG image and animated WebP remain in the export menu. The installed local Skill and release assets were refreshed. Markdown remains an initial-generation/interchange file and CLI extraction format.


## 0.26.0 — HTML-first editing

Verified 2026-10-21: full build and 86 tests passed on local Node 26; 30 targeted editor/reader/Skill tests passed on Node 22.20. Skills CLI temporary Codex/Claude Code installation check passed. The installed local Mindbox was updated to 0.26.0 and read current content from an actual browser-saved HTML.

Actual browser checks: renamed a root in Chinese; Tab added a child; Enter added a sibling; literal `root((...))` text survived; deleting a six-node subtree and undo restored all nodes. Save/reopen retained 24 total nodes, 19 visible nodes and the collapsed branch. The CLI extracted those edits and restyled to P39. Downloaded Markdown contained all 24 current nodes. Ctrl/Command S during text editing committed the new root and downloaded a matching HTML.

The reader no longer shows import. One shared editor serves all 16 styles and five layouts; automated checks exercise those combinations. Real IME composition and mobile-only editing were not separately exercised; keyboard composition guards are present. Browser saving downloads a new file, without background autosave or silent overwrite. No hosted workflows or GitHub publication were performed.

## Previous repository baseline


Date: **2026-10-21** · Repository version: **0.25.0**

## Locally verified

| Check | Observed result |
| --- | --- |
| Node.js 22.20.0 | `npm run check`: build passed, 78 tests passed, package-resource check passed. |
| Local Node.js 26.0.0 | 78 tests passed; clean-copy build/test/package flow passed. |
| Real Skills CLI 1.7.4 | Discovered one `mindbox` Skill; copied project installs for Codex and Claude Code; both rendered P39 and restyled to P67. Also passed under Node.js 22.20.0. |
| Installed/canonical parity | All 16 presets compared byte-for-byte in the automated suite. Isolated installs also matched the canonical P39 document. |
| Clean-copy verification | Copied without `.git`, `node_modules`, `dist`, outputs or development artifacts; `npm ci`, package check before build, full check, install check, release assets and site staging all passed. |
| Archive | Clean-copy ZIP matched the source build. Node 26 re-created the Node 22 ZIP byte-for-byte. Python standard-library `zipfile` independently validated the ZIP structure/CRC. |
| Failure handling | Injected a second rename failure and confirmed both old files were restored; existing output is protected without overwrite permission. |
| Skill metadata | Skill Creator validator passed; YAML and repository preview SVG parsed. |
| Website subpath | Browser opened `site/index.html#use-skill`; all 16 cards appeared and copying the installation command showed success. |
| Reader | Opened the built creative example; switched Doodle → Minimal → Doodle, retaining 22 nodes; started and paused reading guidance; verified exactly three export menu items. |
| Actual PNG export | Downloaded and decoded: PNG, 4777 × 1048. |
| Actual WebP export | Downloaded and decoded: WebP, 1600 × 351, 134 frames, 111 distinct RGB frames. First/last frames are intentionally the same whole-map view. |

Browser checks used an HTTP development preview. Static checks verify embedded resources and the absence of external script/font requests; an operating-system double-click / `file://` browser session was not separately exercised in this repository run. Browser export results describe the tested browser, not every browser or host.

Developer evidence is kept locally in ignored `artifacts/repository-release/`: clean-check receipt, export-check receipt and UI screenshots. It is not a required part of the installable package or a published test report service.

## Prepared, not yet run on GitHub

- CI matrix: Ubuntu Node 22.20/24, macOS Node 24, Windows Node 24.
- Matching-tag Release workflow: checks, versioned Skill ZIP, SHA256SUMS and release manifest.
- Manually triggered GitHub Pages workflow, with a roughly 48 MB public site rather than bulk compatibility exports.
- Public-source installation: `npx skills add MarkingYang/mindbox --skill mindbox -g`.

These require the complete repository to be pushed. A local-path install is evidence for discovery/copying/resource completeness; it does not prove the current GitHub remote contains these files. Workflows being present does not mean a release or website is already live.

No full real-model Codex/Claude Code conversation, Windows/macOS CI execution on GitHub, throughput benchmark, measured Token saving, or user adoption survey is claimed by this verification.


## 浮生小趣 · MMH0S8 / P68

Replaced the former Chalk Night Talk display with 浮生小趣, preserving its UID and seven-token recipe. Current shared SVG kit: 8 grey-donkey expressions, 4 note containers and 4 annotation marks. Blue-grey canvas and warm-grey/apricot accents differ from the existing 32-part Doodle kit. Old Chinese name and chalk aliases still import.

Validation: npm run check passed140 tests and the packaged-resource check; npm ci and npm run test:install passed. Browser: actual16-card kit visible, P67/P68 kit visibility independent, original node status/content unchanged during switching, standalone33-node example displayed, no warn/error console entries observed; PNG action reported3969×1889. Exported file bytes were not independently decoded. Browser screenshots: artifacts/fusheng-kit.png and artifacts/fusheng-reader.png. Reviewable offline artifact: outputs/fusheng-small-joys.html. No production deployment performed.


### 浮生小趣4＋4调整

纸笺减至4种（移除叠页归档），提示增至4种（新增暂存问号），8个角色不变，共16枚。问号只在图鉴作为独立组件提供，不随机为作者正文增加疑问。npm run check通过140项测试与资源包校验；隔离安装检查通过。浏览器实际确认paper/mark/actor分组数为4/4/8，截图artifacts/fusheng-four-plus-four.png。独立样例与下载包已重建。

### 0.42.0 项目整体复查 · 2026-10-21

修正两处可复现的遗留问题，并加入回归检查：

- 重建范例时清理生成目录，避免已下线的旧页面继续进入网站；旧课堂链接保留原内容，并用当前阅读器与 MMH0S8 样式重建。
- 文件输入与标准输入统一移除 UTF-8 BOM，避免文件里的指定样式被忽略，以及无元信息的 Markdown 代码块无法读取。

本轮实际验证：

| 检查 | 结果 |
| --- | --- |
| 本地 Node 26 | `npm ci`、`npm run check` 通过；142 项测试与资源包一致性校验通过。 |
| 安装、升级与回退 | `npm run test:install` 通过；使用隔离目录，没有改动真实用户安装。 |
| 16 套样式 | 浏览器逐套切换，同一份 17 节点内容保留；换行差异归一后文字一致，未发现文字越出节点边界。 |
| 独立阅读器 | 33 节点样例改字成功，Markdown 同步，阅读演示可启动和停止，保存的 HTML 经独立检查保留修改。 |
| 实际媒体文件 | PNG 解码成功，4186 × 1889；WebP 解码成功，1501 × 908，共 36 帧、35 个不同画面。 |
| 分发准备 | 发布包与网站已本地重建；0.42.0 ZIP 的 SHA-256 和独立 CRC 检查通过。 |
| 文档与预览 | 本地 Markdown 文件链接检查未发现缺失目标；独立样例保留原内容后更新。浏览器未观察到 warn/error 日志。 |

本轮浏览器检查通过 HTTP 本地预览进行。浏览器策略不允许打开 `file://`，因此未重新验证保存文件的双击打开；未绕过策略。真实输入法、移动设备和 GitHub CI 未在本轮执行。未推送、打标签或部署。证据保存在忽略目录 `artifacts/project-audit/`。

### 浮生小趣范例同步 · 2026-10-21

生活范例保留八个主分支和33个节点，更新为AI助力、职场负担、面试镇定、求职闯关、生活期待与责任边界的具体表达。完整范例实际呈现8个角色、4种纸笺和4种提示；暂存问号只呼应作者明确写出的问句，不按节点身份随机添加。图鉴入口直接链接完整生活范例，范例卡片、网页样例和原独立HTML均已同步。

更新原文件时发现并修正：完整Markdown不带样式元信息时，续改旧HTML可能因重复规范化产生空行而校验失败，或者回退到默认样式。新增回归检查验证正文、说明和既有样式均正确保留。

`npm run check`通过144项测试与资源包校验；隔离安装、升级、回退检查通过。发布包及待部署网站已本地重建。浏览器实际确认33个节点、全部16枚组件，以及“第几轮才算最后一轮？”和“下一站想遇见什么？”两处问号提示，未观察到warn/error日志。截图：`artifacts/fusheng-example/updated-preview.png`。本轮未部署，离线文件已结构校验但未绕过浏览器策略复测`file://`打开。

### Skill 完整性与 v1.0.0 · 2026-10-21

项目与 Skill 统一为 v1.0.0。补齐入口的生成/续改触发、宿主资料访问边界、交付与校验约定；新增随包 `references/usage.md`，按需说明功能、格式、浏览器编辑、导出、版本与排查；同步 UI 元信息、安装说明、续改文档、路线图与发布指引。主入口保持精简，自动发现仍启用，不添加未实现的 Agent/MCP 能力。

| 检查项 | 本轮实际结果 |
| --- | --- |
| 版本一致性 | 根 package/lockfile、Skill version.json、runtime manifest、完整包 manifest、安装器和发布清单均为 1.0.0；发布标签字段为 v1.0.0。新增自动检查避免后续漂移。 |
| Skill 结构 | Skill Creator 格式验证通过；UI YAML、默认调用及按需文档链接通过。下载包独立解压后引用文件齐全，版本与完整性校验通过。 |
| 功能回归 | Node 26.0.0 下 `npm ci`、`npm run check` 通过146项测试与资源校验；Node 24.19.0 下同样146项测试通过。16套样式和全部五种结构由现有测试覆盖。 |
| 隔离安装 | 安装、重装、升级、失败恢复和回退检查通过，不依赖真实用户目录。 |
| 本机实际升级 | 经统一安装器从0.41.1更新到1.0.0；Codex、Cursor共享目录、Claude Code、OpenClaw、CodeBuddy与WorkBuddy对应路径的包指纹相同，并分别生成33节点浮生小趣样例。 |
| 实际续改 | 已安装副本完成全文修订、保留当前样式与来源、同文件换风格、最终检查；无效修订保留原文件。0.41.1保留为单版本回退包。 |
| 分发产物 | 网站本地构建与暂存完成；mindbox-v1.0.2.zip包含55个文件，SHA-256与独立ZIP CRC检查通过。 |

证据保存在忽略目录 `artifacts/skill-v1/`。这里验证的是脚本功能、资源与安装路径；未在每个助手中重新执行真实模型会话，未重新验证豆包工作界面刷新，也未声称本轮覆盖Node 22、真实输入法或全部浏览器。已生成HTML保持独立，升级Skill不替换用户文件。未推送代码、创建Git标签、发布GitHub Release或部署；公开安装仍以实际发布后的源为准。新会话才能重新载入更新后的Skill说明。
