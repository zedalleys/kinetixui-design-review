# Blocks and composed experiences

A **block** (pattern, template, composed section, dashboard widget, example
screen) must be reviewed **independently of its primitives**. A block can be
poor even when every component inside it passes individually. Do not treat a
block as a screenshot: it is a composition with states, behavior and a purpose.

**Discover first.** How the project defines blocks (manifest, registry,
directory), how they are distributed (copy-paste source vs. package), what
quality bar docs promise for them, and whether blocks have their own tests.

## Start with the real user need

State the REAL USER NEED the block serves before judging layout. For a
dashboard: what decision does the viewer make? For a settings screen: what is
the user trying to change and how do they know it worked?
If the block is a complex product surface, optionally run the simplification
sequence (REMOVE → AUTOMATE → COMBINE → DEFAULT → DEFER → CLARIFY → REDESIGN) —
or recommend Pascal's `simplify-product` if installed. This review keeps
ownership of *implementation correctness*.

## Audit

- **Hierarchy** — one clear primary; secondary actions subordinate.
- **Composition** — uses the system's components as intended; not re-implementing them with local one-offs.
- **Spacing & geometry** — scale compliance **and** spatial clearance (`spatial-quality.md`).
- **State fidelity** — every visible state coherent (`state-fidelity.md`).
- **Empty / loading / error / partial** states exist and are designed, not left to the consumer by accident.
- **Responsive** — at the project's breakpoints and at 200% zoom (`responsive.md`).
- **Focus & keyboard** — logical order across the whole composition; no clipped focus rings inside cards/overflow containers.
- **Theme** — works in every supported theme; no hard-coded colors that survive theme change.
- **RTL** — mirrored layout order and icons; nested LTR islands (`rtl-directionality.md`).
- **Accessibility** — headings/landmarks, announcement of dynamic updates, label associations. For controls inside rows/cards (switches, checkboxes, menus), confirm each platform exposes the row's visible title as the control's name, plus description and state, on the *semantic element* — and that one platform's mechanism isn't copied by another as a mere attribute.
- **Native blocks whose "source" is a fixture inside a test file:** review the fixture as the block's source (composition, semantics, states) and report the strength of the surrounding test separately.
- **Density** — information density consistent with the intended use, not simply "as dense as fits".
- **Truthfulness** — placeholder data labelled; no implied backend.
- **Source health** — blocks that are copied into consumer projects: do they import only public APIs, and do they compile standalone?

## Root-cause question

If a defect appears in a block, ask whether it originates in a **primitive**,
the **block composition**, or **demo-only code** (see root-cause hierarchy in
`SKILL.md`) before fixing in the block.

## Severity hints

Contradictory critical state or inaccessible main interaction → P1. Missing
empty/error state in a **data-bearing** block → P2 (not applicable to a purely presentational/toggle block — say "n/a"). Placeholder data not labelled as placeholder → P3, P2 if it could be mistaken for real records. Visual rhythm → P3.

Judge native blocks by *equivalent capability and semantics*, not by web mechanisms (e.g. do not demand `aria-labelledby` of SwiftUI; ask whether the row's name, description and state are exposed to the platform's AT).
