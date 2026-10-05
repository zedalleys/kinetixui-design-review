# Security and privacy

## What this repository is

Markdown instructions (a Claude Code skill), two JSON manifests, and small Node scripts for local validation. It contains **no network code, no telemetry, and no service**.

## Data handling

- The skill runs inside your Claude Code session. It reads your repository the same way any Claude Code task does; it adds no uploading, collection or reporting of source code.
- `tests/validate.mjs` is offline. `tests/run-fixtures.mjs` invokes your local `claude` CLI on the repository's own fixtures only.
- Any future telemetry would have to be explicitly opt-in and is out of scope for v0.1.

## Review-mode safety

`audit` and the other review modes are read-only by instruction (see "Gate safety" in `references/verification.md`). Instructions are not a sandbox: if you need a hard guarantee, run reviews with a read-only permission mode or disallow `Edit`/`Write` tools.

## Reporting a vulnerability

Please report privately through the repository's "Report a vulnerability" (GitHub security advisories) once the repository is published, rather than a public issue. Until then, contact the maintainers directly. Include the affected file, a reproduction, and the impact (for example: an instruction that could cause a destructive action, or a script that executes untrusted input).
