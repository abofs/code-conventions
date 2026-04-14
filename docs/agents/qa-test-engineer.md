# SME Template: QA/Test Engineer — Code Conventions

> **Inherits from:** `beatrix-shared/docs/framework/templates/agents/qa-test-engineer.md`
> Load the base template first, then layer this project-specific context on top.

## Project Context

**Repo:** `abofs/code-conventions`
**Package:** `@abofs/code-conventions` (npm, public, scoped)
**Purpose:** Shared lint and format configurations for all abofs projects

This package has no application logic. "Testing" means verifying that lint rules and config exports behave correctly and do not break consuming projects.

## Test Infrastructure

| What | How |
|------|-----|
| Self-lint | `pnpm test` runs `eslint . && prettier --check .` against the package's own source |
| No unit test framework | There is no QUnit/Jest/Vitest — the package validates itself by linting its own config files |
| CI | GitHub Actions workflows in `.github/workflows/` |

## Key Patterns

### Rule Correctness

- **No false positives** — a new or changed rule must not flag code that is intentionally allowed across abofs projects. Before promoting a rule to `error`, verify it passes against representative code from consuming projects.
- **No false negatives** — a rule meant to catch a pattern must actually catch it. Write sample violating code and confirm the rule fires.
- **Test file relaxations** — rules may be relaxed for test files (`**/test/**`, `**/tests/**`, `**/*-test.*`). Verify that test-specific overrides only apply to test globs, not production code.

### Config Export Verification

- **Named exports** — each config is exported via `package.json` `exports` map (e.g., `@abofs/code-conventions/eslint`). Verify that imports resolve correctly in a consuming project context.
- **Flat config array shape** — ESLint configs export arrays of config objects. Confirm the array can be spread into a consumer's `eslint.config.js` without errors.
- **Prettier config shape** — the Prettier export must be a plain object (not an array, not a function). Consumers reference it via `"prettier": "@abofs/code-conventions/prettier"` in `package.json`.
- **Template-lint config shape** — must be a plain object with `extends` and `rules` keys that can be spread.

### Compatibility Checks

- **Peer dependency ranges** — verify the config works with both the minimum and maximum versions of peer dependencies (e.g., ESLint 9 and ESLint 10, globals 16 and 17).
- **Optional peer absence** — when optional peers (ember-eslint-parser, eslint-plugin-ember, etc.) are not installed, the base `eslint` and `prettier` configs must still load without errors.
- **Layered config ordering** — for Ember projects, `eslint-ember` must come before `eslint` base. Verify that reversing the order causes incorrect rule precedence.

### Regression Scenarios

- **WarpDrive restrictions** — `no-restricted-globals` (fetch) and `no-restricted-imports` (ember-data) must fire in Ember config but not in base config.
- **TypeScript override** — `@typescript-eslint/no-unused-vars` must be active for `.ts` files but disabled for `.js` files (where base `no-unused-vars` applies instead).
- **Ignored paths** — `node_modules/`, `dist/`, `coverage/`, `declarations/`, `blueprints/` must all be ignored and not produce lint errors.

## Live Knowledge

- The `ember/template-indent` rule is disabled due to an upstream crash. If someone re-enables it, the config will break on `.gts` files with valueless HTML attributes (e.g., `data-test-*`). This is a known regression test case.
- `no-empty` allows empty catch blocks (`allowEmptyCatch: true`). This is intentional — do not flag it as a gap.
- The package lints itself with its own config (`eslint.config.js` in the repo root). Any rule change that violates the package's own code will cause `pnpm test` to fail, which serves as a built-in smoke test.
