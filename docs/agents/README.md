# SME Roster — code-conventions

Defines which SME roles are active for this repo's sprint cycle work. Each role inherits from a base template in `beatrix-shared/docs/framework/templates/agents/` and adds code-conventions-specific context.

## Active Roles

| Role | Template | Justification |
|------|----------|---------------|
| **Architect** | [architect.md](architect.md) | Convention design, ESLint flat config architecture, cross-project applicability, Ember Polaris pattern enforcement |
| **QA + Validation Loop** | [qa-validation.md](qa-validation.md) | Lint rule testing, config validation, cross-project compatibility, pre-commit hook verification |

## Hat-Wearing

- **QA + Validation Loop** is a hat combo per framework rules
- **Architect** also covers Product concerns (convention changes are design decisions that affect all consumers)
- No dedicated Frontend Engineer — Ember-specific rules are architectural decisions, not UI work

## When to Re-evaluate

- When TypeScript migration adds `.ts`/`.tsx` rule sets (may need a dedicated TypeScript specialist)
- When Rust formatting rules grow beyond basic rustfmt (may need a Rust specialist)
- When more than 10 consumer projects exist (may need a dedicated Integration/Compatibility specialist)
- When accessibility rules require WCAG expertise beyond current scope (may need an Accessibility specialist)
