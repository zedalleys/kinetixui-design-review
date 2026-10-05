# Example: block review at 200% zoom

> **Illustrative** (fictional "Acme UI"). Shows how a block is judged as a composition.

**Prompt:** `Audit this dashboard block at 200% zoom.`

---

## Verdict: FAIL

## Scope
`blocks/revenue-dashboard` (chart + 4 stat cards + filter bar). Chromium at 1280×800 with browser zoom 200% (effective width 640 CSS px), light theme only. Not reviewed: dark theme, RTL, other blocks.

**Real user need (INFERENCE):** see this week's revenue vs target and drill into a segment.

## Findings
**P1 — Filter bar controls are unreachable at 200% zoom** (FACT, runtime: `getBoundingClientRect` on `.filter-bar` = 912px wide inside a 640px container with `overflow:hidden`; last two controls clipped; no horizontal scroll). Root cause: block composition (fixed `nowrap` flex row), not the Select primitive. Fix: allow wrapping; don't shrink targets.
**P2 — chart legend overlaps the plotted line at 200%** (OBSERVATION from screenshot; geometry not measured).
**P3 — stat card deltas use color alone for up/down** (FACT: no icon or sign); status text exists in the accessible name, so not P2.

## Recommendations
1. Make the filter bar wrap at narrow effective widths (functionality → readability → interaction → composition).
2. Measure the legend/line clearance and fix the container, not the margin.

## Limitations
One viewport/zoom combination; dark theme and RTL not checked; chart internals not inspected.
