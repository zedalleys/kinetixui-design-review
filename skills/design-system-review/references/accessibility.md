# Accessibility

This is an implementation review aid, **not** an accessibility scanner
replacement and not a conformance guarantee. Use the project's own a11y tooling
when present; supplement it, don't duplicate it. Never write "accessible" as a
blanket verdict — state which checks were performed.

**Discover first.** Target standard (WCAG level? platform guidelines?), a11y
test tooling (axe, jest-axe, Playwright a11y, Accessibility Insights, XCUITest
audits, Compose semantics tests, Flutter semantics tests), documented a11y
contracts per component, known baselines/exemptions.

## Dimensions (apply those relevant to the component)

| Dimension | Check |
|---|---|
| Semantics | Native element/control used where one exists; correct role; landmarks/headings in blocks |
| Accessible name | Every interactive/informative element has a name that matches its visible label (label-in-name) |
| Keyboard | Reachable, operable, logical order, expected key model for the pattern (roving focus, arrow keys, Escape), no traps |
| Focus | Visible, sufficient contrast, not clipped, survives themes; managed on open/close of overlays |
| Touch targets | Against the **project's** target or platform convention (discover it) — see below |
| Contrast | Text and non-text, through real themes |
| State | Selected/expanded/disabled/invalid/busy exposed to AT and matching visuals |
| Errors | Programmatically associated, announced, not color-only |
| Reduced motion | Information preserved, not just animation removed |
| Zoom / text scaling | Usable at 200% zoom (web) and large platform text sizes |
| Forced colors / high contrast | Boundaries and state remain visible |
| Screen-reader duplication | No double announcement of icon + label, decorative visuals hidden |
| Color-only communication | Status/selection has a non-color cue |

## Principles

- **Prefer native semantics.** "ARIA makes it accessible" is an anti-pattern. Do not add ARIA because an audit expects ARIA; first-rule-of-ARIA applies (use native if you can). Flag redundant or contradictory ARIA as a defect.
- **Platform-appropriate.** Web: roles/ARIA/focus. SwiftUI/UIKit: accessibility traits, labels, Dynamic Type, VoiceOver. Compose: `semantics`, `contentDescription`, TalkBack, font scale. Flutter: `Semantics`, `MergeSemantics`, text scale factor. Don't demand web concepts of native code.
- **Touch targets:** discover the declared target (design docs, tokens, tests) or the relevant platform convention. Targets differ by platform (web WCAG minimums, iOS/Android/Flutter guidance); apply each platform's own, and do not port a number from one to another. Sizes derived from class names/line-heights are **INFERENCE (computed)** until measured. Do not hard-code a guessed universal size. **Never shrink a target to fix visual crowding** — fix composition (spacing, layout) instead.
- **Focus visibility** must survive: custom themes, dark mode, cards/overlays with `overflow: hidden`, charts, and neighboring controls. Check clipping by ancestors.
- **Name reaches the semantic element.** Verify the accessible name/description/state lands on the *focusable, role-bearing* element, not merely on a wrapper or component host. In component frameworks, binding an attribute on a component's host element (e.g. Angular `[attr.aria-labelledby]` vs an aliased input, Vue/Svelte attribute fallthrough, a web component's shadow boundary) may never reach the inner control. A test that asserts only the host attribute proves nothing about the control's name — check the inner element's computed name.
- **Overlays:** focus trap and restoration, `Escape`, background inert/hidden, portal direction.

## Evidence

Prefer accessibility-tree queries (role + name), a real keyboard walk-through,
and computed contrast. Record which assistive-tech behaviors were *not* tested
(you usually cannot run a real screen reader — say so).

## Common false positives

- Flagging a native `<button>`/`<select>` for "missing role".
- Demanding `aria-label` where visible text already names the control.
- Reporting an automated-scan "pass" as full conformance, or a scan "violation" in a mocked/placeholder context as a product defect without checking.

## Severity hints

Inaccessible primary interaction or keyboard trap → P0. **Any interactive control with no accessible name → P1** (P0 if it is the only way to complete a primary task).
Missing state exposure on a secondary control → P1/P2. Name/label mismatch with
low impact → P2. Document the standard you judged against.
