# Roadmap

No dates are promised. Maturity is earned by validation, not by calendar.

## 0.1 — Core, adapters and reference-project dogfooding (this release)

Generic review core, discovery and capability discovery, System Model, finding classes, verification levels, inspection adapters, specialist references, profile convention, a KinetixUI reference profile, fixtures, validator, initial dogfooding. Maturity: INTERNAL DOGFOOD (criteria in `docs/MATURITY.md`).

## 0.2 — Fold in confirmed findings

Incorporate confirmed findings from:

- motion audit
- icon-architecture audit
- color/theming audit
- state/spatial audit
- simplification audit

Also: re-run all dogfood scenarios against the refined skill; tighten the report templates; evaluate whether a per-mode default-dimension table belongs in code-like form.

## 0.x — Beyond one project

- Dogfood on additional, structurally different design systems (single-platform, non-Tailwind, non-React, Storybook-driven), **by reviewers outside the authors** — the evidence `docs/MATURITY.md` requires before maturity can change.
- Exercise the Vue, Svelte and Web Components adapters against real projects; refine or retire adapter guidance that proves wrong.
- Re-run all dogfood scenarios with the extended methodology (System Model, finding classes, levels).
- A second profile written by someone who is not the core author, to test the profile convention.
- A `claude plugin eval` suite (an interview-authored, with/without-plugin comparison) for the fixtures, once a maintainer has trusted the plugin directory for eval runs.
- Native-first fixtures (SwiftUI, Compose, Flutter), since v0.1 fixtures are web-shaped.
- Reduce false positives found externally; promote or retire PROVISIONAL rules per the rule lifecycle.

## 1.0 — Stable methodology

Only after real-world validation across multiple projects and a measurably reduced false-positive rate. 1.0 will freeze the profile format and the severity/evidence vocabulary.
