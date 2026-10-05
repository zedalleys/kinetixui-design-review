# KinetixUI Design Review

**A framework-neutral Claude Code skill for evidence-based design-system reviews.**

Published by [KinetixUI](https://kinetixui.com). It works in projects that **do not use KinetixUI** — the skill's core has no dependency on the KinetixUI design system. A KinetixUI profile ships only as a clearly labelled *reference example*.

Skill ID: `kinetixui-design-review` · Version: **0.1.0** · Current maturity: **INTERNAL DOGFOOD** (see [docs/MATURITY.md](docs/MATURITY.md)).

KinetixUI Design Review gives Claude a methodology for answering one question about your project:

> What does high-quality implementation of *this* design system mean, and does the current implementation satisfy it?

It **discovers** what your repository actually contains and what this review can actually do in your environment, builds a **System Model**, **audits** against your own contracts with explicit evidence, and — only in `fix` mode — changes code.

```text
DISCOVER → UNDERSTAND → AUDIT → FIX → VERIFY
```

| Phase | What happens |
|---|---|
| DISCOVER | Repository truth, **capability discovery** (source read, runnable gates, browser, platform toolchains), detected platforms → **inspection adapters**, applicable profile |
| UNDERSTAND | A **System Model**: layers, contracts (promised vs implemented), pipelines, state authority, gates and what each proves, decisions; the real user or developer need |
| AUDIT | Findings in four **classes** — DEFECT, INCONSISTENCY, RISK, OPPORTUNITY — each with evidence, **confidence** and **verification level** |
| FIX | `fix` mode only: confirmed defects at the shared root cause, with regression tests |
| VERIFY | Re-check at the strongest available level; name **degraded states** and limitations plainly |

## What it does

- Reviews components, blocks, tokens, themes, icons, motion, RTL/LTR, accessibility, responsive behavior and zoom, state fidelity, component APIs, documentation truth, cross-platform parity and release readiness.
- Separates **FACT / OBSERVATION / INFERENCE / RECOMMENDATION**, adds source, confidence, coverage and a **verification level (V0–V4)**, and states whether the review ran **FULL**, **DEGRADED** or **SOURCE-ONLY**.
- Uses finding classes so a preference is never reported as a defect, and an unconfirmed worry is a RISK with a named confirming check.
- Treats **preview/demo state isolation** and **demo truthfulness** as first-class concerns.
- Provides **inspection adapters** for web, React, Angular, Vue, Svelte, Web Components, SwiftUI, Jetpack Compose and Flutter — loaded only for platforms actually detected.
- Supports optional **project profiles** with project-specific invariants.

## What it does not do

- It is **not** a linter, an automated accessibility scanner, a visual-regression tool, or a token/icon/component library. It uses your project's own gates when it is safe to, and does not replace them.
- It is **not** a "make it prettier" prompt. Visual polish is reviewed *after* structural correctness.
- It makes no guarantee of accessibility or correctness. It structures what to look at and how to prove it.
- It does **not** assume React, Tailwind, an 8px grid, RTL support, a particular icon set, or multiple platforms. Discovery comes first.
- It collects no telemetry and uploads nothing. See [SECURITY.md](SECURITY.md).

## Supported project types and adapters

Anything with UI code a reviewer can read: component libraries, UI kits, design-system monorepos, documentation sites, Storybook-style galleries.

| Adapter | Status (see [docs/MATURITY.md](docs/MATURITY.md)) |
|---|---|
| web, React, Angular, SwiftUI, Jetpack Compose, Flutter | written; the platforms were reviewed source-only on one reference project (before the adapters existed); adapters themselves not yet exercised |
| Vue, Svelte, Web Components | written; Vue has one small fixture; Svelte and Web Components untested |

Adapters carry *inspection mechanics*, not design opinions. **Not validated beyond one reference project** — expect rough edges on other stacks.

## How discovery works

In DISCOVER the skill reads package structure, manifests/registries, token sources and build steps, theme and icon systems, docs, tests, CI gates, contribution rules and project instructions; probes capabilities read-only; and writes a **Repository truth** summary and a **Capability table**. It then judges the code against *your* rules — your spacing scale, your tokens, your declared platforms — and uses generic guidance only to fill gaps.

## Installation

Verified against Claude Code 2.1.289 with its real CLI. Pick one.

### Option A — Plugin via marketplace (recommended)

This repository is both a plugin and a one-plugin marketplace (`.claude-plugin/`).

```bash
# Add the marketplace. A local checkout path was tested; a GitHub "owner/repo" source is supported
# by `claude plugin marketplace add` but could not be tested before this repository is published.
claude plugin marketplace add <path-to-this-repo-or-owner/kinetixui-design-review>

# Install (user scope by default; --scope project|local also exist)
claude plugin install kinetixui-design-review@kinetixui-design-review
```

Inside a running session the equivalents are `/plugin marketplace add <source>` and `/plugin install kinetixui-design-review@kinetixui-design-review`, then `/reload-plugins` (documented by Claude Code; the CLI forms above are the ones tested here).

Invoke it as `/kinetixui-design-review:kinetixui-design-review` (plugin skills are namespaced), or just ask in plain language — Claude can load it automatically based on its description.

### Option B — Project-local skill (no plugin)

```bash
mkdir -p .claude/skills
cp -r <this-repo>/skills/kinetixui-design-review .claude/skills/
```

It then appears as `/kinetixui-design-review`. Copying to `~/.claude/skills/` is the documented user-level location; that path was **not** tested here.

### Option C — Try without installing

```bash
claude --plugin-dir <path-to-this-repo>
```

### Verify that Claude sees it

```bash
claude plugin list                                  # kinetixui-design-review@kinetixui-design-review, enabled
claude plugin details kinetixui-design-review       # component inventory + token cost
```

Or ask Claude: *"Which skills do you have that contain 'kinetixui-design-review'?"*

### Update and uninstall

```bash
claude plugin marketplace update kinetixui-design-review
claude plugin update kinetixui-design-review@kinetixui-design-review

claude plugin uninstall kinetixui-design-review@kinetixui-design-review
claude plugin marketplace remove kinetixui-design-review
```

Option B: re-copy the folder to update; delete it to remove.

### If you installed the earlier working name

Earlier local builds used the name `design-system-review`. It is a different plugin identity: uninstall it (`claude plugin uninstall design-system-review@design-system-review`, `claude plugin marketplace remove design-system-review`) and install the new one. The old name is not published and not maintained.

## Usage

```text
Use kinetixui-design-review to audit our Button component.
Use kinetixui-design-review in fix mode on our Select.
Audit our component library for RTL state leakage.
Review our color/theme architecture.
Review our icon customization architecture.
Audit this dashboard block at 200% zoom.
Run a cross-platform review of Select.
Use release mode on this PR.
Use the KinetixUI reference profile to review Fields.   # only in a KinetixUI project
```

A small review returns about a page: **Verdict · State · Scope · Findings · Recommendations · Limitations**. A broad audit or release review adds System Model, Evidence, Root causes, Platform status and per-dimension results. Illustrative examples are in [examples/](examples/).

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

## Finding classes, evidence and verification levels

| Class | Meaning | Severity |
|---|---|---|
| DEFECT | Violates a stated contract, rule or standard | P0–P3 |
| INCONSISTENCY | Two parts disagree; the project has not said which is right | usually P2 |
| RISK | Plausible failure under a named condition ("P1 if confirmed") | conditional |
| OPPORTUNITY | Improvement no rule requires | none (value/effort) |

Verification levels: **V0** unverified claim · **V1** source read · **V2** a gate/test you ran · **V3** runtime-observed · **V4** cross-checked. Calculations from source are INFERENCE (computed) until measured. Details: [`verification.md`](skills/kinetixui-design-review/references/verification.md), [`finding-classes.md`](skills/kinetixui-design-review/references/finding-classes.md).

## Project profiles

A profile carries project-specific knowledge — detection, where truth lives, rules tagged **ESTABLISHED / PROVISIONAL / AUDIT QUESTION**, regression scenarios and gates. It never replaces discovery and never loosens evidence requirements. Adding one requires no change to the core: see [`profiles/README.md`](skills/kinetixui-design-review/profiles/README.md).

`profiles/reference/kinetixui-design-system.md` is a **reference example** for the KinetixUI design system. It is not part of the core and is never loaded for other projects.

### Rule lifecycle

```text
AUDIT QUESTION  →  PROVISIONAL RULE  →  ESTABLISHED RULE
```

A rule becomes ESTABLISHED only with support from standards, platform guidance, repository architecture, repeated empirical findings, or an explicit project decision.

## Pascal `simplify-product` integration (optional)

If Pascal's `simplify-product` skill is installed, this skill recommends running it alongside for product/workflow simplification. Responsibilities stay separate: Pascal simplifies *what the product asks of people*; this skill checks *whether the design system implements things correctly*. No dependency; no Pascal content is copied here. The integration is not tested with both skills loaded in one session.

## Validation in this repository

```bash
node tests/validate.mjs            # static checks + `claude plugin validate --strict` (no dependencies)
node tests/run-fixtures.mjs        # runs the skill on methodology fixtures via `claude -p` (uses API credits)
```

Fixtures live in `tests/fixtures/`; `tests/RUBRIC.md` is the manual rubric. Results: [docs/DOGFOODING.md](docs/DOGFOODING.md). Maturity criteria and current evidence: [docs/MATURITY.md](docs/MATURITY.md).

## Maturity

**INTERNAL DOGFOOD.** Usable, exercised on one reference project (read-only) and small fixtures; not validated externally. It will stay at this level until external validation supports changing it — criteria are in [docs/MATURITY.md](docs/MATURITY.md). Not recommended for public announcement.

## Roadmap, contributing, license

[ROADMAP.md](ROADMAP.md) (no dates) · [CONTRIBUTING.md](CONTRIBUTING.md) · [MIT](LICENSE).
