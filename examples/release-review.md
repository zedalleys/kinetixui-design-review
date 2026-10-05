# Example: release review

> **Illustrative** (fictional "Acme UI").

**Prompt:** `Use release mode on this PR.` (PR adds `Combobox`, changes `Select` default width)

---

## Verdict: NOT READY

## Scope
The PR diff (14 files), `Combobox` on React only, and the `Select` change. Gates run: `typecheck`, `lint` (pass). Not run: browser a11y suite (dependencies absent), native builds.

## Blockers
**P1 — Breaking change undocumented:** `Select` default width changed from `100%` to `auto` (FACT: `select.tsx` diff). Consumers who relied on full width will regress; no CHANGELOG entry, no migration note, version bump is a patch.
**P1 if confirmed — `Combobox` listbox has no accessible name:** INFERENCE from source (`aria-label` not forwarded to the input). Confirming check: read the input's computed name in a browser.

## Notes
- P2: docs page for `Combobox` lacks the keyboard model section.
- P2: platform matrix claims `Combobox` "supported" on SwiftUI; no implementation exists in the diff or repo (claim must be removed or qualified).

## Recommendations
1. Revert the width default or ship as a documented minor/major with migration.
2. Confirm and fix the accessible name; add a test asserting the inner control's name.
3. Correct the platform claim.

## Limitations
Green `typecheck`/`lint` are inputs, not readiness. Browser, native and visual checks not run.
