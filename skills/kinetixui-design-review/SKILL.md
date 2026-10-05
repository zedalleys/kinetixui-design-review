---
name: kinetixui-design-review
description: Framework-neutral, repository-aware, evidence-based review of design-system implementation quality, published by KinetixUI and usable in projects that do not use KinetixUI. Discovers a project's capabilities and builds a System Model (tokens, components, blocks, themes, icons, motion, RTL, accessibility, docs, platforms), then audits against the project's own rules, classing findings as DEFECT, INCONSISTENCY, RISK or OPPORTUNITY with stated evidence, confidence and verification level. Inspection adapters cover web, React, Angular, Vue, Svelte, Web Components, SwiftUI, Jetpack Compose and Flutter. Use to review, audit or fix a component, block, tokens, theme, icons, motion, accessibility, RTL, responsive/zoom, docs truth, cross-platform parity or release readiness. Modes - audit, fix, component, block, tokens, theme, icons, motion, accessibility, rtl, docs, cross-platform, release. Optional project profiles. Not a linter, visual-polish prompt or accessibility scanner.
license: MIT
---

# KinetixUI Design Review

Published by KinetixUI; **framework-neutral and independent of the KinetixUI design system** (a KinetixUI profile exists only as a labelled reference example). Answers one question: **what does high-quality implementation of *this* design system mean, and does the current implementation satisfy it?**

Method, always in this order: **DISCOVER → UNDERSTAND → AUDIT → FIX → VERIFY.**
Never REDESIGN → JUSTIFY. `FIX` runs only in `fix` mode.

| Phase | Produces |
|---|---|
| DISCOVER | Repository truth, **capability discovery** (what this review can do here), detected platforms/adapters, applicable profile |
| UNDERSTAND | **System Model**, real user/developer need |
| AUDIT | Findings, each with a **class**, evidence, confidence and verification level |
| FIX | (`fix` mode only) confirmed defects fixed at the shared root cause |
| VERIFY | Re-check at the strongest available **verification level**; state degraded states and limitations |

## Ground rules

1. **Discovery before assumptions.** Do not assume React, Tailwind, an 8px grid, a particular icon set, RTL support, or multiple platforms. Find out.
2. **Project rules beat generic rules.** Judge against the project's own tokens, scale, contracts and stated intent. Generic guidance fills gaps only.
3. **Evidence over opinion.** Label claims FACT / OBSERVATION / INFERENCE / RECOMMENDATION, and give each finding its source, **confidence**, **verification level (V0–V4)** and coverage (`references/verification.md`). Never present inference as repository truth. Never claim verification you did not perform.
4. **Don't inflate, don't mislabel.** Class every finding as DEFECT, INCONSISTENCY, RISK or OPPORTUNITY (`references/finding-classes.md`); use the severity model in `references/severity.md` where it applies. Intentional, disclosed trade-offs are evaluated, not reported as oversights.
5. **Scale to scope.** A single-component review is not a 40-section report. Pick relevant dimensions.
6. **Privacy.** Work locally. Do not upload repository contents to external services. No telemetry.
7. **Don't modify outside the task.** `audit` and all review modes are read-only. Only `fix` edits files, and only confirmed defects.

## Step 0 — Parse the request

Determine **mode(s)** and **scope** (one component? a block? the whole library? a PR?). Modes compose (e.g. `component` + `accessibility` + `rtl`).

Default references per mode (load more if a finding needs them): `tokens` → tokens; `theme` → color-theming (+ tokens); `icons` → icons; `motion` → motion; `accessibility` → accessibility (+ responsive for zoom); `rtl` → rtl-directionality, and preview-isolation whenever previews/demos or a docs shell are in scope; `docs` → documentation; `cross-platform` → cross-platform; `block` → blocks-composition; `release` → verification, severity.

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
- **platforms and frameworks detected → the inspection adapters to load** (below)
- **an applicable project profile** (below)

### Capability discovery (required)

Probe what this review can do here — source read, VCS state, runnable project gates, browser/runtime, dev server, platform toolchains, write permission — read-only, and record a short **Capability table** (`references/capability-discovery.md`). Capabilities set each dimension's **verification ceiling** and the review's **state**: FULL, DEGRADED, SOURCE-ONLY or BLOCKED (`references/verification.md`). Never install tooling in a read-only review.

### Inspection adapters

For each platform actually detected, load its adapter from `references/adapters/` (`web`, `react`, `angular`, `vue`, `svelte`, `web-components`, `swiftui`, `jetpack-compose`, `flutter`). An adapter says how to detect, locate, inspect and verify on that platform; it supplies *mechanics*, not design opinions, and several can apply at once. Judge each platform by its own idioms. Never load or review an adapter for a platform you did not detect. For an undetected-adapter framework, apply the `web` adapter plus the closest idioms and say so.

Prefer the project's own scripts/gates over inventing checks. Do not copy volatile facts (component counts) into the report as constants — read them now and say they are as-of-now.

### Profiles

A profile is a Markdown file in this skill's `profiles/` tree: project-specific invariants, discovery locations, regression scenarios — classified **ESTABLISHED / PROVISIONAL / AUDIT QUESTION**. Load one only when the user names it or when repository evidence clearly matches the profile's detection section. Without a profile, run the generic core — which is the normal case. To add one, see `profiles/README.md`. Profiles never loosen evidence requirements.

**Reference profile.** `profiles/reference/kinetixui-design-system.md` is a *reference example* for the KinetixUI design system (the publisher's own project). It is not part of the core, is never loaded for other projects, and the core never depends on it.

**Path note:** `references/` and `profiles/` paths are relative to *this skill's directory* (the base directory shown when the skill loads), **not** the repository under review. Read them from there.

A profile's regression scenarios are checks to run *when applicable*. "No scenario applies to this scope" is a valid result; do not stretch one to fit. A profile rule that the repository itself contradicts (for example a documented, deliberate design) is reported as a **rule conflict** for the owner to adjudicate — see `references/severity.md`.

## Step 2 — UNDERSTAND: System Model and need

Build the **System Model** (`references/system-model.md`): layers, contracts (promised vs implemented), pipelines, state authority, platforms, gates and what each proves, decisions/rules, and capabilities. Scale it to scope; write `unknown` or `not investigated` rather than guessing. Findings are judged against this model's contracts, not generic taste.

For UI/product-facing work state **REAL USER NEED**: what is the user trying to accomplish? Do this *before* discussing styling.
For design-system APIs state **DEVELOPER NEED**: what should the consuming developer reliably accomplish?

For complex product surfaces, apply a light simplification sequence — **REMOVE → AUTOMATE → COMBINE → DEFAULT → DEFER → CLARIFY → REDESIGN** — and, if the Pascal `simplify-product` skill is installed, recommend running it alongside for major workflow/product simplification (see Integration). This skill stays responsible for implementation correctness.

## Step 3 — AUDIT

Choose dimensions by scope; load only the references you need (progressive disclosure). Starting points when the user gave no dimensions:

| Scope | Load at minimum |
|---|---|
| Interactive component (button, select, dialog) | `component-api`, `accessibility`, `tokens`, `state-fidelity`; add `rtl-directionality` if it has direction-dependent layout or overlays, `icons` if it has icons, `motion` if it animates |
| Display/composite component (card, table, chart) | `tokens`, `responsive`, `spatial-quality`, `accessibility`; `rtl-directionality` for layout |
| Block / composed experience | `blocks-composition` + the references it names |
| Stateful device/domain widget | `state-fidelity`, `spatial-quality`, `accessibility`, demo truthfulness |
| Docs page / preview infrastructure | `preview-isolation`, `documentation`, `rtl-directionality`, `color-theming` (isolation) |
| Multi-platform claim | `cross-platform` (+ `verification`) and the references for any finding you report |
| Release | `verification`, `severity`, `documentation`, `cross-platform` |

Always load `finding-classes` and `severity` before writing findings, and the adapter for each platform you report on.

If you report a finding in a dimension whose reference you did not load, load it first.

The full list:

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
| System Model | `references/system-model.md` |
| Capability discovery | `references/capability-discovery.md` |
| Evidence, confidence, verification levels, degraded states, negative controls | `references/verification.md` |
| Finding classes | `references/finding-classes.md` |
| Severity and verdicts | `references/severity.md` |
| Platform inspection mechanics | `references/adapters/<platform>.md` |

**Classify what you are reviewing** by role, not folder: package primitive, block, preview infrastructure, or demo/showcase code. Showcase code is not public API, but it *is* governed by state fidelity, demo truthfulness and isolation, because evaluators judge the system by it.

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

**The verdict must follow the findings** (`references/severity.md`): FAIL requires at least one P0/P1 DEFECT or INCONSISTENCY; P2/P3-only reports are PASS or PASS WITH NOTES. RISKs ("P1 if confirmed") count as P2 for the verdict; OPPORTUNITIES never affect it. If you feel a FAIL is warranted, a finding must justify P1 on evidence — raise the finding, not the verdict.

Open the report with the review **state** (FULL / DEGRADED / SOURCE-ONLY; see `references/verification.md`). For a **small scope**, collapse to: Verdict · State · Scope · key Findings · Recommendations · Limitations (≈1 page). For a **broad audit or release**, use the full structure:

```
## Verdict            PASS | PASS WITH NOTES | FAIL   (release: READY | READY WITH NOTES | NOT READY)
## State              FULL | DEGRADED | SOURCE-ONLY  (+ capability table: what was and was not available)
## Scope              exactly what was reviewed and how it was sampled
## System Model       discovered layers, contracts, pipelines, gates (FACT/INFERENCE; "unknown" is valid)
## Evidence           commands run, runtime checks, files read — with verification levels reached
## Findings           grouped by class (DEFECT, INCONSISTENCY, RISK, OPPORTUNITY); each line:
                      [CLASS · severity · evidence-label · confidence · level] title · location ·
                      contract/standard or condition · root-cause layer
## Root causes        for meaningful findings
## Platform status    only applicable platforms; stage per platform (DEFINED→VERIFIED) and adapter used
## Accessibility / RTL / Theme / Responsive   results, only if relevant
## Tests              existing + added/proposed
## Recommendations    prioritized; confirming checks for RISKs first
## Limitations        everything not verified, and why
```

Omit empty sections. Never say "all components verified" unless all were; state exact coverage. Keep OPPORTUNITIES short and last.

## Fix mode

1. **Audit first.** Report confirmed defects before touching code.
2. Fix **confirmed** defects only, at the **shared root cause**; preserve backward compatibility.
3. Add **regression tests** (project's test style) and update docs/examples that describe the changed behavior.
4. Run the relevant project gates; report results honestly (including failures and anything not run).
5. **No broad redesign.** If a **breaking change** looks necessary: **STOP → explain → propose a migration**, unless the user explicitly authorized breaking changes.
6. For high-value gates, consider a **negative control** (`references/verification.md`): inject the known failure temporarily, prove the gate catches it, restore, confirm clean. Never commit sabotage.
7. Do not commit, push, or open PRs unless the user asked.

## Read-only discipline and running gates

`audit` and every review mode must leave the repository as it was found. Running the project's own gates is encouraged **only if it is safe**; see "Gate safety" in `references/verification.md` (no installs, no generators that write into the tree, record `git status` before/after, and say which gates you did **not** run and why). Unrun gates are Limitations, not silent omissions.

## Release mode

Evaluate: unresolved P0/P1 (and RISKs that would be P0/P1 if confirmed) · API compatibility/changelog · test status (what ran, what did not) · documentation truth · accessibility · platform-coverage **claims vs. evidence** · build/CI · known limitations disclosed. Return **READY / READY WITH NOTES / NOT READY** with the blocking items. **Green CI is an input, not the verdict.**

## Anti-patterns to resist

These may contain part of a solution but never substitute for evidence: "Looks fine." · "Use more padding." · "Make it modern." · "Add animation." · "Use 8px everywhere." · "All platforms should look identical." · "Use this icon library everywhere." · "Every color should be a token." · "Every component needs every possible slot." · "Green CI means ready." · "One screenshot proves responsive quality." · "ARIA makes it accessible." · "Dark mode is just inverted light mode." · "RTL means flip everything." · "Unlocked means open."

## Integration with Pascal `simplify-product` (optional)

If a skill named `simplify-product` is available, **recommend** it (do not require it) for product/workflow questions: cognitive load, defaults, progressive disclosure, simplifying a flow or screen. This skill owns: component architecture, tokens, theming, accessibility, RTL, state fidelity, responsive quality, platform parity, API quality, verification. If it is not installed, use the lightweight sequence in Step 2. Do not duplicate its methodology.

## Rule lifecycle

Rules in this skill and in profiles move: **AUDIT QUESTION → PROVISIONAL → ESTABLISHED**, and become ESTABLISHED only with support from standards, platform guidance, repository architecture, repeated empirical findings, or an explicit project decision. Don't promote a personal preference to law. When your review surfaces an unresolved opinion, report it as an audit question.

## Limits of this skill

It does not replace linters, automated accessibility scanners, visual regression tools, or human judgment, and it does not guarantee accessibility or correctness. It structures *what to look at and how to prove it*.
