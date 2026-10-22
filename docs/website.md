# Mindbox.ink / 官网托管

Mindbox's website is a static Skill introduction and16-style showcase. The interactive SVG examples use the production renderer. No hosted model or paid account is required; material interpretation is supplied by the user's existing assistant. Agent/MCP adapters remain phase two.

## Deployment status · 2026-10-22

GitHub Pages is enabled with GitHub Actions. The [first deployment](https://github.com/MarkingYang/mindbox/actions/runs/39633938973) passed the build, tests and deployment. The website is available over HTTPS at [markingyang.github.io/mindbox](https://markingyang.github.io/mindbox/).

The repository's custom domain is now `mindbox.ink`. Its DNSPod configuration has two apex A records (`185.199.108.153`, `185.199.109.153`) and a `www` CNAME to `markingyang.github.io`. These three records are sufficient: GitHub Pages requires at least one valid apex A record; the four-address configuration below is the fuller recommended setup, not a requirement to buy a larger DNS plan.

Public DNS returned the configured records. `http://mindbox.ink/` returned the Mindbox homepage with HTTP 200, and `http://www.mindbox.ink/` returned a 301 redirect to the apex. The GitHub Pages address also redirects to the custom domain. HTTPS remains pending: GitHub reports no certificate yet, and an attempt to enable HTTPS was rejected with `The certificate does not exist yet`. Do not treat domain binding or HTTP success as completed HTTPS setup. Recheck issuance before enabling Enforce HTTPS or changing public links to the HTTPS domain.

## Local preview

```bash
npm ci
npm run check
npm run stage:site
npm run dev -- --port 4174
```

The server serves `dist`; open `/site/index.html`. Publish **only `dist/site`**, not the whole compatibility archive. Brand assets and links are relative so the main website works under a GitHub repository subpath as well as a custom domain. Canonical/social URLs and sitemap target `https://mindbox.ink/`.

## GitHub Pages

1. Push the complete reviewed repository, including generated `skills/mindbox/assets/runtime` resources.
2. Repository **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Run **Publish Mindbox website**, or push website changes to `main`. The workflow builds, checks and publishes `dist/site`.
4. Verify the deployment at the URL returned by GitHub Actions. Local build success is not a hosted deployment result.

The workflow checks whether Pages is configured first. An unconfigured repository skips website build/deployment with a notice, so the first source/Skill release does not fail because a separate website has not been enabled. Other API errors still fail visibly. This workflow does not enable Pages or change the custom domain automatically.

## Bind mindbox.ink

First verify the domain under the GitHub account's **Settings → Pages** if available, using the exact TXT record GitHub provides. Then set the repository's **Settings → Pages → Custom domain** to `mindbox.ink` before changing DNS.

At your domain provider, choose either apex `ALIAS`/`ANAME` pointing to `markingyang.github.io`, if supported, or these GitHub Pages A records:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | markingyang.github.io |

Do not include `/mindbox` in the DNS target. Once GitHub's DNS check and certificate issuance finish, enable **Enforce HTTPS**. Verify both apex and `www` behavior.

`src/site-public/CNAME` is copied to the static output for hosts that use it. **GitHub Actions Pages deployments ignore CNAME files**: the repository's Custom domain setting is still required. Writing this file does not bind the domain or change DNS.

Reference: [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). DNS propagation can take up to24 hours. Review existing records before replacing any; this build does not modify DNS or GitHub settings.

## Website maintenance

- Complete tryout and downloads: `scripts/reader-assets.cjs` splits the canonical reader into `downloads/reader-shell.html` and licensed font metadata in `downloads/reader-fonts.json`. The homepage's asset URLs carry a content key. `src/reader-export.cjs` fetches the small shell and only the chosen style's existing WOFF2 URLs, reusing the browser's font cache and sharing in-flight requests. It embeds those fonts before binding the final HTML; rendering/editing/export stay in `src/player.*`, and the downloaded file remains offline. The old all-font `reader-template.html` is retained for already-open v1.0.0 pages.
- Reproducible proof page and synthetic fixtures: `scripts/quality.cjs` → `quality/index.html` and `report.json`. This is structural coverage, not browser coverage.
- Main copy/sections: `src/index.html`; brand layout: `src/site.css`.
- Original production style demos and homepage style switching: `src/landing.cjs`.
- Logo, icons and sharing image: `assets/brand/`.
- Domain, crawler metadata, browser manifest and404: `src/site-public/`.
- Style identities: append-only registry in `src/library.cjs`; see [style IDs](style-ids.md).

Keep generated reader pages focused on the mind map. Website branding, promotional sections and analytics must not leak into generated reader content. The website has no analytics or invented adoption counters.
