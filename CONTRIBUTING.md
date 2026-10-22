# Contributing to Mindbox

欢迎参与。The current release focuses on the Skill and the existing 16 styles. Agent services and MCP integrations are phase two; see [ROADMAP](ROADMAP.md).

## Useful contributions

- A reproducible installation, layout, import or export defect.
- A focused improvement to an existing style, with before/after evidence.
- Clearer onboarding or a translation.
- An original real-world example with editable Markdown and sources.

Search existing issues before substantial changes. For a new style or integration, discuss the use case first so the project can maintain a coherent default library. Small documentation fixes can go directly to a PR.

## Develop

Use Node.js 22.20+:

```bash
npm ci
npm run check
npm run test:install
npm run dev
```

The Skill's runtime copies are committed for installation without a build. Edit shared rendering code in `src/`, then run the build/package command; include the updated package resources in your PR. Do not modify only a generated copy. `dist/`, private outputs and development artifacts stay untracked.

## Validate the behavior you changed

- Renderer/layout: exercise the affected styles, deep labels and relevant layouts; add a focused regression when behavior could break.
- Skill/package: test copied installation and a real render outside the source tree.
- Reader: check keyboard access, style switching, invalid edits preserving content, undo/redo and HTML-first continuation and saved HTML.
- Export: download and decode the changed format; changing a filename is not proof of correct encoding.
- Documentation: verify commands and links. Do not claim a platform was tested solely because its folder exists.

Keep fixed IDs and old recipes compatible. Do not change all 16 styles to solve one style's defect. Reviewers need the trigger, intended change, tests actually run and remaining limitations. Visual changes need before/after screenshots or a small reproducible map.

AI assistance is welcome. Review generated changes yourself and describe meaningful assistance in the PR; do not claim tests, user feedback or human review that did not happen.

## Example and privacy boundaries

Only share material you have permission to distribute. Replace private data with a minimal synthetic reproduction and label it as such. Keep factual sources separate from the mindmap code fence. Reference-platform usage figures must never be presented as Mindbox's own adoption.

Contributions are under the repository MIT license unless a file has an existing separate license. Preserve font license notices. Be respectful, specific and constructive in issues and reviews.

## Release identity and licensing

See [versioning](docs/versioning.md) before changing package versions. Include the regenerated Skill and complete package fingerprint; preserve stable style UIDs and recipes. Tests must cover the upgrade/rollback behavior if it changes. Do not overwrite published tags or silently replace release assets.

Keep the root MIT text and individual font notices intact. [License boundaries](docs/licensing.md) distinguish project code, fonts and user source material. Do not add copied assets under the project's license without checking their own source and terms.
