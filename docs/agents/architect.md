# SME Template: Architect — Code Conventions

> **Inherits from:** `beatrix-shared/docs/framework/templates/agents/architect.md`
> Load the base template first, then layer this project-specific context on top.

## Project Context

**Repo:** `abofs/code-conventions`
**Package:** `@abofs/code-conventions` (npm, public, scoped)
**Purpose:** Shared ESLint, Prettier, ember-template-lint, and lint-staged configurations consumed by all abofs projects
**Version:** `0.3.1-beta.0` (pre-1.0 — API may still evolve)

This is an infrastructure package. Every rule change propagates to every consuming project. Treat changes with the same gravity as a framework API change.

## Package Structure

| File | Export Path | Purpose |
|------|-------------|---------|
| `eslint.config.js` | `@abofs/code-conventions/eslint` | ESLint flat config (JS + TS) |
| `eslint-ember.config.js` | `@abofs/code-conventions/eslint-ember` | Ember/Glimmer ESLint rules (Polaris patterns) |
| `prettier.config.js` | `@abofs/code-conventions/prettier` | Prettier formatting config |
| `template-lint.config.js` | `@abofs/code-conventions/template-lint` | ember-template-lint config |
| `lint-staged.config.js` | `@abofs/code-conventions/lint-staged` | Pre-commit lint-staged config |
| `scripts/setup-husky.js` | `code-conventions-setup` (bin) | Idempotent husky pre-commit hook setup |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Module system | ESM (`"type": "module"`) |
| ESLint | v9/v10 flat config (`eslint.config.js` arrays) |
| TypeScript linting | `typescript-eslint` v8 (peer dep) |
| Ember linting | `eslint-plugin-ember` v12 + `ember-eslint-parser` (optional peers) |
| Template linting | `ember-template-lint` v7 (optional peer) |
| Formatting | Prettier v3 |
| Git hooks | Husky v9 + lint-staged v15 (optional peers) |
| Package manager | pnpm |

## Key Patterns

- **Flat config only** — no `.eslintrc.*` legacy format. Consumers spread the exported array: `export default [...configs]`.
- **Layered Ember config** — `eslint-ember` goes first, then `eslint` base, so base rules win on overlap. Order matters.
- **Peer dependencies** — core tools (eslint, prettier, globals) are required peers; Ember-specific tools are optional peers. This keeps non-Ember projects from needing Ember dependencies.
- **Explicit `files` field** — `package.json` enumerates exactly which files ship to npm. This is a security boundary (see Security Reviewer template).
- **Provenance** — `publishConfig.provenance: true` enables npm provenance attestation on publish.
- **No runtime dependencies** — zero `dependencies`. Everything is a peer or dev dependency.
- **WarpDrive enforcement** — the Ember config bans `fetch()` globally and restricts `ember-data` imports, pushing consumers toward WarpDrive patterns.
- **Test file relaxation** — test files get relaxed rules (unused vars for `module`/`test`, controllers allowed in tests).

## Live Knowledge

- Consuming projects pin a version range (e.g., `^0.3.0`). A new rule set to `error` is a breaking change for any project that currently violates it — coordinate via a version bump and migration notes.
- The `ember/template-indent` rule is intentionally disabled due to a crash with valueless HTML attributes in `.gts` files. Do not re-enable until upstream fixes land.
- `no-restricted-globals` banning `fetch` only applies to Ember config consumers. Node.js backend projects use the base `eslint` config, which does not restrict `fetch`.
- The `setup-husky.js` script writes `.husky/pre-commit` idempotently. It ships as a bin (`code-conventions-setup`) so consumers can run it via `pnpm exec`.
- Prettier settings: 120 char width, single quotes, no trailing commas, LF line endings, no semicolons in arrow parens.
