# Architecture / 实现结构

Mindbox's first public repository release focuses on the Skill. It does not implement a dedicated Agent, MCP server or model backend.

```text
Assistant organizes material → mindmap Markdown + preset
                                      ↓
                 skills/mindbox/scripts/render.cjs
                                      ↓
                 shared parser → layout → SVG → HTML reader
                                      ↓
                      paired Markdown + offline HTML
```

## Source of truth

| Location | Responsibility |
| --- | --- |
| `src/library.cjs` | 16 selected presets, stable recipes, old compatibility definitions and task positioning |
| `src/engine.cjs` | Markdown parsing, bounds and five layouts |
| `src/edit.cjs` | Canonical HTML tree, stable IDs, edits, history and derived Markdown |
| `src/hierarchy.cjs` | Shared depth metrics and style-family policies |
| `src/render.cjs`, `src/doodle.cjs`, `src/fusheng.cjs` | SVG nodes, connections and separate original doodle / everyday-life component kits |
| `src/document.cjs` | Single HTML assembler for site and Skill |
| `src/reader-export.cjs` | Bind website data into the canonical reader shell, with byte parity and selective embedded fonts |
| `src/player.template.html`, `src/player.*` | Reader controls and local interactions |
| `src/media.cjs` | Full-map export scene and WebP animation container |
| `src/index.html`, `src/app.js`, `src/styles.css` | Template website and interactive examples |
| `skills/mindbox/SKILL.md` | Short content-first instructions, with references loaded only when needed |
| `skills/mindbox/scripts/` | Preset-name resolution, resource validation and staged delivery |

`npm run package:skill` copies canonical runtime source and fonts into `skills/mindbox/assets/runtime/`. These generated copies **are committed** because Skills installers copy the Skill folder and do not run the repository build. Edit `src/`, not these copies, then regenerate before a PR. The resource manifest contains SHA256 digests; it detects drift, not malicious tampering or visual quality.

`npm run check:package` checks canonical/resource parity and runs a real render. Tests compare the same input across all 16 presets byte-for-byte. This makes the website and installed Skill share behavior rather than maintaining parallel implementations.

## Generated files

`dist/`, `outputs/`, development artifacts and `src/player.html` are ignored. The latter is a runnable preview generated from `src/player.template.html`; the unfilled template is never a user deliverable. Build recreates the template site, 16 deep examples, 16 audience-matched showcases and legacy compatibility pages. The generated showcase directory is recreated so retired files cannot leak into the next staged site. Old study-notes and lesson URLs preserve their content with the current renderer. `npm run stage:site` copies only the public site assets into `dist/site/`, excluding bulk compatibility exports.

## Low-context generation

An ordinary Skill request loads the short entrypoint, writes content and invokes one renderer command. The model does not reproduce CSS, SVG design, media encoding or UI logic. Detailed style/maintenance references are conditional. HTML includes only the selected style's required fonts plus Chinese fallback. This reduces repeated authoring; it is not a measured claim about Token savings or end-to-end response speed.

## Maintenance contracts

- Fixed preset/recipe IDs keep their meanings even when display order changes.
- Only 16 complete presets are recommended; component-composition logic remains internal for compatibility and future library work.
- Deep styling and measurement share the same policy so text bounds match rendered nodes.
- Source data is escaped into boot JSON and SVG text; imported HTML is read as data, never executed by the CLI.
- Failed validation does not replace output. Handled replacement failures restore previous paired files. Concurrent writers and crash recovery are outside that guarantee.
- No runtime networking or hidden update service. Model access belongs to the host assistant.

Future Agent/MCP adapters should call the same content/render contract, but are not implemented or advertised as working in this release.
