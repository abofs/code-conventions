/**
 * Shared ember-template-lint configuration for abofs projects.
 *
 * Usage — in your project's .template-lintrc.js:
 *
 *   import config from '@abofs/code-conventions/template-lint';
 *   export default { ...config, rules: { ...config.rules, ...overrides } };
 *
 * Or if your project uses CJS:
 *
 *   const config = require('@abofs/code-conventions/template-lint');
 *   module.exports = { ...config, rules: { ...config.rules } };
 *
 * This starts from ember-template-lint's "recommended" preset and adds
 * Polaris-specific rules that enforce modern Ember patterns.
 */

/** @type {import('ember-template-lint').Config} */
const config = {
  extends: 'recommended',

  rules: {
    // ── Polaris / Modern Ember enforcements ──

    // Disallow {{action}} modifier — use native event handlers or @action
    'no-action': 'error',

    // Disallow built-in form components ({{input}}, {{textarea}}) — use native HTML
    'no-builtin-form-components': 'error',

    // Disallow curly component invocation — use angle bracket syntax: <MyComponent />
    'no-curly-component-invocation': 'error',

    // Disallow implicit this — all values must be prefixed (this.foo, @foo)
    'no-implicit-this': 'error',

    // Disallow array prototype extensions in templates
    'no-array-prototype-extensions': 'error',

    // Disallow @ember/render-modifiers — use proper modifiers
    'no-at-ember-render-modifiers': 'error',

    // Disallow {{partial}} — deprecated
    'no-partial': 'error',

    // Disallow {{mut}} helper — use actions for state updates
    'no-mut-helper': 'error',

    // Disallow element event actions (onclick={{action ...}}) — use {{on}} modifier
    'no-element-event-actions': 'error',

    // Disallow {{action}} on submit buttons
    'no-action-on-submit-button': 'error',

    // Disallow route-action helper
    'no-route-action': 'error',

    // ── Accessibility (beyond recommended) ──

    // Require href attributes on links
    'link-href-attributes': 'error',

    // No inline styles — use classes
    'no-inline-styles': 'error',

    // ── Code quality ──

    // Disallow unused block params
    'no-unused-block-params': 'error',

    // Disallow {{debugger}}
    'no-debugger': 'error',

    // Disallow {{log}}
    'no-log': 'error',

    // Disallow triple curlies {{{ }}} (unescaped HTML)
    'no-triple-curlies': 'error',

    // Disallow HTML comments (use Handlebars comments)
    'no-html-comments': 'error',

    // No duplicate attributes
    'no-duplicate-attributes': 'error',

    // No bare strings (i18n readiness) — warn for now, projects can escalate to error
    'no-bare-strings': 'warn',

    // Disallow {{yield}} in non-block components that use only default slot
    'no-only-default-slot': 'off',

    // Stylistic — block indentation (2 spaces, matching our Prettier config)
    'block-indentation': 2,

    // Self-closing void elements — disabled; Prettier formats void elements
    // as self-closing (<br />) which conflicts with the 'error' setting.
    'self-closing-void-elements': false,

    // Require valid link text for accessibility
    'no-invalid-link-text': 'error'
  },

  // Ignore generated / build artifacts
  ignore: ['blueprints/**', 'dist/**', 'node_modules/**']
};

export default config;
