# RTL and directionality

**Discover first.** Does the project claim RTL support? Look for RTL docs,
tests, logical-property usage, direction providers/contexts, a direction
toggle in docs or previews. Skip this reference if the project makes no RTL
claim and has no RTL users in scope — but note that in Limitations.

## Four directions — keep them distinct

| Direction | Meaning |
|---|---|
| SITE | Direction of the documentation/application shell |
| PREVIEW | Direction of a demo or preview region |
| COMPONENT | Direction a component resolves for itself (inherited or set) |
| PORTAL | Direction of content rendered outside its logical parent (overlays, menus, tooltips) |

A component demo's RTL control must not mutate unrelated application UI
**unless explicitly intended and disclosed** (see preview isolation in
`SKILL.md`). Portals are the usual reason projects set direction globally;
check whether a scoped alternative exists (a direction provider/context
supplied to the portal) before accepting global mutation as necessary.

## Audit

- **Logical properties** — start/end, inline/block, `ps-`/`pe-`, `margin-inline-*`, `text-align: start`, `inset-inline-*`; native equivalents (leading/trailing, `start`/`end`, `layoutDirection`). Physical `left/right` in reusable components is a finding unless justified (e.g. a physically-oriented media control).
- **Directional icons** — chevrons, arrows, back/forward, progress, "send" — mirror when they encode *direction of flow*; do **not** mirror logos, media, graphs/time axes (unless the locale convention says so), physical illustrations, or inherently directional symbols (clocks, play for LTR-timeline media, check marks).
- **Portals/overlays** — direction applied to portaled content; positioning/offset math respects direction; arrow-key semantics in menus/tabs flip.
- **Nested direction boundaries** — a `dir="ltr"` island (code, phone numbers, URLs) inside RTL must stay LTR and be correctly aligned.
- **Animation direction** — slide/enter/exit and carousels follow reading direction.
- **Keyboard** — horizontal arrow keys follow visual direction in roving-focus widgets.
- **Text** — bidi: mixed-script strings, numerals, punctuation placement; use `bdi`/isolation where user content is embedded.

"RTL means flip everything" is an anti-pattern — evaluate each item by meaning.

## Evidence

Render in RTL and check computed `direction`, resolved logical offsets, and the
portaled node's direction. Existing RTL tests count as evidence of what they
assert — read what they actually assert, not their names. Grep for physical
properties is a lead (OBSERVATION) until confirmed visually or by test.

## Severity hints

Direction leaking into the app shell, or overlays stuck LTR under claimed RTL support → P1. Unmirrored non-critical icon → P2/P3. Docs claiming RTL where tests/impl don't support it → P1 (truthfulness).
