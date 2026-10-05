---
name: design-system-review
description: Repository-aware, evidence-based review of design-system implementation quality. Discovers a project's actual tokens, components, blocks, themes, icons, motion, RTL, accessibility, docs and platform implementations, then audits them against the project's own rules and real evidence. Use when asked to review, audit or fix a component, block, token architecture, theme, icon system, motion, accessibility, RTL, responsive/zoom behavior, docs truth, cross-platform parity, or release readiness of a design system or component library. Modes - audit, fix, component, block, tokens, theme, icons, motion, accessibility, rtl, docs, cross-platform, release. Optional project profiles (for example kinetixui) add project-specific rules. Not a linter, a visual-polish prompt, or an accessibility scanner.
license: MIT
---

# Design System Review

Answers one question: **what does high-quality implementation of *this* design
system mean, and does the current implementation satisfy it?**

Method, always in this order: **DISCOVER → UNDERSTAND → AUDIT → FIX → VERIFY.**
Never REDESIGN → JUSTIFY. `FIX` runs only in `fix` mode.

## Ground rules

1. **Discovery before assumptions.** Do not assume React, Tailwind, an 8px grid, a particular icon set, RTL support, or multiple platforms. Find out.
2. **Project rules beat generic rules.** Judge against the project's own tokens, scale, contracts and stated intent. Generic guidance fills gaps only.
3. **Evidence over opinion.** Label claims FACT / OBSERVATION / INFERENCE / RECOMMENDATION. Never present inference as repository truth. Never claim verification you did not perform.
4. **Don't inflate.** Use the severity model in `references/severity.md`. Intentional, disclosed trade-offs are evaluated, not reported as oversights.
5. **Scale to scope.** A single-component review is not a 40-section report. Pick relevant dimensions.
6. **Privacy.** Work locally. Do not upload repository contents to external services. No telemetry.
7. **Don't modify outside the task.** `audit` and all review modes are read-only. Only `fix` edits files, and only confirmed defects.

## Step 0 — Parse the request

Determine **mode(s)** and **scope** (one component? a block? the whole library? a PR?). Modes compose (e.g. `component` + `accessibility` + `rtl`).

| Mode | Does |
|---|---|
| `audit` | Inspect and report only (default for vague requests) |
| `fix` | Audit first, then implement confirmed fixes (see Fix mode) |
| `component` | Review one component |
| `block` | Review a composed experience |
| `tokens` | Token architecture and consumption |
| `theme` | Colors, themes, customization UX |
| `icons` | Icon architecture and customization |
| `motion` | Motion and reduced motion |
| `accessibility` | Focused accessibility review |
| `rtl` | Directionality review |
| `docs` | Documentation and API truth |
| `cross-platform` | Parity across *detected* platforms |
| `release` | Is this change/PR ready (READY / READY WITH NOTES / NOT READY) |

Defaults: "Review this component" → general audit with dimensions chosen by what the component *is* (a data table needs responsive + keyboard + a11y; an icon button needs names + target + icon contract). "Do a complete design-system audit" → broad coverage, sampled and explicit about the sample. Ask a question only if the scope is genuinely ambiguous and a wrong guess would waste real work; otherwise state your assumption and proceed.

## Step 1 — DISCOVER (required)

Read, don't guess. Build a **Repository truth** summary with each item labelled FACT or INFERENCE:

- project type; frameworks; **supported platforms** (from package dirs, build files, manifests, CI — see `references/cross-platform.md`)
- package/monorepo structure; public API entry points
- design tokens (source, build step, outputs); theme system; icon system; motion system
- component architecture; block/pattern architecture; manifests/registries/status files
- documentation (site, MDX, Storybook, README); how examples are produced
- testing infrastructure; accessibility tooling; CI gates and project `check:*`/lint scripts relevant to the scope
- contribution rules; existing project-specific instructions (CLAUDE.md, CONTRIBUTING, AGENTS.md, ADRs)
- **an applicable project profile** (below)

Prefer the project's own scripts/gates over inventing checks. Do not copy volatile facts (component counts) into the report as constants — read them now and say they are as-of-now.

### Profiles

A profile is `profiles/<name>.md` in this skill: project-specific invariants, discovery locations, regression scenarios — classified **ESTABLISHED / PROVISIONAL / AUDIT QUESTION**. Load one when the user names it ("use the kinetixui profile") or when repository evidence clearly matches the profile's detection section. Without a profile, run the generic core. To add one, see `profiles/README.md`. Profiles never loosen evidence requirements.

## Step 2 — UNDERSTAND the need

For UI/product-facing work state **REAL USER NEED**: what is the user trying to accomplish? Do this *before* discussing styling.
For design-system APIs state **DEVELOPER NEED**: what should the consuming developer reliably accomplish?

For complex product surfaces, apply a light simplification sequence — **REMOVE → AUTOMATE → COMBINE → DEFAULT → DEFER → CLARIFY → REDESIGN** — and, if the Pascal `simplify-product` skill is installed, recommend running it alongside for major workflow/product simplification (see Integration). This skill stays responsible for implementation correctness.

## Step 3 — AUDIT

Choose dimensions by scope; load only the references you need (progressive disclosure):

| Dimension | Reference |
|---|---|
| Tokens (color, spacing, radius, type, shadow, motion, size, breakpoints, z-index, opacity) | `references/tokens.md` |
| Color, themes, theme customization UX | `references/color-theming.md` |
| Spacing scale + **spatial clearance** (separate audits) | `references/spatial-quality.md` |
| Responsive, 200% zoom, large text | `references/responsive.md` |
| RTL / directionality (site / preview / component / portal) | `references/rtl-directionality.md` |
| **Preview/demo state isolation** (first-class) | `references/preview-isolation.md` |
| Icons | `references/icons.md` |
| Motion, reduced motion | `references/motion.md` |
| State fidelity, demo truthfulness | `references/state-fidelity.md` |
| Accessibility, focus, touch targets | `references/accessibility.md` |
| Component API | `references/component-api.md` |
| Blocks and composition | `references/blocks-composition.md` |
| Documentation / API truth | `references/documentation.md` |
| Cross-platform parity and platform-native review | `references/cross-platform.md` |
| Performance, scalability, complexity | `references/performance-scalability.md` |
| Evidence, verification, negative controls | `references/verification.md` |
| Severity and verdicts | `references/severity.md` |

Order: **structural correctness first** (state, semantics, tokens, API, isolation), **then** visual hierarchy and polish (primary action, typography, density, grouping, borders, radius, shadow, icon optical balance). Do not fix architecture problems with polish.

### Root-cause hierarchy

When a defect is found, ask where it lives and fix at the **highest appropriate shared layer**:
1 canonical token → 2 theme → 3 shared primitive → 4 component → 5 preview infrastructure → 6 block composition → 7 documentation → 8 demo-only code.
Don't create abstractions where only one legitimate case exists. Report one root cause once with all affected sites.

### Cross-cutting questions

- Does a defect in one place indicate a *class* of defect? Sample to size it, and say how you sampled.
- If another component / theme / platform / state were added, would this scale? (`performance-scalability.md`)
- Is each claim in the docs/manifest backed by implementation and tests?

## Step 4 — Report (scale to scope)

For a **small scope**, collapse to: Verdict · Scope · key Findings (with evidence labels) · Recommendations · Limitations. For a **broad audit or release**, use the full structure:

```
## Verdict            PASS | PASS WITH NOTES | FAIL   (release: READY | READY WITH NOTES | NOT READY)
## Scope              exactly what was reviewed and how it was sampled
## Repository truth   discovered architecture (FACT/INFERENCE)
## Evidence           commands run, runtime checks, files read
## Findings           P0 / P1 / P2 / P3 — each: title · evidence label · location · why it matters · root-cause layer
## Root causes        for meaningful defects
## Platform status    only applicable platforms; stage per platform (DEFINED→VERIFIED)
## Accessibility      result (if relevant)
## RTL                result (if relevant)
## Theme              result (if relevant)
## Responsive/scaling result (if relevant)
## Tests              existing + added/proposed
## Recommendations    prioritized
## Limitations        everything not verified, and why
```

Omit empty sections. Never say "all components verified" unless all were; state exact coverage.

## Fix mode

1. **Audit first.** Report confirmed defects before touching code.
2. Fix **confirmed** defects only, at the **shared root cause**; preserve backward compatibility.
3. Add **regression tests** (project's test style) and update docs/examples that describe the changed behavior.
4. Run the relevant project gates; report results honestly (including failures and anything not run).
5. **No broad redesign.** If a **breaking change** looks necessary: **STOP → explain → propose a migration**, unless the user explicitly authorized breaking changes.
6. For high-value gates, consider a **negative control** (`references/verification.md`): inject the known failure temporarily, prove the gate catches it, restore, confirm clean. Never commit sabotage.
7. Do not commit, push, or open PRs unless the user asked.

## Release mode

Evaluate: unresolved P0/P1 · API compatibility/changelog · test status (what ran, what did not) · documentation truth · accessibility · platform-coverage **claims vs. evidence** · build/CI · known limitations disclosed. Return **READY / READY WITH NOTES / NOT READY** with the blocking items. **Green CI is an input, not the verdict.**

## Anti-patterns to resist

These may contain part of a solution but never substitute for evidence: "Looks fine." · "Use more padding." · "Make it modern." · "Add animation." · "Use 8px everywhere." · "All platforms should look identical." · "Use this icon library everywhere." · "Every color should be a token." · "Every component needs every possible slot." · "Green CI means ready." · "One screenshot proves responsive quality." · "ARIA makes it accessible." · "Dark mode is just inverted light mode." · "RTL means flip everything." · "Unlocked means open."

## Integration with Pascal `simplify-product` (optional)

If a skill named `simplify-product` is available, **recommend** it (do not require it) for product/workflow questions: cognitive load, defaults, progressive disclosure, simplifying a flow or screen. This skill owns: component architecture, tokens, theming, accessibility, RTL, state fidelity, responsive quality, platform parity, API quality, verification. If it is not installed, use the lightweight sequence in Step 2. Do not duplicate its methodology.

## Rule lifecycle

Rules in this skill and in profiles move: **AUDIT QUESTION → PROVISIONAL → ESTABLISHED**, and become ESTABLISHED only with support from standards, platform guidance, repository architecture, repeated empirical findings, or an explicit project decision. Don't promote a personal preference to law. When your review surfaces an unresolved opinion, report it as an audit question.

## Limits of this skill

It does not replace linters, automated accessibility scanners, visual regression tools, or human judgment, and it does not guarantee accessibility or correctness. It structures *what to look at and how to prove it*.
