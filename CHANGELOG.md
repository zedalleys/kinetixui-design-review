# Changelog

All notable changes are documented here. This project follows [Semantic Versioning](https://semver.org/). Before 1.0, minor versions may change methodology wording and add or retire checks.

## [0.1.0] - Unreleased

Initial internal-dogfood release. This repository was created from the unpublished working-name repository `design-system-review` (Git history preserved); no earlier version was released or published under any name.

### Identity
- Renamed to **KinetixUI Design Review**; skill ID `kinetixui-design-review`; KinetixUI is publisher and brand. The core remains independent of the KinetixUI design system.
- The KinetixUI profile moved to `profiles/reference/kinetixui-design-system.md` and is labelled a reference example.

### Methodology additions
- **System Model**, **capability discovery**, evidence dimensions (source, confidence, level, coverage), **verification levels V0–V4** and **degraded states** (FULL / DEGRADED / SOURCE-ONLY / BLOCKED).
- **Finding classes**: DEFECT, INCONSISTENCY, RISK, OPPORTUNITY, with verdict rules.
- **Inspection adapters** for web, React, Angular, Vue, Svelte, Web Components, SwiftUI, Jetpack Compose and Flutter.
- `docs/MATURITY.md` with explicit maturity criteria.

### Carried over

- Generic, repository-aware review core (`SKILL.md`): DISCOVER → UNDERSTAND → AUDIT → FIX → VERIFY.
- Review modes: audit, fix, component, block, tokens, theme, icons, motion, accessibility, rtl, docs, cross-platform, release.
- Specialist references: tokens, color/theming, spatial quality, responsive/zoom, RTL, preview isolation, icons, motion, state fidelity, accessibility, component API, blocks, documentation, cross-platform, performance/scalability, verification, severity.
- Project-profile convention and the first reference profile (KinetixUI).
- Methodology fixtures, an expectation file, a static validator and a manual evaluation rubric.
