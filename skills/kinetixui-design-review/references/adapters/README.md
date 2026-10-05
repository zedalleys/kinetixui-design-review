# Inspection adapters

An **adapter** tells the reviewer how to *inspect* one platform or framework:
how to recognize it, where its design-system artifacts live, what to read and
what to run, which idioms count as correct, and what the strongest evidence
available is. Adapters carry **inspection mechanics**, not design opinions: what
counts as a defect still comes from the project's own contracts, the specialist
references, and standards.

Load an adapter only if capability discovery found that platform in the
repository (`../cross-platform.md`). Never review a platform you did not detect.
Several can apply at once (e.g. React + SwiftUI + Compose); judge each by its own
idioms and never port one platform's mechanism onto another.

## Adapter contract (every adapter has these sections)

1. **Detect** — repository signals that the platform is present.
2. **Where to look** — typical locations for components, styles/tokens, themes, icons, motion, direction handling, accessibility, tests.
3. **Static inspection (V1)** — what to read and what patterns are leads (never verdicts on their own).
4. **Runtime / gated inspection (V2–V3)** — what the platform allows, and what it needs.
5. **Idiomatic checks** — what "native to this platform" looks like for the dimensions in the specialist references.
6. **Common false positives** — patterns that look wrong but are not.
7. **Verification ceiling** — the strongest level reachable per capability; what to write when the toolchain is absent.

Adapters are guidance. Their status (which were exercised against real code) is
tracked in `docs/MATURITY.md`; do not present an unexercised adapter as validated.
