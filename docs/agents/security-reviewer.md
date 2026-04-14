# SME Template: Security Reviewer — Code Conventions

> **Inherits from:** `beatrix-shared/docs/framework/templates/agents/security-reviewer.md`
> Load the base template first, then layer this project-specific context on top.

## Project Context

**Repo:** `abofs/code-conventions`
**Package:** `@abofs/code-conventions` (npm, public, scoped)
**Purpose:** Shared lint and format configurations published to npm

This is a publicly published npm package. Security review focuses on what gets published, dependency supply chain, and ensuring the package does not leak sensitive files.

## Key Patterns

### npm Publish Security

- **Explicit `files` allowlist** — `package.json` uses a `files` array to enumerate exactly which files are included in the published tarball. This is the primary security boundary.
- **Current allowlist:** `eslint.config.js`, `eslint-ember.config.js`, `template-lint.config.js`, `prettier.config.js`, `lint-staged.config.js`, `scripts/setup-husky.js`, `README.md`
- **`.npmignore` as defense-in-depth** — excludes `.git/`, `.github/`, `.claude/`, `docs/`, `node_modules/`, `pnpm-lock.yaml`, `test/`, `scripts/` (beyond what `files` includes), and log files.
- **Both gates must agree** — if `files` is present, npm uses it as the allowlist. `.npmignore` provides a second layer in case `files` is accidentally removed or set to a wildcard.

### Past Incident: `files: ["*"]` Leak

A previous abofs package (`stonyx-cron`) shipped with `files: ["*"]` in `package.json`, which caused `.git/` directory contents (including full commit history) to be published to npm. This is the canonical cautionary tale for this project:

- **Never use `files: ["*"]`** or any glob that could match dotfiles/directories.
- **Never remove the `files` field** — falling back to `.npmignore`-only is less safe.
- **Review every PR that modifies `package.json`** for changes to the `files` array.
- **Run `npm pack --dry-run`** before any publish to verify the tarball contents.

### No Secrets in Published Package

- `.env` and `.npmrc` are in `.gitignore` — they should never reach the repo, let alone npm.
- `docs/`, `.claude/`, and `.github/` are excluded from the publish via both `files` allowlist and `.npmignore`.
- Config files contain no secrets — they are pure rule definitions with no tokens, keys, or credentials.

### Dependency Supply Chain

- **Zero runtime dependencies** — the package has no `dependencies` field. All tooling is specified as `peerDependencies` (required or optional), meaning the consuming project controls the exact versions installed.
- **Minimal dev dependencies** — only `@eslint/js`, `eslint`, `globals`, `prettier`, and `typescript-eslint` for self-linting.
- **Provenance attestation** — `publishConfig.provenance: true` enables npm provenance, linking published versions to their source commit and CI workflow. Verify this remains enabled.
- **Lock file** — `pnpm-lock.yaml` pins dev dependency versions but is excluded from the published package.

### Publish Configuration

- **Public access** — `publishConfig.access: "public"` (correct for a scoped package that should be publicly available).
- **Provenance** — `publishConfig.provenance: true` (requires publishing from a CI environment with OIDC support).
- **No `prepublishOnly` script** — there is no build step. The published files are the source files. This simplifies the supply chain but means any code in the published files runs as-is in consuming projects.

## Live Knowledge

- The `setup-husky.js` script writes files to the consuming project's filesystem (`writeFileSync`, `mkdirSync`, `chmodSync`). It is a bin entry point (`code-conventions-setup`). Review any changes to this script carefully — it executes in the consumer's repo with the consumer's permissions.
- The `scripts/` directory is listed in `.npmignore` but `scripts/setup-husky.js` is explicitly included via the `files` allowlist. This is intentional — the bin script must ship, but other potential future scripts in that directory should not.
- Apache-2.0 license. Verify the `LICENSE` file stays in sync with the `license` field in `package.json`.
