# Project profiles

A **profile** carries project-specific knowledge so the generic core does not
have to. It never replaces discovery: it tells the reviewer *where to look* and
*what this project has decided*.

## Convention (v0.1)

One Markdown file per project: `profiles/<project-name>.md`. No registry, no
code, no plugin framework — the skill loads a profile when (a) the user names it
("use the kinetixui profile") or (b) repository evidence clearly matches its
**Detection** section.

Adding a profile requires **no edit to the core** (`SKILL.md` or `references/`).

### Required sections

1. **Detection** — concrete repository signals (file names, package names) so the skill can tell the profile applies. Say what to do on a partial match (ask, or run core only).
2. **Positioning** — one paragraph: what the project is and is not, so reviews judge it by its own goals.
3. **Where to discover truth** — paths/commands for platforms, manifests, tokens, docs, tests and gates. Prefer *how to find* over *what is currently there*.
4. **Rules**, each tagged:
   - **ESTABLISHED** — backed by standards, platform guidance, repository architecture, repeated empirical findings, or an explicit project decision. State the basis.
   - **PROVISIONAL** — a working position that has some support but is not settled.
   - **AUDIT QUESTION** — an unresolved question the reviewer should *investigate and report*, not enforce.
5. **Regression scenarios** — concrete past defects as reusable checks (what to look at, expected truth, how to verify). They are scenarios, not universal law.
6. **Gates** — the project's own checks the reviewer should run/consult rather than reinvent.

### Rules for profile authors

- **No volatile facts.** Do not write "N components" or "platform X is complete". Say how to read the current value.
- **No loosened evidence requirements.** Profile rules are inputs to the same FACT/OBSERVATION/INFERENCE discipline.
- **Don't promote preferences.** A rule becomes ESTABLISHED only on the lifecycle in the main `README.md`. When in doubt, tag it PROVISIONAL or AUDIT QUESTION.
- **Cite the basis** (doc path, ADR, test) for each ESTABLISHED rule so reviewers can verify it still holds.
- Keep it short enough to read in one pass; link to project docs for detail.

### Profile template

```markdown
# <Project> profile
## Detection
## Positioning
## Where to discover truth
## Rules
### ESTABLISHED
### PROVISIONAL
### AUDIT QUESTIONS
## Regression scenarios
## Gates
```
