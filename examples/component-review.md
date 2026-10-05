# Example: component review

> **Illustrative.** "Acme UI" is a fictional project; this shows the *shape* of a small-scope report, not output from a real run. For real output, see [kinetixui.md](kinetixui.md).

**Prompt:** `Use design-system-review to audit our Button component.`

---

## Verdict: PASS WITH NOTES

## Scope
`packages/react/src/button.tsx`, its stories and tests, and the docs page. Not reviewed: Vue and Svelte packages (declared in `package.json` but not requested), RTL (Button has no direction-dependent layout), motion.

## Repository truth
- FACT: React + Tailwind; tokens generated from `tokens/*.json` by Style Dictionary (`pnpm build:tokens`).
- FACT: `check:contrast` and axe-over-stories exist; I ran neither (no dependencies installed — read-only review).
- INFERENCE: touch-target policy is 44px (stated in `CONTRIBUTING.md`, not enforced by a check).

**Developer need:** a predictable `<button>` with typed variants and an accessible icon-only form.

## Findings
**P2 — Icon-only variant relies on consumer `aria-label`; docs don't say so** (FACT: `button.tsx:41`, docs page has no a11y section). Root cause: documentation.
**P2 (computed) — `sm` height ≈ 32px, below the project's stated 44px** (INFERENCE (computed): 16px line + 2×8px padding from `button.tsx:22`; not measured). *P1 if confirmed* by measurement and the 44px policy applies to this size.
**P3 — hard-coded `18px` icon size** (FACT `button.tsx:30`); a one-off, not a recurring value — no token proposed.

## Recommendations
1. Measure `sm`; if < 44px, fix the size or document the exception (don't shrink anything else to compensate).
2. Add an accessibility section to the docs page.

## Limitations
No gates run; no browser; Vue/Svelte not reviewed; one component sampled.
