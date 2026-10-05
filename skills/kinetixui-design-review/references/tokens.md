# Tokens

**Discover first.** Find where tokens are defined and how they reach code. Look
for: token JSON/YAML (Style Dictionary, Tokens Studio, Figma variables export),
CSS custom properties, Tailwind/UnoCSS config, theme objects (JS/TS), SwiftUI
extensions, Compose `MaterialTheme`/custom theme objects, Flutter `ThemeData`
extensions, SCSS maps. Find the build step (if generated, the output must not be
hand-edited). Read any token documentation and contribution rules.

## Classify the architecture you find

Layers the project may have (it may have fewer — do not demand layers it does not need):
primitive → semantic → component-specific → local.

For each *value consumed in a component*, classify what it is:

| Class | Meaning |
|---|---|
| CANONICAL | Defined in the project's authoritative token source |
| SEMANTIC | Role-named (`surface`, `text-muted`, `danger`) |
| PRIMITIVE | Raw scale step (`blue-500`, `space-4`) |
| COMPONENT-SPECIFIC | Token scoped to one component |
| LOCAL | Declared in the component/file |
| HARD-CODED | Literal value with no token reference |

…and then judge it:

| Judgment | Meaning |
|---|---|
| JUSTIFIED | A local/hard-coded value with a real reason (e.g. one-off illustration geometry, optical correction, 1px hairline, platform constant) |
| SHOULD_USE_TOKEN | An equivalent token exists |
| MISSING_TOKEN | Value recurs or encodes a decision but no token exists — a token-architecture gap, not a component bug |
| LEGACY | Pre-dates the current architecture; track, don't blame |

Do **not** auto-reject local values. "Every color should be a token" is an anti-pattern; "reusable components must not consume primitives where a semantic role exists" is a reasonable check.

## Dimensions to audit (those that apply)

color · spacing · radius · typography · shadow/elevation · motion (duration, easing) · sizing · breakpoints · z-index · opacity · others the project defines.

## Questions

- Does component code consume **semantic** tokens where one exists, or leak primitives?
- Are there values that repeat across components (candidate MISSING_TOKEN)?
- Is there one source of truth, or do platforms/themes drift? If generated, is there a freshness check?
- Do tokens have a documented contract (names, intent, deprecation)?
- Are z-index/opacity/motion values scattered as magic numbers?
- Does the project already have a gate for this (lint, `check:*` script, test)? Run it; do not duplicate it.

## Search heuristics (starting points, not verdicts)

Hex/rgb/hsl literals, `px`/`rem` literals in component styles, `z-index` numbers, `ms`/`s` durations, `cubic-bezier(`, `Color(0x`, `Color.fromARGB`, `.padding(` with raw numbers, `dp`/`sp` literals. Each hit needs classification — a hit alone is not a finding.

## Root cause hint

Fix at the highest shared layer: missing/incorrect canonical token → theme mapping → shared primitive → component. Don't mint a token for a single legitimate use.

## Anti-patterns to resist

"Use 8px everywhere." · "Every color should be a token." · One-off tokens created to silence a lint hit.
