# Code Conventions Documentation

`@abofs/code-conventions` — shared ESLint, Prettier, and Ember linting configurations for all abofs projects.

## Key Files

| File                          | Purpose                                            |
| ----------------------------- | -------------------------------------------------- |
| [README.md](../README.md)     | Installation, usage, and full code style reference |
| [docs/release.md](release.md) | Release process (npm publish)                      |

## Config Modules

| Export            | File                      | Description                             |
| ----------------- | ------------------------- | --------------------------------------- |
| `./eslint`        | `eslint.config.js`        | Base ESLint flat config (JS/TS)         |
| `./eslint-ember`  | `eslint-ember.config.js`  | Ember Polaris ESLint config             |
| `./prettier`      | `prettier.config.js`      | Shared Prettier config                  |
| `./template-lint` | `template-lint.config.js` | Shared ember-template-lint config       |
| `./lint-staged`   | `lint-staged.config.js`   | lint-staged config (JS/TS/HBS/Rust/CSS) |

## CLI

| Command                  | Description                            |
| ------------------------ | -------------------------------------- |
| `code-conventions-setup` | Idempotent husky pre-commit hook setup |
