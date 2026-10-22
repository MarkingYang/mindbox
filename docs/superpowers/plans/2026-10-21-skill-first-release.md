# Mindbox Skill-first Release Implementation Plan

**Goal:** Publish-ready repository for the existing Mindbox Skill, with installable self-contained resources, bilingual onboarding, reproducible builds and checks.

**Architecture:** Keep the existing shared Markdown parser, style library, layouts and renderer. Commit a complete skills/mindbox package so installers need no repository build. Website and examples use the same renderer. Agent service and MCP belong to phase two.

**Tech Stack:** CommonJS, Node.js >=22.20, browser HTML/CSS/SVG; no runtime npm dependencies.

**Spec:** User-approved six-stage repository plan, narrowed to Skill only on 2026-10-21.

## Global Constraints
- Exactly 16 recommended presets; fixed IDs and old recipes remain compatible.
- Offline single HTML, Markdown first; selected preset plus minimal; PNG, animated WebP and Markdown exports.
- Preserve current deep-level behavior, all five layouts and existing user content semantics.
- Do not migrate private outputs, development artifacts or local paths.
- No Agent service, MCP or invented adoption metrics in this release.
- Preserve MIT license and bundled font licenses.

## Review Focus
- Installation copies all scripts/fonts/resources without requiring a build.
- Clean checkout builds independently of old workspace paths.
- Failed generation leaves previous outputs intact.
- Runtime package matches canonical source and release archive.
- Website works below a GitHub Pages repository subpath.

## Tasks
- [x] 1. Migrate source, tests, selected research and examples; exclude generated/private files.
- [x] 2. Establish Node-only deterministic packaging and runtime drift checks.
- [x] 3. Verify skills CLI discovery and isolated Codex/Claude Code installs; run installed render and restyle.
- [x] 4. Add tested failure-preserving delivery and machine-readable validation receipt.
- [x] 5. Write bilingual README, installation/format/architecture/roadmap, community templates and licenses.
- [x] 6. Add curated examples, source-derived preview, installation-focused website entry.
- [x] 7. Add CI, tag release assets and manually triggered Pages deployment.
- [x] 8. Run clean-copy build/test/install/package verification; record actual results and remaining publication steps.

Execution: implement in this session, without automatic commits or external publication.

## Actual delivery

Local repository construction completed. 78 tests, Node 22.20 and 26 checks, isolated Skills CLI installs, clean-copy build and browser exports verified. Remote GitHub install, hosted CI, release publication and Pages await pushing the reviewed files; see docs/verification.md.
