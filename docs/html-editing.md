# Continue in HTML / 在图上继续编辑

Generate from Markdown, then keep the latest saved HTML as the maintained document. It contains the current node tree, stable IDs, source notes and style. The original paired Markdown does not automatically update when the browser edits the map; the HTML export menu only offers PNG and animated WebP. Every file switches between its chosen style and an editable Markdown view; there is no extra minimal-style alternative. The Skill can extract current Markdown when needed.

| Operation | Interaction |
| --- | --- |
| Select / 选中 | Click a node. All nodes, including leaves, can be selected. |
| Bulk edit / 批量编辑 | Click Markdown, edit the mindmap indentation, then click the style name or Ctrl/⌘ Enter to apply. Tab indents two spaces. |
| Rename / 改字 | Double-click or F2; Enter finishes, Escape cancels the text change. |
| Child / 子节点 | Select a node and press Tab. |
| Sibling / 同级 | Enter; at the root, Enter creates a child. |
| Delete / 删除 | Delete or Backspace removes the selected node and its descendants. The root cannot be deleted. |
| Undo / 撤销 | Ctrl/⌘ Z; redo with Ctrl/⌘ Shift Z or Ctrl Y. Up to 50 content operations in this session. |
| Fold / 折叠 | Click the node's fold/count badge, or press Space on a selected branch. |
| Navigate / 导航 | Arrow keys move between visible nodes and their parent/children. Escape clears selection, allowing normal Tab navigation. |
| Save / 保存 | Existing “保存 HTML” action or Ctrl/⌘ S. |

The footer reveals contextual shortcuts; there is no separate add/edit/delete/save toolbar. The same content/edit logic drives all 16 presets and all five layouts. A new child uses the next depth's existing style policy. This is structured tree editing, not free placement, arbitrary relationships or collaborative editing.

Markdown and node edits share the same model and undo history. Switching views regenerates the same text, sibling order and hierarchy from that model; HTML edits produce current Markdown, and valid Markdown edits update the map. The full browser editor also applies note/metadata deletion exactly; the CLI fence-only patch convention still retains unrelated source context. Unchanged nodes retain IDs. Invalid Markdown keeps the editor open and leaves the last valid map intact; Save HTML also retains the unfinished draft. Source notes remain outside the mindmap fence. Internal style configuration is hidden from the editing view.

Changes are held in the current page. Saving **downloads a new HTML**: browsers cannot silently overwrite arbitrary local files. Keep and reopen that new file for the next session or give it to your assistant. There is no background autosave. Undo history is session-only; saving preserves the current result and folded/view state. The page warns on leaving while there are unsaved content changes.

## AI follow-up

Provide the latest saved HTML and say what to change. The Skill can extract its content without loading megabytes of HTML code. If a saved unfinished draft exists, extraction returns that draft for correction; the valid canonical tree remains in the HTML:

```bash
node skills/mindbox/scripts/render.cjs --input latest.html --extract
node skills/mindbox/scripts/render.cjs --input latest.html --switch-to "彩虹经典"
```

Direct restyling retains current IDs and saved view. For an AI content rewrite, edit the extracted Markdown and use `--input latest.html --revise revised.md` to update that file, preserving surviving IDs, its current style and valid view state. A fence-only patch retains source notes; a complete Markdown revision can replace them. Do not return to stale paired Markdown.

Existing HTML with only embedded Markdown remains supported. In new HTML, the validated `document` tree has priority over embedded source text. An invalid new-format document fails rather than silently falling back to old content. The CLI reads JSON data and does not execute imported HTML scripts.

## Continue a topic in chat

The Skill keeps the active topic's HTML path. Follow-up additions, corrections, deletions and style changes update that same HTML. A new requested topic or an explicit separate copy gets a different file. Give the AI the latest saved HTML if you edited it in the browser.

The CLI extracts the current content with `--input map.html --extract`. After revision, use `--input map.html --revise revised.md` (or `--revise -` for stdin). It replaces the same HTML and internal Markdown together after validation; invalid content leaves the old files untouched. Surviving matching nodes retain IDs, the current style and valid view state remain. `--output another.html` explicitly creates a variant. Style-only continuation uses the same input/output path plus `--switch-to` and `--force`; legacy sibling-output commands remain available for explicit comparisons.

## Export clarity

PNG chooses at least2x sampling and targets28px for the smallest authored node font, capped at64MP and32760px. It includes the full tree and is independent of the current screen zoom. Capped exports report that limit; inspect the original HTML for further detail. Lossless PNG encoding does not imply unlimited pixel detail.

Animated WebP calculates reading groups, camera bounds and a shared frame size from the actual text. Focused text targets24px within2560px/4MP. Small maps use smaller frames; tall labels can change the frame aspect. Each camera is rasterized directly from vectors. The opening and closing overview frames establish context; focus frames carry the detailed reading. WebP remains raster animation, not vector video or guaranteed lossless.

Page zoom shows the actual design scale:100% means the original style typography, while Fit shows the calculated overview percentage. Click the percentage to restore100%. The detail ceiling depends on the smallest authored font and viewport (32–64px text), not an arbitrary fit multiplier. Wheel zoom remains pointer anchored. Saved HTML stores absolute scale plus the legacy fit ratio for compatibility.
