# Example: block review at 200% zoom

> **Illustrative** (fictional "Acme UI"). Shows how a block is judged as a composition.

**Prompt:** `Audit this dashboard block at 200% zoom.`

---

## Verdict: FAIL
## State: FULL for web — headless Chromium available; V3 reached for the findings below

## Scope
`blocks/revenue-dashboard` (chart + 4 stat cards + filter bar). Chromium at 1280×800 with 200% zoom (effective 640 CSS px), light theme only. Adapter: web. Not reviewed: dark theme, RTL, other blocks.

**Real user need (INFERENCE):** see this week's revenue vs target and drill into a segment.

## Findings
- `[DEFECT · P1 · FACT · high · V3]` Filter bar controls are unreachable at 200% zoom — `.filter-bar` measures 912px inside a 640px container with `overflow:hidden`; the last two controls are clipped; no horizontal scroll. Standard: content/function must remain available at 200% zoom (reflow). Root-cause layer: block composition (fixed `nowrap` row), not the Select primitive.
- `[RISK · P2 · OBSERVATION · low · V3 (screenshot only)]` Chart legend may overlap the plotted line at 200%; geometry not measured. Confirming check: bounding rects of legend vs path.
- `[INCONSISTENCY · P3 · FACT · high · V1]` Stat card deltas use color alone for up/down in two cards but an arrow icon in the other two; no decision recorded. (Accessible names carry the direction, so not higher.)

## Recommendations
1. Make the filter bar wrap at narrow effective widths (function → readability → interaction → composition); don't shrink targets.
2. Measure the legend/line clearance and fix the container, not the margin.
3. Decide the up/down indicator convention for all stat cards.

## Limitations
One viewport/zoom combination; dark theme and RTL not checked; chart internals not inspected.
