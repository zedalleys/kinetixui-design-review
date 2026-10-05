# System Model

The **System Model** is a compact, evidence-backed description of *how this
design system is supposed to work and how it actually works*. Build it at the end
of DISCOVER and refine it in UNDERSTAND. It is what lets later findings be
judged against the project's own contracts instead of generic taste.

Keep it short (a screen, not a document) and scale it to scope. Every row is
tagged FACT / INFERENCE (see `verification.md`) with a pointer. Unknown is a
valid entry — write `unknown` and what would resolve it.

## Contents

| Part | Question it answers | Typical evidence |
|---|---|---|
| **Layers** | What layers exist between design decisions and rendered UI? (tokens → themes → primitives → components → blocks → docs/preview → consumers) Which exist here, and which are absent? | token sources, theme files, package layout, docs structure |
| **Contracts** | What does the project *promise* (public API, accessibility, RTL, themes, platforms, status labels)? Where is each promise stated? | docs, READMEs, manifests, status files, types, changelog |
| **Implementation reality** | For each promise in scope: is it defined, generated, implemented, consumed, verified? | source, tests, CI (see staged vocabulary in `cross-platform.md`) |
| **Pipelines** | What is generated or derived (tokens → platform outputs, registries, docs, examples)? What must never be hand-edited? Is there a freshness check? | build scripts, generated headers, `--check` modes |
| **State authority** | For stateful things: where does canonical state live, and which representations derive from it? | stores, props, enums, domain types |
| **Platforms & surfaces** | Which platforms/frameworks and which consuming surfaces (docs site, sample apps, galleries) exist? | package manifests, build files, CI |
| **Gates** | Which checks exist (lint, types, tests, contrast, RTL, a11y, grid, parity)? What does each prove, and what does it *not* prove? | scripts, CI config, test names and bodies |
| **Decisions & rules** | Which design decisions, ADRs, contribution rules and profile rules apply? Which are ESTABLISHED / PROVISIONAL / AUDIT QUESTION? | ADRs, CONTRIBUTING, profile files, code comments that state intent |
| **Capabilities** | What can *this review* actually do here? (see `capability-discovery.md`) | tool probes |

## Using the model

1. **Judge against contracts, not taste.** A finding should cite the contract, decision or standard it measures against. If none exists, say so and class it OPPORTUNITY or AUDIT QUESTION rather than DEFECT.
2. **Find the gaps in the model itself.** An unstated contract (e.g. no declared touch-target policy) is a model gap; report it once as a RISK or OPPORTUNITY, don't invent the missing rule.
3. **Locate defects in layers.** Use the layers to place root causes (`SKILL.md` root-cause hierarchy).
4. **Mind claim vs reality.** Where the project's labels (stable, supported, accessible) exceed the evidence in "Implementation reality", that gap is the finding — not the label itself.
5. **Update it as you learn.** If a finding contradicts the model, fix the model and say what changed.

## Report format

Include a **System Model** section for broad audits and release reviews (a short
table or bullet list of the parts above that matter). For small scopes, one or
two lines under "Repository truth" is enough. Never pad it with parts you did not
investigate — write `not investigated`.
