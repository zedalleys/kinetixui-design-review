# Motion

**Discover** the motion architecture: duration/easing tokens, CSS transitions
vs. JS animation libraries vs. native animation APIs (SwiftUI `withAnimation`,
Compose `animate*AsState`, Flutter implicit/explicit animations), reduced-motion
handling, any motion lint/check scripts.

Motion should help explain **state, hierarchy, or relationship** — not merely
decorate. "Add animation" is not a finding; "this state change is unexplained
and motion would clarify the relationship" can be.

## Audit

- **Entrance / exit** — present, symmetric where appropriate, not blocking interaction.
- **State changes** — feedback timing proportional to importance.
- **Overlays** — origin/direction consistent with trigger; focus not lost during transition.
- **Loading** — indeterminate vs. determinate honesty; not faked progress.
- **Continuous motion** — spinners, marquees, auto-advancing content: pausable, non-essential, bounded.
- **Carousels** — auto-advance control, pause on focus/hover, reduced-motion behavior.
- **Reduced motion** — see below.
- **Hard-coded durations / inconsistent easing** — vs. the project's motion tokens.
- **Unnecessary JS animation** — where CSS/native transitions suffice.
- **Layout-heavy animation** — animating `width/height/top/left` instead of `transform/opacity` (web); causing relayout of siblings.

## Reduced motion

Reduced motion must **preserve information**, not simply remove animation. A
progress or state change communicated only by movement needs an alternative
cue (instant state swap, label, color/shape change). Check the platform signal:
web `prefers-reduced-motion` / `motion-reduce:`; iOS Reduce Motion; Android
animator duration scale; Flutter `MediaQuery.disableAnimations`.

Note: a media-query-driven contract cannot be toggled by a class, so a preview
"reduced motion" button may only be able to *report* the setting, not simulate it.
Judge demos on whether they are honest about this.

## Cross-platform

Do **not** impose one universal motion language across native platforms. Check
each platform for *its own* idioms and for consistent *intent* (what is
explained), not identical curves.

## Evidence

Reduced-motion: emulate the media feature in a browser and observe; or read the
gating code and mark INFERENCE. Perf claims: measured (DevTools/trace) or
labelled INFERENCE.

## Severity hints

Essential info lost under reduced motion, or motion that cannot be stopped when auto-playing → P1. Inconsistent durations/easing → P2. Easing taste → P3.
