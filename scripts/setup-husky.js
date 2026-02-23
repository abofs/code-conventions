#!/usr/bin/env node
/**
 * Idempotent setup: initializes the husky pre-commit hook in a consuming project.
 *
 * Writes .husky/pre-commit configured to run lint-staged. Safe to run multiple
 * times — always writes the canonical hook content, never accumulates duplicates.
 *
 * Usage:
 *   node node_modules/@abofs/code-conventions/scripts/setup-husky.js
 *   # or via the bin alias:
 *   pnpm exec code-conventions-setup
 */

import { existsSync, mkdirSync, writeFileSync, chmodSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.cwd();
const huskyDir = join(cwd, '.husky');
const preCommitPath = join(huskyDir, 'pre-commit');

const HOOK_CONTENT = 'pnpm lint-staged\n';

if (!existsSync(huskyDir)) {
  mkdirSync(huskyDir, { recursive: true });
}

writeFileSync(preCommitPath, HOOK_CONTENT, 'utf8');
chmodSync(preCommitPath, 0o755);

console.log('✓ Wrote .husky/pre-commit');
console.log('');
console.log('Next steps (if not already done):');
console.log('  1. Add to your root package.json scripts: "prepare": "husky"');
console.log('  2. Add a lint-staged.config.js that imports from @abofs/code-conventions/lint-staged');
console.log('  3. Run pnpm install to initialize husky via the prepare script');
