# Example: component review

> **Illustrative.** "Acme UI" is a fictional project; this shows the *shape* of a small-scope report, not output from a real run. For real output (from an earlier methodology revision), see [reference-profile-kinetixui.md](reference-profile-kinetixui.md).

**Prompt:** `Use kinetixui-design-review to audit our Button component.`

---

## Verdict: PASS WITH NOTES
## State: DEGRADED — no dependencies installed (project gates and browser not run); source-reading only for this scope

**Capability table:** source read — available · project gates — not run (needs install; read-only review) · browser — unavailable. Ceiling: V1.

## Scope
`packages/react/src/button.tsx`, stories, tests, docs page. Adapter used: React (+ web). Not reviewed: Vue and Svelte packages (declared but not requested), RTL (no direction-dependent layout), motion.

## System Model (short)
React + Tailwind; tokens generated from `tokens/*.json` (`pnpm build:tokens`, generated outputs not hand-edited — FACT). `check:contrast` and axe-over-stories exist, not run. Touch-target policy 44px stated in `CONTRIBUTING.md`, not enforced by a check — INFERENCE that it applies to every size.

## Findings
- `[DEFECT · P2 · FACT · high · V1]` Icon-only variant relies on consumer `aria-label`, and the docs state no requirement — `button.tsx:41`; docs page has no accessibility section. Contract: the library's own docs promise accessible variants. Root-cause layer: documentation.
- `[RISK · P1-if-confirmed · INFERENCE (computed) · medium · V1]` `sm` height ≈ 32px (16px line + 2×8px padding, `button.tsx:22`) vs the stated 44px target. Confirming check: measure the rendered button; confirm the policy covers `sm`.
- `[OPPORTUNITY · value: low · effort: low · OBSERVATION · medium · V1]` hard-coded `18px` icon size (`button.tsx:30`); a one-off value, no token proposed.

## Recommendations
1. Measure `sm` first (confirms or retires the RISK). If below target, fix the size — do not shrink anything else to compensate.
2. Add an accessibility section to the docs page.

## Limitations
No gates run; no browser; Vue/Svelte not reviewed; one component sampled.
