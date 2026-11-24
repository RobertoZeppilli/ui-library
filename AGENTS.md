# ui-library

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`RobertoZeppilli/ui-library`), via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Changesets

Every PR that touches `src/` or `themes/` includes a changeset (`pnpm changeset`), written in English. CI fails otherwise; docs/CI-only PRs are exempt.

## tai

```json
{ "dev": "pnpm exec storybook dev --port {porta} --host {host} --ci" }
```
