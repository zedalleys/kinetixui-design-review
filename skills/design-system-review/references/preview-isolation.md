# Preview and demo state isolation

A first-class audit category. Documentation sites, Storybook-like galleries and
playgrounds let readers flip controls on a component demo. Those controls must
affect what they claim to affect — and nothing else.

## Discover the controls

Demo controls may include: RTL/LTR · theme · platform · variant · state ·
density · size · orientation · viewport · color palette. List the ones this
project exposes and, for each, **the intended scope** (this demo only? this page?
the whole site?). Look for the intent in code comments, docs and tests before
deciding; if none is stated, treat the scope as an AUDIT QUESTION.

## Where state can leak

Check whether a control's state reaches:

- the application/docs **shell** (header, sidebar, footer)
- **navigation** and routing
- **other demos** on the same page or other pages
- **other components** outside the preview boundary
- **persisted storage** (`localStorage`, cookies, URL) — is persistence intended?
- **document root / body** (`document.documentElement`, `<body>` attributes/classes, `:root` custom properties)
- unrelated contexts (global providers, module-level stores)

Search leads (verify each in context): writes to `document.documentElement` /
`document.body`, `classList.toggle('dark')` on root, `setAttribute('dir'`,
module-level mutable singletons, `useSyncExternalStore` over global stores,
`:root` variable overrides from component code, `localStorage.setItem` in demo code.

## Judging a leak

Unless a control is **intentionally global**, demo state should remain scoped to
its demo. A global effect can still be a *deliberate, disclosed trade-off*
(for example, portaled overlays attach to `<body>` and must see the demo's direction).
Evaluate in this order:

1. **Is the scope stated** (comment/docs/UI label)? If yes, it is not an oversight — assess whether the trade-off is sound and honestly disclosed.
2. **Is a scoped alternative feasible?** E.g. a direction/theme *provider or context* supplied to the portal container, a scoped CSS variable root, or an isolated container/iframe/shadow boundary for the preview.
3. **What is the user-visible cost?** Whole shell flips direction; sibling demos change; state persists across navigation.
4. **Does the project rule allow it?** If the active profile says "preview state must not leak into the site shell" (ESTABLISHED), a documented global mutation is a *conflict with the project's own rule* — report it as such (P1 or P2 by impact), quoting both the rule and the rationale, rather than as an unknown bug.

Do not blindly demand an iframe per demo: the cost (weight, loss of shared theme,
many static pages) may be justified. Present the options with costs.

## Truthful controls

A control that appears to switch an environment but cannot (e.g. a "reduced
motion" button when the contract is a media query) is worse than none. Prefer
reporting the true state to faking a toggle (see `state-fidelity.md`).

## Verification

Runtime: in a browser, toggle each control and diff the observable state of
unrelated regions (`<html>` attributes, computed `direction`/colors of the shell,
other demos). Source-only reading yields INFERENCE. A regression test is ideal:
"toggling X in demo A does not change attribute Y on `<html>` / shell element Z."
Use a negative control (see `verification.md`) to prove the test can fail.

## Severity hints

Unintended global leakage → P1. Intended-but-undisclosed global effect → P2.
Disclosed, rule-conflicting trade-off → P2 plus an explicit audit question.
