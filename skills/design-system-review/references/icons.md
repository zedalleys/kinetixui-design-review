# Icons

**Discover** the project's icon architecture before judging anything: bundled
set (SVG sprites, icon components, font), third-party package, platform symbols
(SF Symbols, Material Symbols/`Icons.*`, Flutter `Icons`), custom drawing, slot
props, token for icon size, per-platform differences. Read the icon docs and
any mapping/check script.

## Preferred general principle

SEMANTIC ROLE → SENSIBLE DEFAULT → COMPONENT LAYOUT CONTRACT → CONSUMER-REPLACEABLE CONTENT

A component declares *what role* the icon plays (e.g. "dismiss", "expand
indicator"), ships a sensible default, defines the **layout contract** (box
size, alignment, spacing to label), and lets consumers replace the content.

Do **not** require identical icon libraries across platforms. Do **not** propose
a universal icon-name mapper unless a demonstrated need exists (e.g. documented
drift causing real bugs or a mapping check already in use).

## Audit

- **Defaults** — does each component that needs an icon have one?
- **Replacement** — can a consumer swap it (slot, prop, builder, composable parameter) without forking?
- **Sizing** — icon box governed by a token/contract, not ad-hoc per component.
- **Spacing** — icon–label gap consistent and follows the spatial scale.
- **State/color** — inherits `currentColor`/foreground/tint so state and theme work; disabled/selected/error colors apply.
- **Accessibility** — decorative icons hidden from AT; meaning-bearing icon-only controls have a name; no duplicated announcements.
- **RTL** — directional icons mirror, non-directional ones don't (see `rtl-directionality.md`).
- **Dependencies** — one icon package pulled in for one glyph; duplicate icon packages; tree-shaking.
- **Unicode glyph usage** — **flag ordinary UI icons implemented as arbitrary Unicode/emoji text glyphs for review** (×, ✓, ▾, ⚙ used as icons). They render differently across fonts/platforms, resist sizing/stroke contracts, and bypass replacement. Do **not** auto-reject: a typographic character that is genuinely text (a multiplication sign in a calculator, a bullet) or a justified custom drawing is fine. The question is "is this an icon in a UI role without an icon contract?"

## Questions

- Where does a platform without a shared icon abstraction get its affordances — and is the gap a documented limitation or an accident of omission?
- Is the icon API consistent across components (same prop/slot naming for the same role)?

## Severity hints

Hard-coded glyphs for standard affordances in shared components → P2. An **icon-only interactive control with no accessible name → P1** (P0 if it blocks a primary task) regardless of the glyph question. Broken RTL for a directional icon in a critical control → P1. Inconsistent icon API across components → P2. Optical balance → P3.
