# HTML-first Mindmap Editing Implementation Plan

**Goal:** Make generated HTML the maintained document, with direct node editing shared by all 16 presets and Markdown as a generated interchange source.

**Architecture:** Add a pure document/edit model used in browser and CLI. Persist stable node IDs, canonical tree and view in HTML boot data; derive Markdown from that tree and preserve source notes outside the map fence. Reuse existing layout/SVG/media. Remove Markdown import from the reader.

**Tech Stack:** Existing Node/CommonJS + standalone browser SVG; no new runtime dependencies.

**Spec:** User request on 2026-10-21: HTML-first editing, shared edit behavior, add/change/delete/save without extra toolbar buttons.

## Global Constraints
- Keep all 16 presets and existing recipe meanings.
- Retain 300 nodes, 20 child levels, label/source limits and escaped data.
- HTML is authoritative after editing; old paired Markdown is only a snapshot.
- Keep existing save control, add no CRUD toolbar; remove import control.
- Invalid operations cannot replace good content; support undo/redo and canceled edits.
- No arbitrary connectors, freehand positioning, collaborative editing or Agent/MCP services.

## Tasks
- [x] Pure validated document model, lossless label serialization, stable IDs, edit history.
- [x] Shared node selection, inline editing and keyboard add/delete/undo/save; fold badges keep folding.
- [x] Save/reopen current tree, preset and view; Markdown and media use latest tree.
- [x] CLI reads HTML tree before stale source; --extract for low-context AI continuation.
- [x] Update Skill, documentation and fixtures; rebuild all 16 examples and package.
- [x] Tests for all presets/layouts, old HTML compatibility, roundtrips, limits and failures.
- [x] Real browser edit/undo/save/reopen/CLI continuation and exports.

## Review Focus
Stable untouched node identity; quoted/special labels; editing during IME input; deep/large invalid additions; unsaved edits and failed validation. Browser download is explicit saving, not an automatic overwrite of an arbitrary local file.

Execution is in this session; no push or publication.
