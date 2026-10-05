# Example: cross-platform review

> **Illustrative** (fictional "Acme UI"). The platform list comes from repository discovery, never an assumption.

**Prompt:** `Run a cross-platform review of Select.`

---

## Verdict: PASS WITH NOTES

## Scope
`Select` only. Platforms discovered from repository evidence: React (`packages/react`), SwiftUI (`ios/Package.swift`), Compose (`android/build.gradle.kts`). **Not present, not reviewed:** Angular, Flutter, Vue.

## Platform status
| Platform | DEFINED | GENERATED | IMPLEMENTED | CONSUMED | VERIFIED (kind; direct/indirect) |
|---|---|---|---|---|---|
| React | spec | tokens | `select.tsx` | docs site | interaction (direct), a11y (indirect: axe over all stories) |
| SwiftUI | spec | tokens | `AcmeSelect.swift` [src] | sample app [src] | build only |
| Compose | spec | tokens | `AcmeSelect.kt` [src] | — | build only |

`[src]` = source-only; toolchain not run.

## Findings
**P2 — The docs describe SwiftUI/Compose Select as "supported"; evidence is build-only** (FACT: docs page; test files). Not P1: the platform manifest labels them `preview`, so the claim is partly qualified.
**P2 — Compose trigger draws its chevron as the text glyph `▾`** (FACT `AcmeSelect.kt:73`); SwiftUI and React use their icon contracts. Judge by the project's icon contract, not by React: needs a Compose-appropriate default.

## Recommendations
1. Qualify the docs wording or add behavior tests for native Select.
2. Decide the Compose icon default (audit question for the owner).

## Limitations
Native findings are source-only; `Select` only; test bodies not read beyond whether they exercise Select.
