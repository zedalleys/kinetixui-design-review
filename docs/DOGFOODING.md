# Dogfooding record — v0.1.0

> **History note.** The runs below were performed under the earlier working name `design-system-review`, **before** the System Model, capability discovery, finding classes, verification levels and inspection adapters were added. They validate the *earlier* methodology (and the KinetixUI reference profile) on one project; they do not validate the extensions. The extensions' own validation status is in [MATURITY.md](MATURITY.md). References to the "KinetixUI profile" mean what is now `profiles/reference/kinetixui-design-system.md`.

What was run, what it found, what changed in the skill, and what is still weak. Everything here is a record of actual runs; nothing is projected.

## Method

- Target: the KinetixUI repository at commit `5db94f0` (a pnpm/turbo monorepo with React, Angular, SwiftUI, Compose and Flutter packages). **KinetixUI was not modified**: runs were read-only (`--disallowedTools Edit Write NotebookEdit`) and `git status` was checked clean afterward.
- Invocation: headless Claude Code (`claude -p --plugin-dir <this repo> ...`, CLI 2.1.289) so the skill was loaded the way a user would load it. The serving model was the CLI's default and was not recorded; treat results as *one model's behavior*.
- Prompts named the `kinetixui` profile and one mode each. Each prompt ended with a request for a "Skill feedback" section (what helped, what misled, assumptions, bias) — that feedback drove the refinements below.
- The reviewers' KinetixUI findings were **not independently verified** by the maintainers of that project. I personally confirmed only that `preview-environment.tsx` writes `document.documentElement` `dir` (source line read) and that the Angular block binds `[attr.aria-labelledby]` onto a component whose input is aliased `aria-labelledby` (plausible; not run).

## Runs (first pass)

| # | Scenario | Mode | Verdict | Notes |
|---|---|---|---|---|
| 1 | Simple component — Button | component | PASS WITH NOTES | Sound structure; appropriately downgraded size/forced-colors claims to "if confirmed". ~12 KB — long for a small scope; several low-value P3s. |
| 2 | Complex/stateful — thermostat control, door lock, light | component+block | PASS WITH NOTES | Most valuable run: stroke-aware **computed** geometry showed the ± buttons overlapping the ring track at the maximum box size. Also flagged lock art as "dead" and eco-as-off; both are debatable (see false positives). |
| 3 | Block — `settings-list` | block | PASS WITH NOTES | Found cross-platform divergence in how rows name their switches. Ran project gates; the pnpm call printed install-style output → motivated gate-safety rules. |
| 4 | RTL — preview direction / Fields | rtl | **FAIL with only P2 findings** | Correctly treated a disclosed global `<html dir>` mutation as a *rule conflict*, but the verdict contradicted the severity model → motivated severity rule 7 and the "verdict follows findings" rule. |
| 5 | Theming | theme | PASS WITH NOTES | Discovered a seed-based generator already ships, so evaluated it rather than recommending one; computed contrast on generated neutrals; ran dependency-free gates. Challenged the PROVISIONAL rule usefully. |
| 6 | Cross-platform — Select | cross-platform | PASS WITH NOTES | Good five-stage matrix; opened claimed test ranges and found **generic sweeps** standing in for component-specific verification → motivated "evidence directness" guidance. |

## Skill defects found, and what changed

| Finding from dogfooding | Change |
|---|---|
| FAIL verdict with P2-only findings; severity table and RTL reference disagreed about a shell leak | `severity.md`: verdict derived from findings; rule 7 (rule-conflict calibration); conditional "P1 if confirmed" convention; verdict annotations (`FAIL — needs owner decision`); `preview-isolation.md` and the profile aligned |
| Unclear whether read-only reviews may run gates; one run triggered install-style output | `verification.md` "Gate safety" (no installs, check-variants only, `git status` before/after, list unrun gates); `SKILL.md` read-only section |
| No definition of "runtime available"; reviewers unsure how to rate calculated geometry | `verification.md`: runtime-availability rule; evidence label **INFERENCE (computed)** with inputs shown |
| Profile/reference paths resolved against the wrong directory | `SKILL.md` path note; profile paths clarified |
| Reviewers had to guess which references to load | `SKILL.md` minimum-reference table and per-mode defaults |
| "No profile scenario applies" felt like a failure | Profile + `SKILL.md`: "none applies" is a valid result |
| Stated rationales in comments accepted as fact | `verification.md`, `preview-isolation.md`: rationale is a claim; verify if cheap |
| Docs contradicting code (stale ledger) had no rule | `documentation.md`: code/tests are FACT, stale doc is the finding |
| Generic test sweeps counted as component coverage; keyword hits as coverage | `cross-platform.md`: direct vs indirect evidence, matrix rendering with `[src]`/`[idx]` markers, maturity-vs-verification handling |
| Theming guidance invited "add a generator" before discovery | `color-theming.md` and profile: discover the existing approach first; audit validation coverage |
| Decorative state art / eco-vs-off treated as defects | `state-fidelity.md`: don't assume which states art shows; honest decorative art is not a contradiction; audit question when no state model |
| Touch-target numbers derived from class names; web number applied to native | `accessibility.md`: per-platform targets; computed sizes are INFERENCE |
| Unnamed icon-only control rated inconsistently (P1 vs P1/P2) | `accessibility.md`/`icons.md`: any unnamed interactive control is P1 |
| Name bound to a component host rather than the inner control | `accessibility.md`: name must reach the semantic element |
| Non-data blocks penalized for missing empty/error states | `blocks-composition.md`: "n/a" for presentational blocks; native-fixture guidance |
| Test absence and "known, tracked" gate results reported as defects | `severity.md` rules 9–10 |

## Re-runs after refinement

- **RTL re-run:** same repository, same prompt shape → verdict **FAIL (needs owner decision)** with the leak as **P1 (rule conflict)** and shell physical-property collateral as P2 — consistent with the severity model (previously P2 + FAIL). It also separated requirement (rule 6) from mechanism (audit question), which led to the profile rewording.
- **Block re-run:** the same block produced a *different* top finding (an Angular host-attribute naming concern, labelled INFERENCE and conditional) than the first run (React `aria-label` divergence). Both are plausible; this shows run-to-run variance (see weak areas). It also respected read-only rules (no gates run).
- **Fixtures (12 cases, headless):** first run **10/12** passed the regex tripwire. The 2 failures were *regex* problems, not skill problems: one expectation matched the phrase "not reporting it as an oversight" (the behavior was correct and also caught a missing effect cleanup), the other required a literal `12px` where the review wrote "x 12–56". Expectations were corrected. A re-run of the 3 changed cases passed 2/3: `preview-direction-disclosed` and `icons-bad` passed; `spatial-bad` returned **P2** instead of P1 because the fixture ring was a plain circle with no data, and the review said so explicitly (P1 if the ring carried a value). That was a fixture ambiguity, not a skill defect, so the fixture was changed to include a data-bearing value arc; `spatial-bad` (P1) and `spatial-good` (no finding) then both passed. Final state: all 12 fixture cases have passed at least once on the current expectations, but not all in a single run of the final skill text — the full 12-case suite was not re-run end-to-end after the last refinements. The fixture runner is a tripwire, not proof — read outputs against `tests/RUBRIC.md`.
- The two **false-positive controls** (`tokens-justified`, `preview-direction-disclosed`) behaved correctly on the first run: the hairline/artwork literals were not flagged above P3, and the documented global mutation was evaluated as a trade-off at P2 with no project rule.

## False positives, misses and other quality notes

- **Possible false positives:** the lock-art "dead art" finding and the eco-treated-as-off finding (run 2) over-read decorative art; fixed by guidance, not re-tested on KinetixUI. Keyword-based test coverage claims (run 6) risked false confidence; guidance added.
- **Possible misses:** runs are source-only for visual and native claims. No run rendered a page. Accessibility behavior with real assistive technology is never exercised.
- **Overly generic advice:** low; the profile and discovery kept recommendations specific. Some P3s (run 1) were low value.
- **Excess output:** small scopes still produced 6–12 KB. The compact template exists but is not enforced.
- **Confirmation bias risk:** profile scenarios aim the reviewer at known issues (run 6's glyph finding matched a profile scenario). That is by design but should not be mistaken for independent discovery.
- **Platform bias:** reference guidance is web-heavier than native; native checks rely on source-only reading.

## Known weak areas

1. **One reference project.** Nothing here shows the methodology generalizes to other design systems, a non-Tailwind/non-React stack, or a single-platform library.
2. **Run-to-run variance.** Two runs of one prompt returned different top findings. The skill has no deterministic coverage checklist per mode; coverage depends on the model's sampling.
3. **Source-only evidence.** Spatial and responsive findings were computed from markup/classes (fragile), not measured in a browser; native findings were never compiled or run.
4. **Fixtures are small and web-shaped**; there are no native fixtures yet. The regex checks are coarse.
5. **Not tested here:** user-level (`~/.claude/skills/`) install, GitHub-hosted marketplace source (the repository is not published), interactive `/plugin ...` forms, `claude plugin eval`, and a live session with Pascal's `simplify-product` installed alongside (the integration is written as an optional recommendation; its detection by the model is unverified).
6. **Rule bases:** several KinetixUI "ESTABLISHED" rules rest on repository docs plus an owner-stated requirement; they were not independently validated beyond reading the cited documents.

## Maturity

**INTERNAL DOGFOOD.** See the README and [MATURITY.md](MATURITY.md). Before any public announcement: dogfood on at least one structurally different project, add native and non-React fixtures, have a second person write a profile, and re-run all dogfood scenarios on the refined skill.
