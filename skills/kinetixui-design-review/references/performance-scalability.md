# Performance, scalability and complexity prevention

## Performance (meaningful risks only)

Inspect risks that real users would feel; **do not micro-optimize speculatively.**

- Unnecessary rerenders (unstable props/context values, state too high)
- Expensive effects, listeners not cleaned up, observers per instance
- Animation causing layout/paint of large areas; timer-driven animation where CSS/native animation fits
- Oversized assets (images, fonts, SVG), unoptimized illustrations
- Duplicate dependencies; unnecessary icon packages; large imports for tiny use
- Excessive DOM / deep trees in repeated items (lists, tables, calendars)
- Bundle impact of a "kitchen-sink" entry point vs. per-component imports (tree-shaking)

Evidence: measured (profiler, bundle analysis, Lighthouse trace) = FACT;
reasoning from source = INFERENCE. Report the *scenario* where it matters.
Severity is usually P2/P3 unless it blocks interaction on mid-range devices.

## Scalability / complexity prevention

Ask: **if the project adds another component, block, theme, platform, package or
state — does the architecture scale?**

Flag systems where every addition creates another:

- top-level tab, selector, badge or navigation item
- duplicated component or near-copy
- one-off token
- per-theme × per-component override matrix
- per-platform manual step with no check

Prefer scalable composition and progressive disclosure: generated lists/manifests
over hand-maintained ones, one-to-many theme mapping, defaults + advanced options.
This is an architectural note (P2) unless it already causes inconsistency.

## Root-cause hierarchy (restated for quick reference)

When a defect appears, locate its lowest *shared* cause and fix there:

1. canonical token → 2. theme → 3. shared primitive → 4. component → 5. preview infrastructure → 6. block composition → 7. documentation → 8. demo-only implementation

Do not create abstractions where only one legitimate case exists.
