# Maintainer release checklist

The package version, Skill `version.json` and runtime manifest must agree. This repository is private to npm (`private: true`); no npm package publication is needed for `npx skills add` to install from GitHub.

1. Update `package.json` version and `CHANGELOG.md`; refresh the lockfile with `npm install --package-lock-only`.
2. Run `npm ci`, `npm run check`, and `npm run test:install` from a clean checkout.
3. Review and commit canonical source plus generated `skills/mindbox` resources and `docs/images/overview.svg`.
4. Run `npm run release:assets`; inspect the versioned ZIP, `SHA256SUMS` and `release.json` in `dist/release/`.
5. Push the reviewed commit. Verify a GitHub-source install in a temporary project: `npx skills add MarkingYang/mindbox --skill mindbox --agent codex --copy -y`.
6. Create and push the matching version tag, e.g. `v1.0.0`. The Release workflow validates the tag, runs checks and publishes the ZIP/checksums/manifest with changelog notes.
7. Enable GitHub Pages with **GitHub Actions** as the source, then run **Publish Mindbox website** (also runs for website changes pushed to main). Inspect the repository-subpath URL and a downloaded standalone HTML. For mindbox.ink, complete [the separate custom-domain setup](website.md).

The first public remote installation cannot be validated before the complete Skill has been pushed. Local-path installation uses the same discovery and copying mechanics but is reported separately. Do not call a prepared workflow an already published release or live website.

Before claiming browser export support, check actual PNG decoding and multiple animated WebP frames on the changed reader. The unit suite checks encoding/container behavior; it is not a guarantee for every browser.

## Public source readiness

`npm run check:public` explicitly checks the public root package, installer entry and Skill version against this checkout. It reports `unpublished`, `unavailable`, `version-mismatch`, `invalid` or `ready`. This checks source metadata, not execution of the public install command. After publishing reviewed code, run the actual GitHub npx install in a clean environment before announcing availability. Rendering never runs this network check. Release notes are extracted and validated by `scripts/release-notes.cjs` during release packaging; current bare version headings are supported.
