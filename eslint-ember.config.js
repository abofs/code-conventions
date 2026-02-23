/**
 * Shared Ember ESLint flat config for abofs projects.
 *
 * Provides eslint-plugin-ember recommended rules + ember-eslint-parser for
 * .gjs/.gts (template-tag) files. Designed to be layered WITH the base
 * eslint config — the base config should come AFTER this one so its rules
 * take precedence:
 *
 *   import emberConfigs from '@abofs/code-conventions/eslint-ember';
 *   import baseConfigs  from '@abofs/code-conventions/eslint';
 *   export default [...emberConfigs, ...baseConfigs, { ...projectOverrides }];
 *
 * This ordering means:
 *   1. Ember plugin rules (recommended) are applied first
 *   2. Our base JS/TS rules override where there's overlap
 *   3. Project-specific overrides win last
 */

import { base, gjs, gts } from 'eslint-plugin-ember/recommended';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
const configs = [
  // ── Ember recommended for JS/TS files ──
  base,

  // ── GJS (template-tag JavaScript) ──
  {
    ...gjs,
    languageOptions: {
      ...gjs.languageOptions,
      globals: {
        ...globals.browser
      }
    }
  },

  // ── GTS (template-tag TypeScript) ──
  {
    ...gts,
    languageOptions: {
      ...gts.languageOptions,
      globals: {
        ...globals.browser
      }
    }
  },

  // ── Polaris-specific rule overrides ──
  // These go beyond "recommended" to enforce modern Ember patterns
  // and discourage deprecated / pre-Polaris patterns.
  {
    files: ['**/*.{js,ts,gjs,gts}'],
    rules: {
      // --- Enforce Glimmer / Polaris patterns ---
      'ember/no-classic-classes': 'error', // No Ember.extend() — use native classes
      'ember/no-classic-components': 'error', // No classic components — use Glimmer
      'ember/no-component-lifecycle-hooks': 'error', // No didInsertElement etc. — use modifiers
      'ember/no-actions-hash': 'error', // No actions: {} — use @action decorator
      'ember/no-mixins': 'error', // Mixins are deprecated
      'ember/no-new-mixins': 'error', // Don't create new mixins
      'ember/no-observers': 'error', // Observers are deprecated — use @tracked
      'ember/require-tagless-components': 'error', // No wrapper elements

      // --- Computed properties → @tracked ---
      'ember/no-computed-properties-in-native-classes': 'error', // Use @tracked, not computed()
      'ember/no-get': 'error', // Use native getters, not this.get()
      'ember/no-get-with-default': 'error', // Deprecated

      // --- Deprecation guards ---
      'ember/no-array-prototype-extensions': 'error', // No Ember array extensions
      'ember/no-string-prototype-extensions': 'error', // No Ember string extensions
      'ember/no-function-prototype-extensions': 'error',
      'ember/no-at-ember-render-modifiers': 'error', // Use proper modifiers
      'ember/no-implicit-injections': 'error', // Explicitly inject services
      'ember/no-deprecated-router-transition-methods': 'error', // Use router service

      // --- Controllers ---
      'ember/no-controllers': 'warn', // Discourage controllers (use route models + components)

      // --- Ember Data / Warp Drive ---
      'ember/use-ember-data-rfc-395-imports': 'error', // Use @ember-data/ imports

      // --- Template rules (via ember-eslint-parser in gjs/gts) ---
      // DISABLED: ember/template-indent crashes on .gts files with valueless
      // HTML attributes (e.g. data-test-*). The rule wraps ESLint's core
      // indent rule which throws "Cannot read properties of null (reading
      // 'range')" on JSXAttribute nodes without values. No upstream fix
      // available (12.7.5 is latest). Re-enable when patched.
      // Tracking: eslint-plugin-ember + ESLint 9.x indent rule interaction
      'ember/template-indent': 'off'
    }
  },

  // ── Test file relaxations ──
  {
    files: ['**/tests/**/*.{js,ts,gjs,gts}', '**/*-test.{js,ts,gjs,gts}'],
    rules: {
      'ember/no-controllers': 'off'
    }
  },

  // ── Ignore patterns ──
  {
    ignores: ['node_modules/**', 'dist/**', 'declarations/**', 'blueprints/**']
  }
];

export default configs;
