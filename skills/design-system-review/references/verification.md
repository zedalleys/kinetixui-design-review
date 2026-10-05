# Evidence, verification and negative controls

## Evidence labels

Every meaningful finding carries one or more labels:

- **FACT** — directly observed and reproducible: a file's contents, a test
  result you ran, a measured computed style, a command's output.
- **OBSERVATION** — something seen but not fully measured (e.g. a screenshot
  looks cramped; a pattern appears in several files you sampled).
- **INFERENCE** — a conclusion drawn from facts ("this probably leaks because
  X writes to `document.documentElement`"). Never present as repository truth.
- **RECOMMENDATION** — what you suggest; always separable from the above.

Write the label next to the claim, with a pointer (`path:line`, command, URL).

## Choosing evidence by claim type

| Claim about… | Prefer |
|---|---|
| Visual layout, clipping, overlap, clearance | Browser/runtime evidence: computed geometry (`getBoundingClientRect`), screenshots at stated viewport/zoom |
| Architecture, token consumption, API shape | Source + type definitions + tests |
| Accessibility semantics | Accessibility tree / role+name queries, keyboard walk-through; automated scan only as a supplement |
| Contrast | Computed colors through the real theme, not the palette in isolation |
| Cross-platform status | The actual platform sources, tests and CI — not the manifest alone |
| Documentation truth | Run/compile the documented example against the real API |

## Coverage statements

State exact coverage. Examples of acceptable wording:

- "Reviewed 3 of 41 components (Button, Select, Dialog); the other 38 were not inspected."
- "Verified at 390px and 1280px; 200% zoom inspected by CSS only, not rendered."

Never write "all components verified" unless every one was. If you sampled,
say how you sampled.

## What you must not claim

- That a test passed if you did not run it. Say "not run" and why (no toolchain, no network, too slow).
- That a screenshot proves responsive quality — it proves one viewport.
- That an automated a11y scan proves accessibility — it catches a subset.
- That green CI proves design-system readiness.

## Verification ladder (use what the environment offers)

1. Static reading of source, manifests, docs.
2. Project's own gates (lint, typecheck, unit tests, token/contrast/RTL checks). Run the ones relevant to the scope; report command + result.
3. Runtime inspection (dev server + headless browser) for visual/interaction claims.
4. Platform toolchains (Xcode, Gradle, Flutter, Angular CLI) only if present; otherwise mark platform findings **source-only**.

If the toolchain is missing, do not install heavyweight tooling without need; report the limitation.

## Negative controls (high-value gates only)

To prove a regression gate actually catches the thing it guards:

1. Confirm the gate passes on the current tree.
2. Introduce one known failure **temporarily** (e.g. hard-code a failing contrast pair, mutate `document.documentElement.dir` in a demo, break a token reference).
3. Run the gate; it must fail for the right reason.
4. **Restore the original** (`git checkout -- <file>` or `git stash`), re-run, confirm pass.
5. Report: gate, injected failure, observed failure, restore confirmed.

Rules: never commit sabotage; do it in a clean working tree or a throwaway
worktree; verify `git status` is clean/at-intended-state afterward. If you
cannot guarantee restoration, don't do it.

## Reporting limitations

End every report with what was **not** verified and why. An honest limitation
list is part of the evidence.
