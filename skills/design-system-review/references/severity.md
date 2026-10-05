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
   honestly disclosed; do not report it as an oversight.

## Verdicts

### Review verdict (all modes except `release`)

- **PASS** — no P0/P1; P2/P3 absent or trivial for the scope.
- **PASS WITH NOTES** — no P0/P1; P2/P3 findings worth tracking.
- **FAIL** — any P0 or P1 within the reviewed scope.

A PASS only covers the reviewed scope. Always state the scope.

### Release verdict (`release` mode)

- **READY** — no unresolved P0/P1 in scope; compatibility, docs and claims verified.
- **READY WITH NOTES** — no unresolved P0/P1; known limitations are documented and non-misleading.
- **NOT READY** — any unresolved P0/P1, an unverified public claim, an undocumented breaking change, or required gates not run.

Green CI is an *input* to the release verdict, never the verdict.
