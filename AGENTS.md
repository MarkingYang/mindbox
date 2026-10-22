# Working on Mindbox

- This release is Skill-first. Dedicated Agent and MCP adapters are phase two.
- Node.js >=22.20. Run `npm ci`, `npm run check`, and `npm run test:install` for package/installation changes.
- `src/` is canonical. `skills/mindbox/assets/runtime/` is generated but committed so a Skill installer needs no build. Regenerate with `npm run package:skill` after canonical runtime changes.
- Preserve all 16 selected preset IDs and recipe meanings. Keep custom component APIs internal and legacy recipes compatible.
- Website, CLI and installed Skill must use the same document builder and renderer; never implement an alternate theme per generated artifact.
- Do not commit `dist/`, `outputs/`, personal paths, private documents or generated bulk exports.
- Keep font licenses intact. Describe actual checks and limitations, not unsupported popularity or speed claims.
- Prefer focused work in this session; do not dispatch subagents unless the user explicitly requests delegation.
