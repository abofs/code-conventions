# @abofs/code-conventions

Shared ESLint, Prettier, and Ember linting configurations for all abofs projects. This is the single source of truth for code style — projects import these configs rather than defining their own.

## Installation

```bash
npm install --save-dev @abofs/code-conventions
```

This package declares its ESLint/Prettier/template-lint dependencies as **peer dependencies**. Your project must install them directly:

```bash
npm install --save-dev eslint @eslint/js typescript-eslint globals prettier
# For Ember projects:
npm install --save-dev eslint-plugin-ember ember-eslint-parser ember-template-lint
# For projects using QUnit:
npm install --save-dev eslint-plugin-qunit
```

## Usage

### Prettier

In your `package.json`:

```json
{
  "prettier": "@abofs/code-conventions/prettier"
}
```

Or in `prettier.config.js`:

```js
import config from '@abofs/code-conventions/prettier';
export default config;
```

### ESLint

In your `eslint.config.js`:

```js
import configs from '@abofs/code-conventions/eslint';
export default [...configs];
```

With project-specific overrides:

```js
import configs from '@abofs/code-conventions/eslint';
export default [...configs, { rules: { 'no-console': 'warn' } }];
```

### Ember ESLint (for Ember Polaris projects)

For Ember projects using the Polaris paradigm (template-tag components, `.gjs`/`.gts` files):

```js
// eslint.config.js
import emberConfigs from '@abofs/code-conventions/eslint-ember';
import baseConfigs from '@abofs/code-conventions/eslint';
export default [
  ...emberConfigs,
  ...baseConfigs,
  {
    /* project overrides */
  }
];
```

**Layering order matters:** Ember configs go first, then base configs (so base JS/TS rules take precedence where they overlap), then project overrides win last.

What it includes:

- `eslint-plugin-ember` recommended rules for `.js`, `.ts`, `.gjs`, `.gts`
- `ember-eslint-parser` for template-tag (`<template>`) syntax in `.gjs`/`.gts` files
- Polaris-specific rules that enforce modern patterns and disallow deprecated APIs

### Ember Template Lint

For Handlebars template linting (both standalone `.hbs` and as a companion to ESLint):

```js
// .template-lintrc.js
import config from '@abofs/code-conventions/template-lint';
export default config;
```

With project overrides:

```js
import config from '@abofs/code-conventions/template-lint';
export default {
  ...config,
  rules: {
    ...config.rules,
    'no-bare-strings': 'error' // escalate from warn to error
  }
};
```

What it includes:

- `ember-template-lint` recommended preset as base
- Polaris rules: no `{{action}}`, no curly invocation, no implicit this, no `{{mut}}`
- Accessibility rules enabled
- `no-bare-strings` set to `warn` (i18n readiness — escalate when ready)
- Block indentation set to 2 spaces (matching Prettier config)

---

## Pre-commit Hooks (husky + lint-staged)

Enforce formatting and linting automatically on every commit. Solves unformatted code reaching the repo.

### Install

```bash
pnpm add -D husky lint-staged
```

### Setup

1. **Add a `prepare` script** to your root `package.json`:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

2. **Create `lint-staged.config.js`** at the workspace root:

```js
import config from '@abofs/code-conventions/lint-staged';
export default config;
```

3. **Initialize the hook** (one-time, idempotent):

```bash
pnpm exec code-conventions-setup
```

This writes `.husky/pre-commit` with:

```sh
pnpm lint-staged
```

4. **Run `pnpm install`** to let the `prepare` script initialize husky:

```bash
pnpm install
```

### What the hook enforces

| Files                            | Action                              |
| -------------------------------- | ----------------------------------- |
| `*.ts`, `*.gts`, `*.js`, `*.mjs` | `eslint --fix` + `prettier --write` |
| `*.hbs`                          | `ember-template-lint --fix`         |
| `*.rs`                           | `cargo fmt --all` (workspace-wide)  |
| `*.css`                          | `prettier --write`                  |

### Requirements

- For pnpm monorepos: `shamefully-hoist=true` in `.npmrc` so that `eslint`, `prettier`, and `ember-template-lint` are resolvable from the workspace root.
- `cargo` on `PATH` for Rust formatting.
- The hook is idempotent — running `pnpm exec code-conventions-setup` again safely overwrites with the same content.

### Project-level overrides

To extend or narrow the shared config:

```js
// lint-staged.config.js
import baseConfig from '@abofs/code-conventions/lint-staged';

export default {
  ...baseConfig,
  '**/*.graphql': ['prettier --write']
};
```

---

## Ember Polaris Conventions

> Our Ember projects follow the **Polaris** paradigm (Ember v6+). This section documents
> the modern patterns we enforce and the deprecated patterns we disallow.

### Template-Tag Components (.gjs / .gts)

Polaris introduces **First-Class Component Templates** — components are authored in `.gjs` (JavaScript) or `.gts` (TypeScript) files using the `<template>` tag:

```gjs
// app/components/greeting.gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Greeting extends Component {
  @tracked name = 'world';

  <template>
    <h1>Hello, {{this.name}}!</h1>
  </template>
}
```

Template-only components are even simpler:

```gjs
// app/components/badge.gjs
<template>
  <span class="badge">{{@label}}</span>
</template>
```

### Reactivity Model

- Use `@tracked` for reactive state — **not** computed properties
- No `this.get()` / `this.set()` — use native property access
- No observers — derive state from tracked properties
- No computed property macros in native classes

### What's Deprecated (and linted against)

| Deprecated Pattern                            | Modern Replacement                         |
| --------------------------------------------- | ------------------------------------------ |
| `Ember.extend()` / classic classes            | Native ES classes                          |
| Classic components (`@ember/component`)       | Glimmer components (`@glimmer/component`)  |
| `{{action}}` modifier                         | `{{on}}` modifier + `@action` decorator    |
| `this.get()` / `this.set()`                   | Native property access with `@tracked`     |
| Computed properties                           | `@tracked` + getters                       |
| Mixins                                        | Utilities, decorators, or composition      |
| Observers                                     | Derived state from `@tracked`              |
| `{{input}}` / `{{textarea}}`                  | Native `<input>` / `<textarea>`            |
| Curly component invocation `{{my-component}}` | Angle brackets `<MyComponent />`           |
| Implicit `this` in templates                  | Explicit `this.` or `@` prefix             |
| `@ember/render-modifiers`                     | Custom modifiers or `ember-modifier`       |
| `ember-data` imports                          | `@ember-data/` scoped imports (Warp Drive) |

### Warp Drive (formerly Ember Data)

Ember Data has been rebranded as **Warp Drive**. Use `@ember-data/` scoped package imports. The linting enforces RFC 395 import paths.

### Services & Routing

- Explicitly inject all services with `@service` — no implicit injections
- Use `RouterService` for transitions — not `this.transitionTo()` on routes/controllers
- Controllers are discouraged (`no-controllers: warn`) — prefer passing data through route models and component args

---

## Code Conventions Reference

> This section is the authoritative reference for code style across all abofs projects.
> It is written for both humans and AI agents working on the codebase.

All conventions below were derived from the Stonyx ecosystem codebase (the reference implementation).

### Module System

- **ESM only** — all projects use `"type": "module"` in package.json
- **No CommonJS** — no `require()`, no `module.exports`

### Formatting

| Rule            | Value               | Notes                                                  |
| --------------- | ------------------- | ------------------------------------------------------ |
| Indentation     | 2 spaces            | No tabs                                                |
| Quotes          | Single quotes (`'`) | Double quotes appear rarely, single is dominant        |
| Semicolons      | Always              | Every statement ends with `;`                          |
| Trailing commas | None                | No trailing commas in objects, arrays, or parameters   |
| Print width     | 120                 | Lines can be long; complex expressions may exceed this |
| Arrow parens    | Avoid               | `x => x` not `(x) => x`; parens only when required     |
| Bracket spacing | Yes                 | `{ a, b }` not `{a, b}`                                |
| End of line     | LF                  | Unix line endings                                      |

### Import / Export Patterns

- **Default exports** for classes: `export default class Foo { }`
- **Named exports** for utility functions: `export function doThing() { }`
- **Mixed exports** are common — a default class plus named helpers in the same file
- **Relative imports** always include `.js` extension: `import Foo from './foo.js';`
- **Package imports** use bare specifiers: `import express from 'express';`
- **Scoped imports** use subpath exports: `import { get } from '@stonyx/utils/object';`
- **Destructured QUnit** at top of test files: `const { module, test } = QUnit;`
- **Import order** (not strictly enforced but conventional):
  1. Third-party packages
  2. Framework/internal packages (`stonyx/*`, `@stonyx/*`)
  3. Relative imports (`./`, `../`)

### Naming Conventions

| Type             | Convention                  | Examples                                                    |
| ---------------- | --------------------------- | ----------------------------------------------------------- |
| Files (source)   | kebab-case                  | `min-heap.js`, `rest-server.js`, `query-builder.js`         |
| Files (test)     | kebab-case + `-test` suffix | `cron-test.js`, `string-test.js`                            |
| Classes          | PascalCase                  | `Stonyx`, `MinHeap`, `RestServer`, `Orm`                    |
| Functions        | camelCase                   | `loadModules`, `createFile`, `getTimestamp`                 |
| Variables        | camelCase                   | `modulePromises`, `rootPackage`, `filePath`                 |
| Constants        | camelCase or UPPER_SNAKE    | `defaultOptions` (object), `METHODS` (Set)                  |
| Static props     | camelCase                   | `static initialized = false`, `static instance = null`      |
| Private/internal | No prefix                   | No `_` prefix convention; internal APIs are just unexported |

### Class Patterns

- **Singleton pattern** is extremely common: constructor checks `ClassName.instance` and returns it
- **Static class properties** for shared state: `static initialized = false`
- **Static getters** for guarded access: `static get log() { if (!initialized) throw ... }`
- **`init()` method** for async initialization (constructors can't be async)
- **Instance properties** declared directly in constructor or as class fields: `jobs = {}`
- **No private fields** (`#field`) — not used anywhere in the codebase

### Function Patterns

- **`async/await`** everywhere — no raw `.then()` chains
- **Default parameters**: `function foo(options={})` (no space before `=`)
- **Destructuring in loops**: `for (const [key, value] of Object.entries(obj))`
- **Error handling**: `try/catch` blocks, empty catch allowed for optional operations: `catch { /* no .env file */ }`
- **Arrow functions** for short callbacks: `.map(x => x.name)`, `.filter(m => m.startsWith('@'))`
- **`Array.from(set).map()`** pattern for iterating Sets

### Testing Patterns (QUnit)

- **Framework**: QUnit for test structure, sinon for mocking/stubbing
- **File structure**: `test/unit/<name>-test.js` for unit tests, `test/integration/` for integration
- **Module declaration**: `module('[Unit] ComponentName', function() { ... })`
  - Module names use bracket prefix: `[Unit]`, `[Integration]`
  - Pipe separator for sub-categories: `[Unit] Utils | camelCaseToKebabCase`
- **Test declaration**: `test('descriptive lowercase string', function(assert) { ... })`
- **Assertions**:
  - `assert.strictEqual(actual, expected)` — primary equality check
  - `assert.equal(actual, expected)` — also used (loose equality)
  - `assert.ok(value, message)` — truthiness
  - `assert.notEqual(a, b)` — inequality
  - Optional message parameter: `assert.equal(x, y, 'explanation')`
- **Hooks**: `hooks.beforeEach()` and `hooks.afterEach()` for setup/teardown
- **Nested modules**: `module('parent', function() { module('child', function() { ... }) })`
- **Async tests**: `test('name', async function(assert) { ... })`
- **No `this` context** — use closure variables, not QUnit's `this`
- **No hardcoded delays** — tests MUST NOT use `delay()`, `setTimeout()`, `sleep()`, or fixed-duration promises to wait for async state. A hardcoded delay is a race condition by design — there is no "safe" delay value. Use deterministic gates instead: manually-controlled promises, test waiters, or event-driven assertions. If you need to observe an intermediate state (e.g., loading UI), hold the async operation with a promise the test controls and release it explicitly after asserting.

### Error Handling

- **Custom errors**: `throw new Error('descriptive message')`
- **Guard clauses**: Check preconditions early and throw
- **Error wrapping**: `catch (error) { throw new Error(error); }` (wraps to normalize stack)
- **Console warnings**: `console.warn()` for non-fatal issues
- **Error logging**: `console.error()` or framework `log.error()`

### Project Structure

```
project/
├── config/
│   └── environment.js      # Default configuration export
├── src/
│   ├── main.js             # Main entry point / primary class
│   ├── cli.js              # CLI entry (if applicable)
│   ├── exports/            # Public API re-exports
│   └── ...                 # Feature modules
├── test/
│   ├── unit/               # Unit tests (*-test.js)
│   ├── integration/        # Integration tests
│   ├── config/
│   │   └── environment.js  # Test environment overrides
│   └── sample/             # Test fixtures and sample data
├── scripts/                # Build/setup scripts
└── package.json
```

### package.json Conventions

- `"type": "module"` — always
- `"exports"` map for all public entry points (subpath exports)
- `"publishConfig": { "access": "public", "provenance": true }`
- `"prepublishOnly": "npm test"` — test before publish
- QUnit and sinon in `devDependencies`
- Apache-2.0 license

### License Headers

Source files in core repos include an Apache 2.0 license header comment block at the top (multi-line `/* */` style). Test files typically omit the header.

### Miscellaneous

- **`process.loadEnvFile()`** used in CLI entry points (Node.js built-in)
- **`import.meta.url`** not widely used but supported
- **Template literals** for string interpolation with expressions: `` `${tag} - ${text}:` ``
- **Spread operator** used extensively: `{ ...defaults, ...overrides }`
- **Optional chaining**: `config.cron?.log`, `modulePackage?.keywords`
- **Nullish patterns**: empty catch `catch {}`, optional callback checks
- **`setTimeout(..., 0)`** for deferring to next tick
- **Map and Set** used for collections (not just plain objects)
