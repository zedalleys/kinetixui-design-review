# Finding classes

Every finding has a **class** (what kind of thing it is) in addition to an
evidence label and, where applicable, a severity. Classes keep reports honest:
not every observation is a defect, and not every improvement is a problem.

## The four classes

| Class | Definition | Needs | Severity? |
|---|---|---|---|
| **DEFECT** | Something observably violates a stated contract, a project rule, or an applicable standard (functional, accessibility, security, API, documented behavior). | The contract/rule/standard being violated + evidence of the violation | **Yes** — P0–P3 |
| **INCONSISTENCY** | Two parts of the system disagree (two components, two platforms, docs vs code, text vs visual, manifest vs source) and the project has not stated which is right. | Both sides shown, side by side; the missing decision named | **Yes** — usually P2; higher if a critical state or public claim is involved |
| **RISK** | Not currently failing, but a plausible failure given likely change or an unconfirmed condition (including *"P1 if confirmed"* items backed only by INFERENCE). | The condition under which it fails; the check that would confirm or retire it | **Conditional** — "P1 if confirmed"; counts as P2 for the verdict until confirmed |
| **OPPORTUNITY** | An improvement that no contract or rule requires: simplification, a missing token/slot, better defaults, scalability. | The benefit and a rough cost; why it is not a defect | **No P-level.** Mark value (low/medium/high) and effort (low/medium/high) |

## Rules

1. **Classify the lowest-assertion class the evidence supports.** If you cannot name the violated contract, it is not a DEFECT: it is an INCONSISTENCY (two things disagree), a RISK (conditional), or an OPPORTUNITY.
2. **Defects need a measuring stick.** "Looks off" is not a DEFECT. Name the token scale, a11y criterion, API doc, ADR, or profile rule.
3. **Inconsistencies are decisions waiting to be made.** State the question for the owner ("which is canonical?"). Resolve it only if the project already decided; otherwise recommend the decision and the migration.
4. **Risks must be falsifiable.** Name the trigger and the check. A RISK that cannot be checked is an OPPORTUNITY or noise.
5. **Opportunities never move the verdict.** They are listed separately, last, and kept short; do not use them to pad a report. Do not present a preference as a requirement (see the rule lifecycle in `SKILL.md`).
6. **Promotion and demotion.** A RISK becomes a DEFECT when confirmed (re-class it and set severity); a DEFECT whose contract turns out not to exist becomes an INCONSISTENCY or OPPORTUNITY. Say when you reclassified.
7. **One root cause, one finding**, with its class, and a list of affected sites.

## Verdict interaction

- DEFECT and INCONSISTENCY severities drive PASS / PASS WITH NOTES / FAIL (`severity.md`).
- RISKS are visible in the report; unconfirmed "P1 if confirmed" risks count as P2 for the verdict and head the Recommendations with the confirming check.
- OPPORTUNITIES never change a verdict.

## Report line format

```
[CLASS · severity · evidence-label · confidence · level]  title
  where: path:line
  contract/standard: …           (DEFECT, INCONSISTENCY)
  condition & check: …           (RISK)
  value/effort: …                (OPPORTUNITY)
  root-cause layer: …
```

Example headers: `[DEFECT · P1 · FACT · high · V3]`, `[INCONSISTENCY · P2 · FACT · high · V1]`, `[RISK · P1-if-confirmed · INFERENCE (computed) · medium · V1]`, `[OPPORTUNITY · value: medium · effort: low · OBSERVATION · medium · V1]`.
