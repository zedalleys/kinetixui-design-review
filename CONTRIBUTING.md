# Contributing

Thanks for helping make design-system reviews more reliable. The goal is **fewer false positives and fewer arbitrary opinions**, not more rules.

## What you can contribute

- **New checks** for an existing reference (`skills/kinetixui-design-review/references/`).
- **Platform guidance** and **adapters** (`references/adapters/`): a new framework adapter must follow the adapter contract in `references/adapters/README.md` and say honestly whether it has been exercised.
- **Project profiles** (`skills/kinetixui-design-review/profiles/<project>.md`) — no core edit needed; follow `profiles/README.md`.
- **Fixtures** (`tests/fixtures/`) and expectations.
- **Documentation** and examples.
- **False-positive fixes** — the most valuable kind of PR. Include the review output that was wrong.

## Requirements for a new *universal* rule

A rule in the core (not a profile) must state, in the PR description and in the reference file:

1. **Evidence** — standards, platform guidance, repository architecture, repeated empirical findings (with examples), or an explicit decision.
2. **Applicability** — which projects/platforms it applies to, and how the skill *discovers* that it applies.
3. **Exceptions** — when violating it is justified; how the skill recognizes that.
4. **Platform implications** — what it means on each platform, or why it is web-only.
5. **Severity guidance** — consistent with `references/severity.md`.

Rules that cannot meet this bar belong in a profile as PROVISIONAL or AUDIT QUESTION. A rule becomes ESTABLISHED only by the lifecycle in the README.

## Style of the methodology

- Discover, don't assume. No hard-coded values ("8px", a specific icon library, a specific framework) in the core.
- Keep `SKILL.md` lean; put detail in `references/` (they load on demand).
- No volatile facts (counts, maturity labels) anywhere — say how to read them.
- No project names in `references/` (including adapters). Project-specific content goes in a profile. The core must stay independent of the KinetixUI design system; only the labelled reference profile may describe it.
- Do not add marketing claims; `tests/validate.mjs` bans a few phrases.

## Workflow

```bash
node tests/validate.mjs          # must pass
node tests/run-fixtures.mjs      # optional; uses API credits; attach notable outputs
```

If you change behavior, add or update a fixture and its expectation. If you change `SKILL.md`'s description, keep it under 1,536 characters (Claude Code's documented limit). Add a `CHANGELOG.md` entry.

## Do not

- Copy content from other skill packages or proprietary material.
- Add telemetry, network calls, or anything that uploads repository contents.
- Commit `tests/results/`.
