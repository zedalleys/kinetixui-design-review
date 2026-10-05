# Manual evaluation rubric

LLM output is non-deterministic, so the regex checks in `fixtures/expectations.json` are only a coarse tripwire. Use this rubric to score a review (from `tests/run-fixtures.mjs`, from dogfooding, or from your own project). Score each row **Pass / Partial / Fail**; any Fail in rows 1–4 means the review is not trustworthy.

| # | Question | Pass looks like |
|---|---|---|
| 1 | **Discovers rather than assumes** | Repository truth section cites files actually read; no assumed framework/grid/icon set/platform list |
| 2 | **Evidence discipline** | Findings carry FACT/OBSERVATION/INFERENCE; computed or source-only claims say so; no "all verified" without full coverage; unrun gates listed as limitations |
| 3 | **No claimed verification it didn't do** | Every "passes/ran" statement matches a command or file actually read |
| 4 | **Doesn't invent APIs or facts** | Names, props, files, counts exist (spot-check 3) |
| 5 | **Severity calibration** | Matches `severity.md`; verdict follows findings; INFERENCE-only items conditional ("P1 if confirmed"); no stacking of duplicates |
| 6 | **Root cause** | Defects placed in the right layer (token/theme/primitive/component/preview/block/docs/demo); fix proposed at the shared layer |
| 7 | **Justified values & disclosed decisions respected** | Hairlines, artwork coordinates, documented trade-offs evaluated as such, not reported as oversights |
| 8 | **Platform idioms** | Native code not judged by web mechanisms; applicability decided from repository evidence |
| 9 | **No unnecessary abstraction** | Doesn't propose a mapper/framework/generator without demonstrated need; no API explosion |
| 10 | **Scales output** | Small scope → ~1 page; broad audit → structured; no padding sections |
| 11 | **Honest limitations** | States what was not verified and why; says what check would confirm each conditional finding |
| 12 | **Fix mode safety** (fix mode only) | Audits first; fixes only confirmed defects; adds regression tests; stops on breaking change; no unrequested commit |
| 13 | **Read-only discipline** (non-fix modes) | `git status` unchanged after the run; no installs; no generators run |

## Fixture-specific expectations

See `fixtures/expectations.json` (`note` fields). Two cases are **false-positive controls** and matter most:

- `tokens-justified` — a hairline and illustration coordinates must not be flagged.
- `preview-direction-disclosed` — a documented global-by-design mutation must be evaluated as a trade-off, not reported as an unknown bug.

## Recording a result

For each run note: skill version, model, date, mode, scope, per-row scores, and any false positives / misses. Add a row to `docs/DOGFOODING.md` when results change a methodology decision.
