# Release Process

`@abofs/code-conventions` is published to npm via GitHub Actions using the shared `abofs/stonyx-workflows` reusable workflow.

## Publishing

### Automated (push to main)

Pushing to `main` triggers the publish workflow which auto-publishes a prerelease version.

### Manual Release

1. Go to **Actions** → **Publish** → **Run workflow**
2. Select version type: `patch`, `minor`, or `major` (or enter a custom version)
3. The workflow bumps `package.json`, publishes to npm with provenance, and creates a git tag

### Pre-publish Checklist

- [ ] `pnpm test` passes (eslint + prettier self-check)
- [ ] `npm pack --dry-run` shows only intended files
- [ ] `npm audit` has no new high/critical vulnerabilities in peer deps
- [ ] Consuming projects tested with the new version

## Versioning

- Follows semver
- Breaking changes to config rules = major bump
- New rule additions = minor bump
- Rule config tweaks / bug fixes = patch bump

## npm

- Package: `@abofs/code-conventions`
- Registry: https://www.npmjs.com/package/@abofs/code-conventions
- Provenance: enabled (`publishConfig.provenance: true`)
