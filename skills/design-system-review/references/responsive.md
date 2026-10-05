# Responsive behavior, zoom and large text

**Discover** the project's breakpoints (config, tokens, container queries, size
classes, window-size classes, adaptive layouts). Choose representative sizes
*from those*: below the smallest breakpoint, each boundary ±, and a wide
desktop. Do not invent a viewport list that ignores the project's own.

## Check

- **Wrapping** — long labels, translations, numbers, RTL strings.
- **Overflow & clipping** — horizontal page scroll, clipped focus rings, truncated critical text.
- **Hierarchy** — primary action remains primary when stacked.
- **Control grouping** — groups don't split in confusing ways when they wrap.
- **Tables / data grids** — scroll, collapse or reflow strategy exists and is usable.
- **Code blocks** — scroll within bounds, don't push the layout.
- **Overlays** — dialogs, popovers, menus remain on-screen and scrollable.
- **Blocks** — composed layouts reflow deliberately.
- **Visualizations** — scale or simplify; labels don't collide.

"Stacked desktop UI" is not automatically good mobile UI. Ask what the user's
task needs at that size, not whether the same elements fit.

**One screenshot proves one viewport.** State which viewports were inspected.

## Zoom and large text

- **Web / public UI:** inspect or test at **200% zoom** (equivalent to ~640 CSS px width at a 1280 window, with reflow). Check no loss of content or function and no two-dimensional scrolling for ordinary content.
- **Native:** consider platform text scaling (Dynamic Type, font scale, Flutter text scale factor) at large sizes; check truncation and clipping.
- **Priority order when something must give:** functionality → readability → interaction → composition. Preserve function over decorative geometry; do not keep a fixed-aspect decoration at the cost of a clipped control.

## Evidence

Runtime/browser evidence at stated sizes (FACT); CSS-only reading is an
INFERENCE for layout outcomes. If you could not render, say so.

## Severity hints

Lost function or unreachable content at supported sizes/zoom → P1 (P0 if a primary task). Awkward but usable reflow → P2/P3.
