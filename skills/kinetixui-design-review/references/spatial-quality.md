# Spatial quality: spacing, geometry and clearance

Two separate audits. **Passing the first does not prove the second.**

## 1. Spacing-scale compliance

**Discover** the project's spacing scale (tokens, Tailwind theme, theme object,
design docs, grid-check scripts). Do not assume 4px, 8px or any base. "Use 8px
everywhere" and "use more padding" are not findings.

Audit against the discovered scale: padding, gap, margins, control groups,
icon–label spacing, card composition, section rhythm. Classify off-scale values
as JUSTIFIED / SHOULD_USE_TOKEN / MISSING_TOKEN / LEGACY (see `tokens.md`). Use
the project's own grid/scale check if one exists.

## 2. Spatial clearance (geometry)

Controls and focus rings placed **near** non-rectangular or data-bearing
geometry need deliberate clearance: charts, gauges, radial controls,
illustrations, diagrams, maps, media, sliders, thumbs/handles.

For each such pairing, establish three clearances:

- **Visual** — the control does not touch/overlap the geometry.
- **Interaction** — the hit area does not overlap another control or the geometry's own hit area; dragging the geometry does not trigger the control.
- **Focus** — the focus indicator of each neighbor is fully visible and not clipped or overlapped.

**Method:** measure, don't eyeball. In a browser, compute bounding rects (and, for
circles/arcs, the actual path bounds or radius + stroke) for the control and the
geometry at the viewports you care about; report the minimum gap. For native,
use layout inspection/preview or reason from the source with explicit numbers
and mark it source-only.

**Do not patch geometry defects with arbitrary margins** until you understand the
bounds: which element's box is wrong (stroke excluded from the box? transform not
reflected in layout? absolute positioning against the wrong ancestor?). Fix the
cause (container sizing, stroke-aware bounds, layout structure), not a magic
number that breaks at another size/zoom/locale.

**Never reduce touch targets** to create clearance. Restructure instead.

## Section rhythm

Check hierarchy through spacing: related items closer than unrelated ones;
consistent vertical rhythm between comparable sections; no accidental double
padding from nested containers.

## Evidence

Geometry claims: computed rects at stated viewport/zoom (FACT). "Looks cramped"
without measurement is an OBSERVATION and caps at P3/P2.

## Severity hints

Overlap that blocks interaction or hides state → P1/P0. Visible crowding without
functional impact → P2/P3. Off-scale value with a documented reason → no finding.
