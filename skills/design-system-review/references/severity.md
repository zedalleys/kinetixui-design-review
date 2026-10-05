# Severity and verdict model

Severity describes **impact on users and on the system's integrity**, not how
much you dislike something. Do not inflate. When unsure between two levels,
choose the lower one and say what evidence would raise it.

## Levels

| Level | Name | Meaning | Typical examples |
|---|---|---|---|
| **P0** | Blocker | Functional, accessibility, security or release blocker. A user cannot complete a primary task, or shipping would cause harm. | Keyboard trap in a modal; control with no accessible name on a primary action; public component throws on documented usage; secret in a published bundle. |
| **P1** | System integrity | Material architectural or interaction defect that undermines trust in the system. | Demo state leaks into the app shell; critical state contradicted across text/control/visual; broken public API contract; major interaction inaccessible; serious parity failure against a *claimed* capability. |
| **P2** | Maturity | Meaningful consistency, maintainability or UX problem that does not break trust outright. | Token leakage in reusable components; spacing/geometry defect; incomplete customization; docs gap; inconsistent icon API. |
| **P3** | Polish | Nonessential visual or refinement issue. | Optical icon balance; shadow weight; minor copy tweak. |

## Calibration rules

1. **Claimed vs. unclaimed.** A parity gap is P1 only if the project *claims*
   the capability. An unclaimed or explicitly "preview" gap is P2 at most, and
   often just a note.
2. **Reach matters.** A defect in a shared primitive that every component
   consumes outranks the same defect in one demo.
3. **Reversibility matters.** A breaking public API change is worse than an
   internal refactor with the same shape.
4. **Evidence caps severity.** An INFERENCE alone should not produce a P0 or P1
   unless the failure mode is severe and cheap to confirm — in which case say
   "P1 if confirmed" and name the check that would confirm it.
5. **Do not stack duplicates.** One root cause = one finding with a list of
   affected sites, not N findings.
6. **Intentional ≠ correct, but it changes the question.** If the code or docs
   state a deliberate trade-off, evaluate whether the trade-off is sound and
   honestly disclosed; do not report it as an oversight. Then apply the
   rule-conflict calibration below.
7. **Rule conflicts.** When a *deliberate, disclosed* design conflicts with a
   rule the project itself marks ESTABLISHED (profile, ADR, contributing docs):
   - no project rule conflicts → **P2 at most**, plus an audit question;
   - conflicts with an ESTABLISHED rule **and** the user-visible effect is real or likely (e.g. whole-shell mirroring, broken mixed chrome) → **P1**, status *needs owner decision* (amend the rule with a stated exception, or change the code). Quote the rule and the stated rationale side by side; do not call it an oversight.
   - conflicts with a PROVISIONAL rule or an AUDIT QUESTION → note/P2; never P1 on that basis alone.
8. **Disclosure reduces severity only if users can perceive it.** A trade-off disclosed only in a code comment or screen-reader-only text is disclosed to maintainers, not to the sighted evaluator.
9. **Known/tracked results.** A check the project reports as a *known, tracked* exception is a disclosed state; report it as context. It becomes a finding only if it regressed, or if a new surface does worse than the tracked baseline.
10. **Test absence is not a defect by itself.** Missing test coverage is P2/P3 unless the project claims that verification kind (or the platform's chosen tier is compile/CI-only by design — then it is a note).

## Verdicts

### Review verdict (all modes except `release`)

- **PASS** — no P0/P1; P2/P3 absent or trivial for the scope.
- **PASS WITH NOTES** — no P0/P1; P2/P3 findings worth tracking.
- **FAIL** — any P0 or P1 within the reviewed scope.

**Conditional findings.** An INFERENCE-backed item that would be P0/P1 if confirmed is listed as **"P1 if confirmed"** (never a bare P1), counts as P2 for the verdict, and its confirming check heads the Recommendations.

**Annotations.** A verdict may carry a short annotation — e.g. `FAIL — needs owner decision` for a disclosed trade-off that conflicts with an ESTABLISHED rule — but the three verdict words themselves do not change.

The verdict is *derived from the findings*: never FAIL on P2/P3-only findings, and never PASS with an open P0/P1. If a finding is "P1 if confirmed" and you could not confirm it, the verdict is PASS WITH NOTES and the confirming check heads the Recommendations.

A PASS only covers the reviewed scope. Always state the scope.

### Release verdict (`release` mode)

- **READY** — no unresolved P0/P1 in scope; compatibility, docs and claims verified.
- **READY WITH NOTES** — no unresolved P0/P1; known limitations are documented and non-misleading.
- **NOT READY** — any unresolved P0/P1, an unverified public claim, an undocumented breaking change, or required gates not run.

Green CI is an *input* to the release verdict, never the verdict.
