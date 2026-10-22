# Export clarity and same-topic continuation

Goal: sharper PNG/WebP exports, same-topic HTML revision in place, and editable topic-neutral Agent prompts.

- [x] Export from SVG at final pixel dimensions: PNG4x (40MP/16384px cap), WebP2x (8MP/4096px cap), highest WebP quality,3 phases per reading step; test limits and decode actual browser exports.
- [x] Add --revise source.md/stdin for an existing HTML. Default output is that same file; preserve style, notes, surviving IDs and view. Invalid revisions must leave the previous file intact. Keep legacy sibling restyling available; Skill uses an explicit same-file output for normal continuation.
- [x] Update Skill to track the active topic/path, revise the latest HTML for additions/corrections/style changes, and create a separate file for a distinct requested topic or explicit save-as.
- [x] Replace narrow source wording with editable subject placeholders and examples. Default delivery stays HTML.
- [x] Increment minor version, build shared runtime, run full/package/installation checks, validate Skill, export PNG/WebP in the browser and decode both, refresh local installation.

Preserve16 presets, all layout/UID mappings, offline delivery, PNG/WebP-only menu and existing publication boundaries. No external publishing or delegation.
