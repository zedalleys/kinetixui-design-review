# Documentation and API truth

Audit whether **public behavior is documented truthfully**. Documentation is a
public contract; aspirational documentation is a defect.

**Discover first.** Docs location(s) (site, MDX, Storybook, README, generated
API docs), what is hand-written vs. generated, how examples are produced
(extracted from real source vs. hand-pasted), docs tests/link checks.

## Every public component/feature page should answer

1. What is this?
2. When should I use it (and when not)?
3. What is the default behavior?
4. How do I customize it?
5. Accessibility expectations (keyboard model, labelling requirements).
6. Platform differences / availability.
7. Limitations.

## Truth checks

- **Examples use real APIs.** Compile/run at least the examples in scope against the actual package; a doc example that does not compile is a defect. Prefer examples extracted from tested source over hand-pasted code.
- **Props/tables match types.** Compare documented props, defaults, enums against exported types.
- **Claims match evidence.** "Supports RTL", "accessible", "available on X" → find the implementation/test that backs it. Distinguish DEFINED / GENERATED / IMPLEMENTED / CONSUMED / VERIFIED for platform claims.
- **No aspirational functionality.** Planned features must be labelled as planned or absent.
- **Versioning.** Docs match the version shown; removed APIs not still documented.

## When docs and code disagree

Treat the **code and tests as FACT** and the contradicting doc as the finding (stale or aspirational documentation), unless the doc records an *approved decision the code has not yet implemented*. Prefer fixing the doc/decision record that is wrong; a ledger that says "removed" about something that exists is a truthfulness defect (P2, P1 if it misleads adoption decisions).

## Customization discoverability

For extensible systems, a user must be able to discover **without reading source**:
theme customization · icons · tokens · component slots · variants · RTL ·
accessibility · platform integration. Test it: pretend to be a new developer with
the docs only — can you change the primary color, replace an icon, and enable RTL?

## Output hygiene

Check also for stale counts ("64 components") and numbers that should be
generated; prefer generated values or omit them.

## Severity hints

Docs claim a capability that does not exist or contradicts a public contract → P1 (truthfulness). Missing customization docs for a documented-capable feature → P2. Typos/wording → P3.
