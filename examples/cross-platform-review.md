# Example: cross-platform review

> **Illustrative** (fictional "Acme UI"). The platform list comes from repository discovery, never an assumption.

**Prompt:** `Run a cross-platform review of Select.`

---

## Verdict: PASS WITH NOTES
## State: DEGRADED — web per-platform runtime unavailable; SwiftUI and Compose are SOURCE-ONLY (no Xcode/Gradle)

## Scope
`Select` only. Platforms detected from repository evidence: React (`packages/react`), SwiftUI (`ios/Package.swift`), Compose (`android/build.gradle.kts`). **Not present, not reviewed:** Angular, Flutter, Vue. Adapters used: React, SwiftUI, Jetpack Compose.

## Platform status
| Platform | DEFINED | GENERATED | IMPLEMENTED | CONSUMED | VERIFIED (kind; direct/indirect; level) |
|---|---|---|---|---|---|
| React | spec | tokens | `select.tsx` | docs site | interaction (direct, V1: read tests), a11y (indirect: axe over all stories, V1) |
| SwiftUI | spec | tokens | `AcmeSelect.swift` [src] | sample app [src] | build only |
| Compose | spec | tokens | `AcmeSelect.kt` [src] | — | build only |

`[src]` = source-only; toolchain not run.

## Findings
- `[INCONSISTENCY · P2 · FACT · high · V1]` Docs describe SwiftUI/Compose Select as "supported" while the platform manifest labels them `preview` and evidence is build-only. The project has not said which statement is authoritative.
- `[INCONSISTENCY · P2 · FACT · high · V1]` Compose trigger draws its chevron as the text glyph `▾` (`AcmeSelect.kt:73`); React and SwiftUI use their icon contracts. Judge by the project's icon contract, not by React: the question for the owner is the Compose default.
- `[OPPORTUNITY · value: medium · effort: medium · OBSERVATION · medium · V1]` Add Select-specific interaction tests on native; today only build is verified.

## Recommendations
1. Qualify the docs wording or add native behavior tests.
2. Decide the Compose icon default.

## Limitations
Native findings are source-only; `Select` only; test bodies read only for whether they exercise Select.
