# Color, theming and theme customization

**Discover first.** Map: primitive palette → semantic roles → themes → component
consumption — or the project's actual equivalent. Identify which themes exist
(light, dark, high-contrast, brand/custom) and how a theme is selected
(class, attribute, media query, context/provider, environment/`ColorScheme`).

## Audit

- **Primitive leakage** — components referencing palette steps where a role exists.
- **Hard-coded colors** in reusable components (classify per `tokens.md`; justified exceptions exist).
- **Semantic mapping quality** — are roles complete (surface levels, text levels, border, interactive states, status, focus)? Are two roles forced to share a token they should not?
- **Each theme** — light, dark, custom — evaluated *separately*. "Dark mode is just inverted light mode" is an anti-pattern: check elevation/surface hierarchy, saturated colors, shadows, images, and borders in dark.
- **Contrast** — text contrast and **non-text contrast** (borders of inputs, icons conveying meaning, focus indicators, chart series) computed through the real theme mappings. Use the project's own contrast check if present.
- **Status colors** — success/warning/danger/info distinguishable without color alone.
- **High contrast / forced colors** — where web: does `forced-colors: active` keep borders, focus and state visible? Native: platform high-contrast / increased-contrast settings where relevant.
- **Theme isolation** — a theme applied to a component, preview or subtree must not unexpectedly recolor unrelated UI (see preview isolation in `SKILL.md`). Also check the inverse: a subtree that must *return* to a theme (e.g. class-based dark mode cannot be "undone" on a descendant).

## Theme customization UX (only if the project lets users customize)

**First discover what already exists** — a seed/generator, override layers, reset, export targets. The question is usually "is the existing approach sound and complete?", not "should we add one?". Audit the generator's *validation coverage*: text pairs only, or also non-text pairs (borders, input edges, focus ring, chart series), dark derivation, and whether generated neutrals do at least as well as the shipped baseline.

Compare what exists with these models and recommend based on evidence:

| Model | Fits when | Risk |
|---|---|---|
| RAW PALETTE EDITING | Power users, fully manual brands | Users must understand every step; easy to break contrast |
| SEMANTIC EDITING | Users think in roles (primary, surface) | Many roles; dark counterpart is a second job |
| BRAND SEED | Quick start from one or two colors | Generated output must be validated for contrast and dark mode |
| HYBRID | Seed + semantic overrides | More surface area; needs clear defaults and reset |

Do not assume automatic palette generation is safe. If generation is proposed,
require: contrast validation per role pair, a dark-mode derivation story, a way
to override, and deterministic output. Do not recommend a generator before
establishing that the semantic architecture is mature enough to receive it.

## Questions

- Can a consumer re-theme without editing source? Is it documented?
- Is there a single place to add a theme, or does each theme touch many files?
- Does adding a theme require adding tokens per component? (Scalability smell — see complexity section in `SKILL.md`.)

## Evidence

Prefer computed colors from a rendered page/theme over reading token files alone. Report the contrast pairs you actually computed and the ones you did not.
