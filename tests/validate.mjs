#!/usr/bin/env node
// Static validation for the design-system-review repository. No dependencies.
// Usage: node tests/validate.mjs     (exit 1 on any failure)
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillDir = join(root, "skills", "design-system-review");
const failures = [];
const ok = [];
const check = (name, cond, detail = "") => (cond ? ok.push(name) : failures.push(`${name}${detail ? " — " + detail : ""}`));
const read = (p) => readFileSync(p, "utf8");
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

// --- manifests & versions
const plugin = JSON.parse(read(join(root, ".claude-plugin/plugin.json")));
const market = JSON.parse(read(join(root, ".claude-plugin/marketplace.json")));
check("plugin.json name matches skill directory", plugin.name === "design-system-review");
check("marketplace lists the plugin", market.plugins?.some((p) => p.name === plugin.name));
check("marketplace version == plugin version", market.plugins?.[0]?.version === plugin.version);
const changelog = read(join(root, "CHANGELOG.md"));
check("CHANGELOG has the plugin version", changelog.includes(`## [${plugin.version}]`));
check("version is semver", /^\d+\.\d+\.\d+$/.test(plugin.version));

// --- SKILL.md frontmatter
const skill = read(join(skillDir, "SKILL.md"));
const fm = skill.match(/^---\n([\s\S]*?)\n---\n/);
check("SKILL.md has frontmatter", !!fm);
const fmText = fm?.[1] ?? "";
const name = fmText.match(/^name:\s*(.+)$/m)?.[1]?.trim();
const desc = fmText.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? "";
check("frontmatter name == directory name", name === "design-system-review", name);
check("description present", desc.length > 40);
check("description <= 1536 chars (documented limit)", desc.length <= 1536, `${desc.length}`);

// --- reference integrity
const refs = readdirSync(join(skillDir, "references")).filter((f) => f.endsWith(".md"));
for (const r of refs) check(`SKILL.md references references/${r}`, skill.includes(`references/${r}`));
for (const m of skill.matchAll(/`((?:references|profiles)\/[\w.-]+\.md)`/g)) check(`link target exists: ${m[1]}`, existsSync(join(skillDir, m[1])));

// --- core must not depend on KinetixUI
const coreFiles = [join(skillDir, "SKILL.md"), ...refs.map((r) => join(skillDir, "references", r))];
for (const f of coreFiles) {
  const t = read(f), rel = f.replace(root + "/", "");
  check(`core is project-neutral (no "KinetixUI" brand): ${rel}`, !/KinetixUI/.test(t));
  if (!f.endsWith("SKILL.md")) check(`references never name a specific project: ${rel}`, !/kinetix/i.test(t));
}
check("core contains no hard-coded platform assumption 'must support React, Angular'", !/must support React, Angular/i.test(skill));

// --- profiles
const profiles = readdirSync(join(skillDir, "profiles")).filter((f) => f.endsWith(".md") && f !== "README.md");
for (const p of profiles) {
  const t = read(join(skillDir, "profiles", p));
  for (const h of ["## Detection", "## Positioning", "## Where to discover truth", "## Rules", "### ESTABLISHED", "### PROVISIONAL", "### AUDIT QUESTIONS", "## Regression scenarios", "## Gates"])
    check(`profile ${p} has "${h}"`, t.includes(h));
  check(`profile ${p} has no volatile counts`, !/\b\d{2,}\s+(components|blocks|platforms|tokens)\b/i.test(t.replace(/\d+ ?(px)/g, "")));
}

// --- fixtures
const exp = JSON.parse(read(join(root, "tests/fixtures/expectations.json")));
for (const c of exp.cases) {
  check(`fixture exists: ${c.id}`, existsSync(join(root, "tests", c.path)) && walk(join(root, "tests", c.path)).length > 0);
  check(`expectation well-formed: ${c.id}`, ["flag", "no-flag", "tradeoff"].includes(c.expect) && Array.isArray(c.mustMatch));
  for (const re of [...(c.mustMatch ?? []), ...(c.mustNotMatch ?? [])]) { try { new RegExp(re, "i"); } catch { failures.push(`bad regex in ${c.id}: ${re}`); } }
}
const fixtureDirs = new Set(exp.cases.map((c) => c.path));
for (const area of readdirSync(join(root, "tests/fixtures")).filter((d) => statSync(join(root, "tests/fixtures", d)).isDirectory()))
  for (const v of readdirSync(join(root, "tests/fixtures", area)))
    check(`fixture has expectation: ${area}/${v}`, fixtureDirs.has(`fixtures/${area}/${v}`));
check("at least two false-positive controls", exp.cases.filter((c) => /FALSE-POSITIVE CONTROL/.test(c.note ?? "")).length >= 2);

// --- docs: links resolve; banned claims absent
const docs = walk(root).filter((f) => f.endsWith(".md") && !f.includes("/node_modules/") && !f.includes("/.git/") && !f.includes("/tests/results/"));
const banned = [/works with every framework/i, /(?<!not )(?<!n.t )guarantees? accessibility/i, /\bAI-powered\b/i];
for (const f of docs) {
  const t = read(f);
  for (const re of banned) check(`no banned claim ${re} in ${f.replace(root + "/", "")}`, !re.test(t));
  for (const m of t.matchAll(/\]\((?!https?:|#|mailto:)([^)\s#]+)(?:#[^)]*)?\)/g)) {
    const target = resolve(dirname(f), m[1]);
    check(`link resolves: ${f.replace(root + "/", "")} -> ${m[1]}`, existsSync(target));
  }
}

// --- Claude Code's own validator, when the CLI is available
const cli = spawnSync("claude", ["plugin", "validate", root, "--strict"], { encoding: "utf8" });
if (cli.error) console.log("note: `claude` CLI not found; skipped `claude plugin validate --strict`");
else check("`claude plugin validate --strict` passes", cli.status === 0, (cli.stdout + cli.stderr).trim().split("\n").slice(-4).join(" | "));

console.log(`${ok.length} checks passed, ${failures.length} failed`);
for (const f of failures) console.log("  FAIL:", f);
process.exit(failures.length ? 1 : 0);
