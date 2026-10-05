# Example: KinetixUI profile — real runs

These are **real outputs** from headless runs (`claude -p --plugin-dir . ...`) of this skill against the KinetixUI repository at commit `5db94f0`, using the `kinetixui` profile. They are included to show what a review looks like, **not** as confirmed defects:

- Runs were strictly read-only (the repository stayed clean — checked with `git status` after each run). No gates were executed.
- Findings are the reviewer's source-only conclusions. KinetixUI maintainers have not confirmed them. Treat them as leads.
- Outputs are lightly trimmed (the trailing "Skill feedback" sections were used to improve the skill, see [docs/DOGFOODING.md](../docs/DOGFOODING.md)).
- Runs vary between invocations; two runs of the block review found different issues (see DOGFOODING).

Other prompts used: `Use design-system-review in component mode with the kinetixui profile to review the Button component`, `... theme mode ... color/theming architecture`, `... cross-platform mode ... Select`, and a stateful-controls review of the IoT thermostat/door-lock/light examples.

---

## 1. RTL — "Does switching direction in a preview change unrelated site UI?"

Prompt: `Use design-system-review in rtl mode with the kinetixui profile. Review the component-preview direction (LTR/RTL) control on the docs site and the Fields (field.tsx) preview: does switching direction in a preview change unrelated site UI?`

## Verdict: **FAIL** (needs owner decision)

The direction control changes the whole docs site, not just the preview. This is a source-only finding, so every claim below is FACT or INFERENCE, not browser-measured. The repository was not modified. `git status` was clean before and after.

## Scope
- **Reviewed:**
  - `apps/web/src/components/preview-environment.tsx` and its test
  - `lib/use-document-direction.ts`
  - `component-preview.tsx` and `showcase.tsx`
  - `app/docs/components/field/page.mdx`
  - `packages/ui/src/components/field.tsx`
  - `docs-sidebar.tsx` and `mobile-nav.tsx` (sampled for shell collateral)
- **Profile rules applied:** ESTABLISHED 6 (preview state must not leak into the shell) and 7 (RTL needs logical properties plus the direction context), plus the "Preview isolation" scenario.
- **Not run:** no browser, no gates (`check:rtl` and the others), no dependency installs.

## Findings

**P1 (rule conflict, needs owner decision): the direction toggle mirrors the entire page.**
- **FACT:** `setDirection` calls `document.documentElement.setAttribute("dir", next)` (`preview-environment.tsx:65`). The toggle's own screen-reader text says "applies to the whole page".
- **FACT:** The leak covers the header, sidebar, TOC, other previews and any sibling demos, because they all inherit from `<html dir>`.
- **FACT:** This is deliberate and disclosed. The header comment says Radix portals overlays to `document.body`, which is outside the stage. The test (`preview-environment.test.tsx:44-53`) asserts that `documentElement` gets `rtl`. That is the opposite of the profile's ESTABLISHED rule 6, so I'm reporting it as a rule conflict, not an unknown bug.
- **Answer to your question:** yes. Switching direction in the Fields preview changes unrelated site UI. INFERENCE: this holds for Fields too, because `field-demo` goes through the same `ComponentPreview` → `PreviewEnvironment` path. I did not run it in a browser.
- **Root-cause layer:** preview infrastructure (layer 5).

**P2: the shell was not built to be mirrored.**
- **FACT:** Physical properties remain in the shell. `docs-sidebar.tsx:26-48,67,76,83` uses `-ml-2`, `pr-4`, `left-2.5`, `pl-8 pr-7`, `right-1.5`, `border-l` and `ml-2`. `mobile-nav.tsx:69` uses `ml-2`.
- **INFERENCE:** On RTL, the search icon and clear button, the active-item border and the badge spacing will be on the wrong side. This is collateral from the same root cause: the global flip forces the shell to cope.
- **Also:** `use-document-direction.ts` and several showcase/IoT components exist only to stop Radix Tabs from forcing LTR once `<html dir>` flips. This is more coupling from the same cause.

**P3 (a gap, not a bug):**
- **FACT:** The test proves that `<html dir>` flips. No test asserts that the shell stays LTR, so the suite locks in the leak.
- **FACT:** The unmount reset (`listeners.size <= 1`) is guarded and tested, so navigating away does not leave the site mirrored.

**No finding on `field.tsx`:**
- **FACT:** It has no physical-direction classes, and `dir="ltr"` appears only once, at line 85.
- **FACT:** I did not read the `field-demo` source. RTL fidelity of the Field component itself was not verified.

## Options for the audit question
The profile asks whether a scoped provider can reach portals without mirroring the shell.
1. **Keep the global flip.** It is cheap and demonstrates a real integration, but the shell must be converted to logical properties. This is the current state.
2. **Scope direction to the stage and pass a portal container.** Radix supports a `container` prop on Portal. `KinetixDirectionProvider` already covers context. The cost is that each overlay demo needs the container wired in, or the library needs a portal-container context. INFERENCE: feasible, but I did not verify it. The code comment says the portaled node stayed `ltr` when only the stage had `dir`. That comment is a claim I did not reproduce.
3. **Use an iframe per preview.** This is the heaviest option, and the code comments already reject it for the 98 static pages.

**Recommendation:** owner decides. If rule 6 stays ESTABLISHED, option 2 is the one to prototype. If the global flip is accepted as a disclosed exception, amend the profile, and convert the sidebar and mobile nav to logical properties (`ms-`, `ps-`, `start-`, `border-s`) in either case.

## Limitations
- No runtime check. The browser diff of `<html dir>` and shell computed `direction` that the scenario calls for was not done.
- `check:rtl`, `check:a11y-browser` and the other gates were not run.
- The shell sample was 2 files plus a grep. Header, TOC and layout were not individually confirmed.
- `field-demo` and the Field component's RTL rendering were not read.

---

## 2. Block — `settings-list`

Prompt: `Use design-system-review in block mode with the kinetixui profile to review the 'settings-list' block.`

## Verdict: PASS WITH NOTES, leaning to FAIL on Angular

I rate the Angular finding P1 on source evidence only; I did not run it. If a runtime check confirms the switch has no accessible name, the verdict becomes FAIL.

**Scope:** `settings-list` across the five sources in `blocks.manifest.json`: React, Angular, SwiftUI, Compose and Flutter. This was a source read, with no gates run and no files modified. `git status` was clean at the end.

**Repository truth (as of now):** the block is listed as `stable` in `blocks.manifest.json` and as five-platform in `block-parity.json`. The SwiftUI, Compose and Flutter "sources" are test files that carry a `kx-block:start/end` fixture.

**Real user need:** let someone change which notification channels reach them and see that each change took effect. The block is purely presentational: it has no data, loading or error states, so those checks are n/a.

### Findings

**P1 (INFERENCE, high confidence; not run). Angular switches likely have no accessible name.**
- Location: `packages/ui-angular/src/examples/blocks/settings-list.ts:34`.
- The block binds `[attr.aria-labelledby]`, which sets a host attribute on `<kx-switch>`.
- `KxSwitch` takes its name from an input aliased `aria-labelledby` (`packages/ui-angular/src/lib/toggles.ts:146`) and renders it on the inner `<button role="switch">`. An `[attr.*]` binding doesn't feed that input, so the focusable button probably gets neither label nor labelledby.
- The block's own test (`blocks.spec.ts:85-94`) only checks the host attribute, so it passes whether or not the button is named.
- Root-cause layer: block composition. The binding should be `[aria-labelledby]`.
- To confirm: mount the block and read `button[role=switch]`'s accessible name.

**P2 (FACT). The accessibility claims in the SwiftUI, Compose and Flutter comments and tests aren't backed by code.**
- The SwiftUI comment says combining the element makes VoiceOver announce "Email, …, switch, on". I found no `accessibilityElement(children: .combine)` in `List.swift` or `Switch.swift`, only `.accessibilityValue`.
- I found no row-to-switch semantics merging in the Compose `List.kt` or `Switch.kt`.
- Flutter's `Switch` is `Semantics(container: true, toggled: …)` with no label from the row.
- The row title is probably not exposed as the switch's name on any native platform. That is INFERENCE, since I didn't read `ListItem` internals on every platform or run a screen reader.
- The only native tests are existence or compile checks (`XCTAssertNotNil(...body)`, `assertExists`, `find.text`). None checks name, role or state.

**P3 (FACT). Platforms name their switches in different ways.**
- React uses a hard-coded `aria-label="Email notifications"`, which differs from the visible "Email".
- That contradicts the Angular comment's stated principle, which rejects a hard-coded label because the name would drift from the title.
- Under the profile's ESTABLISHED rule 4, parity means equivalent semantics. The mechanisms may differ, but the announced name should match the row title.

**P3 (OBSERVATION). The block has no hosted state.**
- React uses uncontrolled `defaultChecked`; the others use local state.
- Nothing shows that a change was applied, and the sample data isn't labelled as placeholder. This is acceptable for a demo fixture.

### Checked and no defect found
- **Angular tokens:** spacing, border width and type use `--spacing-*`, `--border-width-default` and `--text-*`. Only the `hsl(var(--border))`-style colour wrappers are local. I judged this consistent with the repo's pattern without checking it against the token contract.
- **Angular RTL:** it uses logical `border-block-start`. The flex layout mirrors on its own.
- **Angular composition:** it uses a real `<ul>` because `kx-list` doesn't exist yet, and the file discloses this.
- **Regression scenarios:** none of the profile's scenarios apply to this block.

### Recommendations
1. Change the Angular binding to `[aria-labelledby]`, and make the test assert the inner `button[role=switch]`'s name.
2. Check each native platform's actual name, role and state output, and add one semantics assertion per platform.
3. Align the React row naming with the other platforms, or document why it differs.

### Limitations
- Nothing ran: no gates, browser, screen reader or native toolchain. `check:blocks` and `check:a11y-*` were not run, to stay strictly read-only.
- I didn't check responsive behaviour, zoom, or dark theme.
- I didn't read the React `ListItem` or the native `ListItem` internals in full.
- I didn't check `verification.json` for block-level kinds.
