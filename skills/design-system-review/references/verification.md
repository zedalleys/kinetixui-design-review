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

**Computed claims.** A number you calculated from source values (e.g. a gap derived from stroke width, radius and class-resolved spacing) is **INFERENCE (computed)** unless every input was verified at runtime. Show the inputs and the arithmetic so it can be checked. Computed results justify "P1/P2 if confirmed", not an unqualified high severity.

**Stated rationale is a claim.** Comments, ADRs and docs that explain a design ("measured: …", "VoiceOver reads this twice") are useful leads, not FACT about behavior. Cite them as stated, and verify the cheap ones.

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

## Gate safety (read-only reviews)

Project gates (`check:*`, tests, lint) are valuable evidence, but running them can change the repository (installs, caches, generated files). Rules:

1. **Record state first:** `git status --porcelain` before; compare after. Gitignored caches (`node_modules`, `.turbo`) are acceptable; tracked-file changes are not — restore them and report.
2. **No installs** (`pnpm install`, `npm ci`, `pod install`, `gradle` downloads) in a read-only review. If dependencies are absent, gates that need them are *not run* — a Limitation.
3. **Prefer pure-check gates** (scripts that read files and print/exit). Before running one, skim it for write calls (`writeFile`, `--write`, generators without `--check`). Run `--check` variants, never the generating variant.
4. **Test runners** may write caches/snapshots; run them only if their config is read-only-safe or you are in `fix` mode and the user allows it.
5. Say what you ran (command, exit status) and what you skipped. A gate you did not run is never "passed".
6. A *green gate is not proof* of a design property the gate was not built to check; a *tracked/known-failure gate result* reported by the project is a disclosed state, not a new failure.

In `fix` mode you may run generators the project documents for the files you are changing, and must show the resulting diff.

## Runtime evidence: when is it "available"?

Runtime evidence (browser rendering, measured rects) is the default expectation for visual/spatial claims, but only if it is obtainable in a couple of commands: a browser binary exists or the project already ships a browser-based check, dependencies are present, and a dev/preview server can start without writes to tracked files. If not, **do not install heavyweight tooling for a read-only review**; use source reasoning, label geometry **INFERENCE (computed)**, set severities conditionally, and list the specific runtime check that would confirm each finding.

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
