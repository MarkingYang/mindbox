# Mindbox.ink website implementation plan

> Implementation proceeds directly in this session under the user's request to build and optimize the site. Preserve the existing renderer and Skill APIs.

**Goal:** Establish the supplied navy/blue Mindbox identity and a static, style-first Skill showcase for mindbox.ink.

**Architecture:** Keep the vanilla site and production SVG renderer. Public website assets are staged separately from the standalone reader; canonical sources and generated Skill resources stay aligned.

**Tech stack:** HTML, CSS, vanilla browser JavaScript, Node build scripts, GitHub Pages Actions.

- [x] Add a vector web interpretation of the supplied mark, favicon, sharing image and site metadata. Keep this branding out of generated standalone reader content.
- [x] Refine the hero around a direct value statement and real same-content style switching. Keep the16 UID/name mappings, task gallery, previews and install/update commands.
- [x] Add actual reader examples and a concise explanation of editing, reading guidance, PNG/WebP output and offline HTML. Link GitHub installation/help without fabricated adoption figures.
- [x] Stage static assets, canonical URL, sitemap, robots and a helpful404. Prepare Pages workflow and document the separate GitHub custom-domain/DNS settings required for mindbox.ink.
- [x] Run build, full tests, Skill install checks and browser checks of hero styles, gallery, copy commands and responsive layout. Save screenshots. Refresh the local Skill package after canonical source changes.

**Review focus:** No template recipe changes; selection keeps source content; assets work at root and repository subpaths; mobile has no horizontal overflow; no claim that domain/DNS or GitHub publication is already live.
