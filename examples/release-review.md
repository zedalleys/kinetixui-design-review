# Example: release review

> **Illustrative** (fictional "Acme UI").

**Prompt:** `Use release mode on this PR.` (PR adds `Combobox`, changes `Select` default width)

---

## Verdict: NOT READY
## State: DEGRADED — gates run: `typecheck`, `lint` (pass, V2); browser a11y suite and native builds not run (dependencies/toolchains absent)

## Scope
The PR diff (14 files); `Combobox` on React only; the `Select` change. Adapter: React.

## Blockers
- `[DEFECT · P1 · FACT · high · V1]` Undocumented breaking change: `Select` default width went from `100%` to `auto` (`select.tsx` diff). Consumers who relied on full width regress; no CHANGELOG entry, no migration note, patch version bump. Contract: the project's semver and changelog rules (`CONTRIBUTING.md`).
- `[RISK · P1-if-confirmed · INFERENCE · medium · V1]` `Combobox` input may lack an accessible name (`aria-label` not forwarded). Confirming check: read the input's computed name in a browser.

## Notes
- `[DEFECT · P2 · FACT · high · V1]` Docs for `Combobox` lack the keyboard model section the docs template requires.
- `[DEFECT · P2 · FACT · high · V1]` Platform matrix claims `Combobox` "supported" on SwiftUI; no implementation exists in the repo (remove or qualify the claim).

## Recommendations
1. Confirm the accessible name first (decides whether there is a second blocker).
2. Revert the width default or ship it as a documented, versioned change with migration.
3. Correct the platform claim.

## Limitations
Green `typecheck`/`lint` are inputs, not readiness. Browser, native and visual checks not run.
