/**
 * Shared ESLint flat config for abofs projects.
 *
 * Usage in consumer projects:
 *   // eslint.config.js
 *   import configs from '@abofs/code-conventions/eslint';
 *   export default [...configs];
 *
 * Or with project-specific overrides:
 *   export default [...configs, { rules: { ... } }];
 */

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
const configs = [
  // Base recommended rules
  js.configs.recommended,

  // TypeScript support (also works on JS files)
  ...tseslint.configs.recommended,

  // Global settings
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2025,
        QUnit: 'readonly'
      }
    }
  },

  // JavaScript files
  {
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      // ----- Code quality -----
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' }],
      'no-console': 'off', // console is used extensively for logging
      'no-constant-condition': ['error', { checkLoops: false }], // allow while(true)
      'no-empty': ['error', { allowEmptyCatch: true }], // empty catch blocks are used
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-var': 'error',

      // ----- Style (enforced by ESLint, not Prettier) -----
      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'], // braces required for multi-line, optional for single-line
      'no-throw-literal': 'error',
      'prefer-template': 'off', // codebase uses both template literals and concatenation

      // ----- Import conventions -----
      'no-duplicate-imports': 'error',

      // ----- Class conventions -----
      'no-useless-constructor': 'error',
      'class-methods-use-this': 'off', // many class methods reference instance indirectly

      // ----- Async -----
      'no-async-promise-executor': 'error',
      'require-await': 'off', // some async functions intentionally lack await

      // ----- Disable TS rules for JS files -----
      '@typescript-eslint/no-unused-vars': 'off', // use base no-unused-vars instead
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  },

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.mts'],
    rules: {
      'no-unused-vars': 'off', // TS handles this
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },

  // Test files — relaxed rules
  {
    files: ['**/test/**/*.js', '**/*-test.js', '**/*.test.js'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^(module|test)$' }],
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  },

  // Ignore patterns
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**']
  }
];

export default configs;
