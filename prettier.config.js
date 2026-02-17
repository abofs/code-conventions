/**
 * Shared Prettier configuration for abofs projects.
 *
 * Usage in consumer projects:
 *   // package.json
 *   "prettier": "@abofs/code-conventions/prettier"
 *
 *   // or prettier.config.js
 *   import config from '@abofs/code-conventions/prettier';
 *   export default config;
 */

/** @type {import("prettier").Config} */
const config = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'none',
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf'
};

export default config;
