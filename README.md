# @abofs/code-conventions

Shared ESLint and Prettier configurations for all abofs projects. This is the single source of truth for code style — projects import these configs rather than defining their own.

## Installation

```bash
npm install --save-dev @abofs/code-conventions
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
