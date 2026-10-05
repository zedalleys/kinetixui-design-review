# Maturity

Current maturity: **INTERNAL DOGFOOD**

This document defines the maturity levels, what evidence exists today, and what must be true before the level changes. The level changes only when external validation supports it — not when the authors feel ready.

## Levels

| Level | Meaning | Required evidence to enter |
|---|---|---|
| **INTERNAL DOGFOOD** (current) | Usable by its authors; methodology and adapters may change freely; validated, at most, on the publisher's own project | Installs and is discovered by Claude Code; representative reviews run; license and docs present |
| **PUBLIC BETA CANDIDATE** | Safe to try publicly with clearly stated limits | All of the below |
| **BETA** | Stable vocabulary and profile format; reported false positives are tracked and trending down | Beta candidate evidence plus sustained external use |
| **1.0** | Frozen vocabulary and profile format | Validated across multiple unrelated projects over time |

### Required before PUBLIC BETA CANDIDATE

1. **External validation:** reviews run on at least two structurally different design systems **by people outside the authors**, at least one non-React and one single-platform, with their false-positive and miss reports recorded.
2. **Adapters exercised:** each adapter listed as supported has been used on real code of that platform; unexercised adapters are removed from the supported list or labelled experimental.
3. **Independent profile:** a profile written by someone other than the core authors, without core edits.
4. **Native and non-web fixtures** exist (the current fixtures are small; native coverage is one SwiftUI fixture).
5. **No recurring false-positive pattern** unresolved in the false-positive log.
6. **Extended methodology re-dogfooded:** the System Model, finding classes, verification levels and degraded states exercised in full reviews of a real project (not only fixtures).
7. Install instructions verified for the published source (a GitHub marketplace source and user-level skill directory were not testable before publication).

## Current evidence

| Area | Evidence | Limits |
|---|---|---|
| Installation and discovery | Plugin install/update/uninstall via the real CLI (isolated HOME), project-local copy and `--plugin-dir` all discovered under the `kinetixui-design-review` identity; `claude plugin validate --strict` passes | GitHub-hosted marketplace source, `~/.claude/skills/` and interactive `/plugin` forms untested |
| Earlier methodology on a real project | Six read-only reviews of the KinetixUI repository (component, stateful controls, block, RTL, theming, cross-platform) and two re-runs; see [DOGFOODING.md](DOGFOODING.md) | One project, run before the extensions; findings unconfirmed by maintainers; source-only evidence |
| Extensions (System Model, capability discovery, classes, V0–V4, degraded states, adapters) | Static validation (`node tests/validate.mjs`) and small fixtures | Not yet used in a full review of a real project |
| Fixtures | 17 cases (good/bad/false-positive controls, finding classes, Vue and SwiftUI adapter cases). Results of the latest full run are recorded in [DOGFOODING.md](DOGFOODING.md) when available | Small and mostly web-shaped; regex checks are a coarse tripwire; model output varies between runs |
| Independence from KinetixUI | The validator enforces that core and references do not describe the KinetixUI design system; the profile lives under `profiles/reference/` and is labelled | Independence from the *design system* is enforced; the *brand/publisher* is intentionally KinetixUI |

## Adapter status

| Adapter | Written | Exercised on real code | Notes |
|---|---|---|---|
| web | yes | no (the earlier reviews predate adapters) | Platform reviewed source-only on the reference project |
| React | yes | no | Platform reviewed source-only on the reference project |
| Angular | yes | no | Platform reviewed source-only on the reference project |
| SwiftUI | yes | fixture only | Source-only on the reference project; no toolchain available |
| Jetpack Compose | yes | no | Source-only on the reference project |
| Flutter | yes | no | Source-only on the reference project |
| Vue | yes | fixture only | Never reviewed on a real Vue design system |
| Svelte | yes | no | Untested |
| Web Components | yes | no | Untested |

"Exercised" means a review of real code *using the adapter*. None of the adapters meets that bar yet.

## Known limits

Run-to-run variance; mostly source-only evidence; one reference project; fixtures are small; Pascal `simplify-product` integration untested in a live two-skill session. See [DOGFOODING.md](DOGFOODING.md#known-weak-areas).
