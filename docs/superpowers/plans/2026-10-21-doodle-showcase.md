# Doodle story and audience examples Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Current session executes the user's request directly; AGENTS.md excludes delegation without explicit user authorization.

**Goal:** Refine Brainstorm Doodle, add a real animated WebP story to the existing homepage, and present16 audience-specific original examples informed by public signals.

**Architecture:** Keep the current16 style identities and shared SVG/reader. Markdown files own full examples; examples/catalogue.json owns audience/topic/source metadata. The builder embeds compact previews and renders canonical standalone HTML. The homepage reuses those outputs and the exported WebP, with a static/reduced-motion fallback.

**Tech Stack:** Existing Node/CJS, plain HTML/CSS/JS, SVG, WebP; CUA for browser validation and actual export.

**Spec:** User request in this chat,2026-10-21: refine doodle and publish a fun animation on the local website; research attention signals and build16 matched content examples. “Publish” here means local site implementation; GitHub/deployment is not requested.

## Global Constraints

- Preserve16 preset IDs/recipes and32 doodle parts. Skill-first; Agent/MCP adapters remain phase two.
- src/ is canonical; regenerate the Skill runtime. Node>=22.20.
- Cite primary evidence with dates and populations. Original advice/examples are not measured popularity or promised outcomes.
- No private files, fake usage counters, new public customization, or Markdown downloads.

## Review Focus

- Displayed topics must open the matching complete content, not generic filler.
- Switching styles keeps user content; selecting an example explicitly loads that example.
- Dark and English-font styles must still show readable Chinese examples.
- Motion must stop outside the viewport and respect reduced-motion defaults; a static whole-map view remains available.
- Browser exports and generated pages must use the same SVG, content and selected-style/Markdown editor.

### Task1: audience/topic content

Files: references/showcase-topic-signals.json; docs/research/showcase-topics.md; examples/catalogue.json;16 examples/*.md.

- [x] Record primary-source attention signals and their limits.
- [x] Author16 distinct actionable examples with nested decisions, checks and next actions; no invented result statistics.
- [x] Test one-to-one preset coverage, source links, full-map rendering and meaningful depth.

### Task2: doodle story and library polish

Files: src/doodle.cjs; scripts/showcase.cjs; assets/showcase/; scripts/build.cjs; scripts/stage-site.cjs.

- [x] Refine pose expressions and branch character legibility, preserving density/deep-level restraint.
- [x] Generate a small original story with the canonical reader and export a real WebP through its exporter.
- [x] Decode and inspect poster/focus frames; include media in staged site output with correct MIME types.

### Task3: homepage and catalogue integration

Files: src/document.cjs; src/app.js; src/landing.cjs; src/index.html; src/site.css.

- [x] Show each audience/topic on its style card; open the matching full example.
- [x] Add the doodle story with a static whole-map alternative, explicit controls and reduced-motion handling.
- [x] Add an all16 content gallery and a concise linked evidence page without duplicating the full style catalogue.

### Task4: verification and delivery

Files: tests/showcase.test.cjs; existing distribution/site tests; docs/verification.md; version/package resources.

- [x] Build and run full checks, Node22 targeted checks and isolated installation checks.
- [x] Browser-check story playback/static state, example/content identity, Markdown editing, dark style and390px viewport.
- [x] Update the shared local Skill, generate local release assets and deliver local page/media links with screenshots.
