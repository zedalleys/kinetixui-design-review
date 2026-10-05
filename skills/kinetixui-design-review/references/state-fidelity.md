# State fidelity and demo truthfulness

## State fidelity

For any stateful component, block or demo, one **canonical state** must stay
coherent across every representation:

CANONICAL STATE → TEXT → CONTROL → ICON → VISUAL/ILLUSTRATION → ACCESSIBILITY

**Method:** enumerate the states (including off/disabled/loading/error/offline/
empty, not just the default), drive the component into each, and record what each
representation says. Any disagreement is a finding.

Typical contradictions:

- "Unlocked" label + closed-padlock illustration.
- "Off" label + illuminated light.
- Selected visual + `aria-selected=false` / unselected a11y state.
- Offline status text + "live"/pulsing indicator.
- Toggle thumb position inconsistent with its checked semantics.
- Disabled look but still focusable/operable (or the reverse).

**Domain truth matters.** Related states are not interchangeable: UNLOCKED is not
automatically OPEN; PAUSED is not STOPPED; MUTED is not OFF; CONNECTED is not
AUTHENTICATED. Before judging, establish the domain's actual state model (docs,
types, enum) and check each representation against *that*, not against a
convenient synonym.

**Do not assume which states a visual should show.** If a device has modes (e.g. heat / eco / off), establish from the project's state model or docs which mode the art is meant to distinguish. Rendering a lower-power mode like the "off" state may be a deliberate simplification or a defect — when no state model decides it, report an **AUDIT QUESTION**, not a defect.

**Decorative art that is honestly labelled** (e.g. `aria-hidden`, header says state is carried in words) is not a contradiction. Judge: (a) the text/control/a11y state agree with each other, (b) the art never asserts something false, (c) whether it *could* show the state it sits next to and the project claims it does. "The art cannot show state" is a note (P3/P2) unless the project claims otherwise; it is P1 only if the art *contradicts* a critical state.

**Root cause:** is there a single source of state that all representations derive
from (good), or do text/visual each keep their own flag (bug magnet)? Fix by
deriving representations from one canonical value; do not patch each
representation separately.

**Severity:** contradiction on a *critical* state (security, safety, power,
connectivity, destructive action) → P1. On a decorative or secondary state → P2.

## Demo truthfulness

Interactive examples must not imply capabilities that do not exist. Check:

| Look for | Honest treatment |
|---|---|
| Sample vs. live media | Labelled "sample"/placeholder |
| Simulated vs. actual telemetry | Labelled simulated; no fake live timestamps |
| Local UI state vs. backend acknowledgment | Distinguish "requested" from "confirmed" where the product would |
| Placeholder / generated data | Not presented as real records or testimonials |
| Mocked devices/services | Stated as mocks |
| Controls that appear to switch an environment but do nothing | Remove, or report the true state instead of faking it |

"A control that looks like it switches an environment but does not is worse than
no control" — because the reader believes the result.

Truthfulness is part of design-system quality: demos are how evaluators decide
what the system can do. Severity: demo claiming a capability the library lacks →
P1 if it influences adoption decisions materially, otherwise P2.
