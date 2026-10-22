# Security

## Supported versions

Maintenance targets the latest published stable release and current `main`. Reports about older versions are welcome with the exact version/commit, but backports are not promised. Before a first public release, local version metadata does not imply a supported public release exists. See [versioning](docs/versioning.md).

## Report privately

Do not post credentials, private documents or an exploitable payload containing personal data in a public issue.

For a vulnerability, use the repository's **Security → Report a vulnerability** private reporting feature if it is enabled. If it is unavailable, open a non-sensitive issue asking the maintainer to enable private reporting; do not include exploit details there.

Include the version, affected command/browser, minimal reproduction and expected impact in a private report. No response-time guarantee or external security audit is claimed.

Mindbox escapes map content and reads imported Mindbox HTML as data in its CLI. The renderer is local and does not execute an imported HTML file. This is not a sandbox for arbitrary third-party HTML: only open generated HTML from a source you trust. Source documents are processed under the host assistant's tool and data settings.
