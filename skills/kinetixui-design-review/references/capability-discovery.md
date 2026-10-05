# Capability discovery

Before auditing, find out **what this review can actually do in this
environment**. Capabilities cap the strongest evidence you can produce; naming
them up front keeps claims honest and explains degraded results.

Probe cheaply and read-only. Do not install anything to "gain" a capability in a
read-only review.

## Probe checklist

| Capability | How to probe (read-only) | Unlocks |
|---|---|---|
| **Read repository** | list the tree, read manifests | everything at V1 (source) |
| **VCS state** | `git status --porcelain`, `git log -1` | before/after cleanliness check; recency of evidence |
| **Language runtimes / package managers** | `node -v`, `python3 -V`, presence of `node_modules`, lockfiles | running dependency-free project scripts |
| **Project gates runnable** | read `package.json` scripts / Makefile / CI; check whether dependencies are present; skim a script for write calls | V2 (gated) evidence — see "Gate safety" in `verification.md` |
| **Browser / renderer** | look for a preinstalled browser (e.g. configured Playwright/Chromium path) or an existing browser-based project check | V3 (runtime) evidence for web: geometry, computed styles, accessibility tree, zoom |
| **Dev/preview server** | project's documented start command; is the port free; does it need installs/writes | rendering real pages |
| **Platform toolchains** | Xcode/`xcodebuild`, Gradle/Android SDK, Flutter/Dart, Angular CLI present? | native builds, previews, platform tests |
| **Assistive technology** | normally absent; say so | never assume screen-reader evidence |
| **Network** | do not assume; do not upload repo contents | fetching public standards only if the user allows |
| **Write permission** | mode (`audit` vs `fix`), tool permissions | whether fixes/tests may be written |

## Record the result

Produce a short **Capability table** (include it under Evidence or Limitations):

```
Capability            State        Effect
Source read           available    V1 for all findings
Project gates         partial      pure `check:*` scripts ran; test runner not run (needs install)
Browser/runtime       unavailable  geometry findings are INFERENCE (computed); web ceiling V1/V2
SwiftUI toolchain     unavailable  native findings source-only
```

States: **available**, **partial** (say what), **unavailable**, **not tried** (say why).

## Consequences

- The **verification ceiling** for each platform/dimension is the highest level whose capability is available (`verification.md`). Findings never claim more than their ceiling.
- A missing capability puts the review in a **degraded state** (named in the report), not silently in a weaker mode.
- If a missing capability would change a verdict (e.g. you cannot confirm a P1-if-confirmed), the Recommendations must start with the exact check that would.
- Capabilities may differ per platform (web runtime available, native toolchains not). Record them per platform.

## Do not

- Install dependencies, browsers or toolchains in a read-only review.
- Treat "could not run" as "passed".
- Upload repository contents anywhere to gain a capability.
