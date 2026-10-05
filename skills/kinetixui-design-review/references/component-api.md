# Component API

Lead with **DEVELOPER NEED**: what should the consuming developer be able to
accomplish reliably, with the least surprise? A technically elegant component
that is hard to use fails this review.

**Discover first.** Public entry points (package exports, barrel files, type
definitions, generated API docs), versioning/deprecation policy, framework
idioms the project follows (see `cross-platform.md`), existing API conventions
(naming of props, event names, variant names).

## Audit

- **Composition** — can it be composed idiomatically in its framework (children/slots in React/Vue/Svelte/Angular content projection, `@ViewBuilder` in SwiftUI, slot lambdas in Compose, widget children in Flutter)?
- **Defaults** — works correctly with minimal input; the simple case is simple.
- **Controlled / uncontrolled** — where state is relevant, are both patterns supported coherently (value/defaultValue/onChange or the framework equivalent), without mode-switching warnings?
- **Slots & customization** — extension points where users actually need them; not a slot for everything.
- **Variants** — a small, named, documented set; no combinatorial explosion; variant naming consistent with sibling components.
- **Naming** — consistent verbs/nouns across components; same concept = same prop name.
- **Type safety** — types/enums/generics prevent invalid combinations; discriminated unions where props depend on each other; no `any`-typed escape hatches in public API.
- **Event contracts** — payload shape, when events fire, cancelability.
- **Accessibility contract** — a11y-critical props (label, description) are discoverable and required where needed.
- **Backward compatibility** — changes to exports/props/defaults/class names/tokens are breaking; check deprecation path and changelog.
- **Unnecessary API surface** — props that duplicate each other, pass-through props that mirror the underlying element without a reason, options nobody needs.

## Principle

Simple default + advanced capability when needed. Avoid API explosion. "Every
component needs every possible slot" is an anti-pattern. Do not add an
abstraction for a single legitimate use case.

## Questions

- Could a developer discover how to customize this from types/docs alone?
- If one more variant/size/state were added, would the API stay coherent?
- Does the API leak an implementation detail (a specific primitive library) that will block future change?

## Evidence

Read exported types and the component source; run the project's type-check/API
tests; compile at least one real usage when claiming "this API is awkward".
Cross-reference public docs examples against the real signature.

## Severity hints

Broken documented contract, silent behavior change in a patch release → P1. Inconsistent naming, missing slot for a common need → P2. Cosmetic naming → P3.
