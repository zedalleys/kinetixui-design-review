# Design System Review

**A Claude Code skill for evidence-based design-system reviews.**

Status: **v0.1.0 — internal dogfood.** Usable, but not yet validated beyond one reference project. See [Maturity](#maturity-and-known-limits).

Design System Review gives Claude a methodology for answering one question about your project:

> What does high-quality implementation of *this* design system mean, and does the current implementation satisfy it?

It works by **discovering** your repository's real architecture (tokens, components, blocks, themes, icons, motion, docs, tests, platforms), **understanding** what the project itself claims, **auditing** against those claims with evidence, and only then — in `fix` mode — changing code.

## What it does

- Reviews components, blocks, tokens, themes, icons, motion, RTL/LTR, accessibility, responsive behavior and zoom, state fidelity, component APIs, documentation truth, cross-platform parity and release readiness.
- Separates **FACT**, **OBSERVATION**, **INFERENCE** and **RECOMMENDATION**, and states exactly what was and was not verified.
- Uses a calibrated severity model (P0–P3) and verdicts that follow from findings.
- Treats **preview/demo state isolation** and **demo truthfulness** as first-class concerns, not afterthoughts.
- Is **framework-aware and repository-aware**: it reviews the platforms it finds, and only those.
- Supports optional **project profiles** with project-specific invariants (KinetixUI is the first).

## What it does not do

- It is **not** a linter, an automated accessibility scanner, a visual-regression tool, or a token/icon/component library. It uses your project's own gates when it is safe to, and does not replace them.
- It is **not** a "make it prettier" prompt. Visual polish is reviewed *after* structural correctness.
- It makes no guarantee of accessibility or correctness. It structures what to look at and how to prove it.
- It does **not** assume React, Tailwind, an 8px grid, RTL support, a particular icon set, or multiple platforms. Discovery comes first.
- It collects no telemetry and uploads nothing. See [SECURITY.md](SECURITY.md).

## Supported project types

Anything with UI code a reviewer can read: component libraries, UI kits, design-system monorepos, documentation sites, Storybook-style galleries. Framework-awareness is written as guidance for React, Vue, Svelte, Angular, Web Components, SwiftUI/UIKit, Jetpack Compose/Android Views and Flutter, and the skill is told to discover other frameworks it finds. **Only the KinetixUI repository has been used to validate it so far** (React, Angular, SwiftUI, Compose, Flutter, all through its own manifests); everything else is untested.

## How discovery works

Every review starts with DISCOVER → UNDERSTAND → AUDIT → FIX → VERIFY. In DISCOVER the skill reads package structure, manifests/registries, token sources and build steps, theme and icon systems, docs, tests, CI gates, contribution rules and any project-specific instructions, and writes a **Repository truth** summary with each item marked as fact or inference. It then judges the code against *your* rules — your spacing scale, your tokens, your declared platforms — and uses generic guidance only to fill gaps.

## Installation

Verified against Claude Code 2.1.289 with its real CLI. Pick one.

### Option A — Plugin via marketplace (recommended)

This repository is both a plugin and a one-plugin marketplace (`.claude-plugin/`).

```bash
# Add the marketplace. A local checkout path was tested; a GitHub "owner/repo" source is supported
# by `claude plugin marketplace add` but could not be tested before this repository is published.
claude plugin marketplace add <path-to-this-repo-or-owner/design-system-review>

# Install (user scope by default; --scope project|local also exist)
claude plugin install design-system-review@design-system-review
```

Inside a running session the equivalents are `/plugin marketplace add <source>` and `/plugin install design-system-review@design-system-review`, then `/reload-plugins` (documented by Claude Code; the CLI forms above are the ones tested here).

Invoke it as `/design-system-review:design-system-review` (plugin skills are namespaced), or just ask in plain language — Claude can load it automatically based on its description.

### Option B — Project-local skill (no plugin)

Copy the skill folder into your project; commit it if the team should share it:

```bash
mkdir -p .claude/skills
cp -r <this-repo>/skills/design-system-review .claude/skills/
```

It then appears as `/design-system-review`. (Tested: a session in a project containing this folder lists the skill.) Copying to `~/.claude/skills/` instead is the documented user-level location and applies to all your projects; that path was **not** tested here.

### Option C — Try without installing

```bash
claude --plugin-dir <path-to-this-repo>
```

Loads the plugin for that session only (tested).

### Verify that Claude sees it

```bash
claude plugin list                       # Option A: shows design-system-review@design-system-review, enabled
claude plugin details design-system-review   # component inventory + token cost (skill: ~280 tokens always-on)
```

Or ask Claude: *"Which skills do you have that contain 'design-system'?"* In testing, a session returned `design-system-review:design-system-review` (plugin) or `design-system-review` (project-local).

### Update and uninstall

```bash
claude plugin marketplace update design-system-review
claude plugin update design-system-review@design-system-review

claude plugin uninstall design-system-review@design-system-review
claude plugin marketplace remove design-system-review
```

Option B: re-copy the folder to update; delete it to remove.

## Usage

Use plain language. Name a mode, a project profile and a scope when you can.

```text
Use design-system-review to audit our Button component.
Use design-system-review in fix mode on our Select.
Audit our component library for RTL state leakage.
Review our color/theme architecture.
Review our icon customization architecture.
Audit this dashboard block at 200% zoom.
Run a cross-platform review of Select.
Use release mode on this PR.
Use the KinetixUI profile to review Fields.
```

A small review returns about a page: **Verdict · Scope · Findings (with evidence labels and severity) · Recommendations · Limitations**. A broad audit or release review adds Repository truth, Root causes, Platform status, Accessibility/RTL/Theme/Responsive results and Tests. Worked, illustrative examples are in [examples/](examples/).

## Review modes

| Mode | Purpose |
|---|---|
| `audit` | Inspect and report only (default for vague requests) |
| `fix` | Audit first, then fix **confirmed** defects at the shared root cause, with regression tests; stops and proposes a migration if a breaking change looks necessary |
| `component` · `block` | One component · one composed experience |
| `tokens` · `theme` · `icons` · `motion` | Focused architecture reviews |
| `accessibility` · `rtl` · `docs` | Focused quality reviews |
| `cross-platform` | Parity across *detected* platforms (DEFINED → GENERATED → IMPLEMENTED → CONSUMED → VERIFIED) |
| `release` | READY / READY WITH NOTES / NOT READY — green CI is an input, not the verdict |

Modes compose (for example `component` + `accessibility` + `rtl`).

## Evidence philosophy

- Every meaningful finding has an evidence label and a pointer.
- Visual claims prefer runtime evidence; architecture claims prefer source and tests; cross-platform claims inspect real implementations.
- Calculations from source are **INFERENCE (computed)** until measured. Stated rationales in comments are claims to verify, not facts.
- Read-only reviews follow *gate safety*: no installs, no generators writing into the tree, `git status` before/after, and a plain list of what was *not* run.
- The skill must never claim "all components verified" unless all were. See [`references/verification.md`](skills/design-system-review/references/verification.md).

## Project profiles

A profile (`skills/design-system-review/profiles/<name>.md`) carries project-specific knowledge: how to detect the project, where truth lives, rules classified **ESTABLISHED / PROVISIONAL / AUDIT QUESTION**, regression scenarios and gates. It never replaces discovery and never loosens evidence requirements. Adding one requires no change to the core. See [`profiles/README.md`](skills/design-system-review/profiles/README.md).

**KinetixUI** is the first profile and the first dogfooding target. The core skill does not depend on it.

### Rule lifecycle

```text
AUDIT QUESTION  →  PROVISIONAL RULE  →  ESTABLISHED RULE
```

A rule becomes ESTABLISHED only with support from standards, platform guidance, repository architecture, repeated empirical findings, or an explicit project decision. Personal preference is not a rule.

## Pascal `simplify-product` integration (optional)

If Pascal's `simplify-product` skill is installed, Design System Review recommends running it alongside for product/workflow simplification (cognitive load, defaults, progressive disclosure). Responsibilities stay separate: Pascal simplifies *what the product asks of people*; this skill checks *whether the design system implements things correctly*. There is no dependency; without Pascal, the skill uses a lightweight REMOVE → AUTOMATE → COMBINE → DEFAULT → DEFER → CLARIFY → REDESIGN sequence. No Pascal content is copied here.

## Validation in this repository

```bash
node tests/validate.mjs            # static checks + `claude plugin validate --strict` (no dependencies)
node tests/run-fixtures.mjs        # runs the skill on methodology fixtures via `claude -p` (uses API credits)
```

The fixtures (`tests/fixtures/`) are minimal good/bad/false-positive-control pairs; `tests/RUBRIC.md` is the manual evaluation rubric. Results of the v0.1 validation are in [docs/DOGFOODING.md](docs/DOGFOODING.md).

## Maturity and known limits

v0.1.0 is **internal dogfood**: the methodology is usable and was exercised on KinetixUI (six review types) and on small fixtures, but it has one reference project, runs are non-deterministic, and several areas are guidance rather than tested behavior. Known weak areas are listed in [docs/DOGFOODING.md](docs/DOGFOODING.md#known-weak-areas). Not recommended for public announcement yet.

## Roadmap

No dates. See [ROADMAP.md](ROADMAP.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). New universal rules must state evidence, applicability, exceptions and platform implications.

## License

[MIT](LICENSE). Chosen for maximum reuse; there is no dependency on, and no copied content from, any other skill package.
