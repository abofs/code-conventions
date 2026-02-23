/**
 * Shared lint-staged configuration for Ember + Rust (Tauri) projects.
 *
 * Usage in consuming project's lint-staged.config.js:
 *   import config from '@abofs/code-conventions/lint-staged';
 *   export default config;
 *
 * File type handlers:
 *   *.ts, *.gts, *.js, *.mjs  → eslint --fix + prettier --write
 *   *.hbs                      → ember-template-lint --fix
 *   *.rs                       → cargo fmt --all (workspace-wide, once per commit)
 *   *.css                      → prettier --write
 *
 * Requirements:
 *   - eslint, prettier, ember-template-lint must be resolvable from the workspace root
 *   - cargo must be on PATH for Rust formatting
 *   - For pnpm monorepos: shamefully-hoist=true in .npmrc, or link-workspace-packages
 */

/** @type {import('lint-staged').Config} */
const config = {
  '**/*.{ts,gts,js,mjs}': ['eslint --fix', 'prettier --write'],
  '**/*.hbs': ['ember-template-lint --fix'],
  '**/*.rs': () => 'cargo fmt --all',
  '**/*.css': ['prettier --write']
};

export default config;
