# Cross-platform review

**Discovery decides applicability.** Establish which platforms exist from
repository evidence (package directories, build files, manifests, CI
workflows, docs). Review **only** those. Do not assume every project is
cross-platform; a React-only project has no parity review — say so and skip.

Look for: `package.json` frameworks (react, vue, @angular/*, svelte, lit),
`*.xcodeproj` / `Package.swift` (SwiftUI/UIKit), `build.gradle*` with Compose or
Android Views, `pubspec.yaml` (Flutter), other frameworks you find.

## Capability matrix

Build a matrix: rows = components/blocks (or the sampled subset), columns =
detected platforms. For each cell record the **stage**, never a single
"supported" boolean:

| Stage | Meaning | Evidence |
|---|---|---|
| DEFINED | The contract/spec exists | spec file, manifest entry |
| GENERATED | Platform artifacts (tokens, scaffolds) are produced | generator + output |
| IMPLEMENTED | A real implementation exists in platform source | source file |
| CONSUMED | The project's own apps/docs/demos use it | import sites |
| VERIFIED | Tests/CI exercise it, with the *kind* of verification named (build, interaction, a11y, RTL, large text, reduced motion, visual) | test + CI |

Do not collapse stages into "supported". A manifest that lists a platform is
DEFINED at best until you have seen implementation and tests. If the project
already generates a parity/verification report, treat it as a **claim** to spot-check
against source, not as ground truth.

## What parity means

- Equivalent **user capability**.
- Equivalent **semantic intent** (same states, same meaning).
- **Appropriate accessibility** for each platform.
- Equivalent **design-system contract** (tokens, states, naming where sensible).

What parity does **not** require: identical source, identical APIs, identical
pixels, identical native behavior. "All platforms should look identical" is an
anti-pattern.

## Platform-native review

Judge each implementation by its own platform's idioms:

- **Web (React/Vue/Svelte/Web Components):** semantic HTML, CSS logical properties, ARIA only when needed.
- **Angular:** Angular-native composition (content projection, signals/inputs/outputs, DI), not React patterns ported over.
- **React:** composition, refs, controlled/uncontrolled patterns.
- **SwiftUI:** `View` composition, modifiers, `@State`/`@Binding`, Dynamic Type, VoiceOver traits.
- **Compose:** slot-based composables, state hoisting, `Modifier` conventions, semantics.
- **Flutter:** widget composition, `ThemeExtension`, `Semantics`, text scale.
- **UIKit / Android Views:** only where present; their own conventions.

Do not force React architecture (hooks, class-name variants, DOM semantics) onto
native code. Flag only genuine contract gaps.

## Review method

1. Establish applicable platforms and the capability matrix for the scope.
2. For each in-scope component, compare *behavior and states*, not source text.
3. Run each platform's own gates if the toolchain exists; otherwise label the platform **source-only**.
4. Report gaps relative to what the project **claims** (docs, manifest, README). Unclaimed gaps are notes, not failures.

## Severity hints

Serious parity failure against a *claimed* capability (e.g. docs say RTL on
SwiftUI; there is no implementation) → P1. Missing but unclaimed → note/P2.
Platform idiom mismatch without functional impact → P2/P3.
