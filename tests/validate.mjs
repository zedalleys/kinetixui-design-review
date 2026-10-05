#!/usr/bin/env node
// Static validation for the kinetixui-design-review repository. No dependencies.
// Usage: node tests/validate.mjs     (exit 1 on any failure)
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillDir = join(root, "skills", "kinetixui-design-review");
const failures = [];
const ok = [];
const check = (name, cond, detail = "") => (cond ? ok.push(name) : failures.push(`${name}${detail ? " — " + detail : ""}`));
const read = (p) => readFileSync(p, "utf8");
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

// --- manifests & versions
const plugin = JSON.parse(read(join(root, ".claude-plugin/plugin.json")));
const market = JSON.parse(read(join(root, ".claude-plugin/marketplace.json")));
check("plugin.json name matches skill directory", plugin.name === "kinetixui-design-review");
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
check("frontmatter name == directory name", name === "kinetixui-design-review", name);
check("description present", desc.length > 40);
check("description <= 1536 chars (documented limit)", desc.length <= 1536, `${desc.length}`);

// --- reference integrity
const refs = readdirSync(join(skillDir, "references")).filter((f) => f.endsWith(".md"));
for (const r of refs) check(`SKILL.md references references/${r}`, skill.includes(`references/${r}`));
for (const m of skill.matchAll(/`((?:references|profiles)\/[\w.-]+\.md)`/g)) check(`link target exists: ${m[1]}`, existsSync(join(skillDir, m[1])));

// --- core must not depend on the KinetixUI design system (brand/publisher mentions are allowed only in identity lines)
const walkMd = (d) => walk(d).filter((f) => f.endsWith(".md"));
const adapterDir = join(skillDir, "references", "adapters");
const adapterFiles = walkMd(adapterDir);
const coreFiles = [join(skillDir, "SKILL.md"), ...refs.map((r) => join(skillDir, "references", r)), ...adapterFiles];
const identityLine = /(published by|publisher|independent of|reference profile|reference example|Design Review|kinetixui-design-review|profiles\/reference|projects that do not use|description:)/i;
for (const f of coreFiles) {
  const rel = f.replace(root + "/", "");
  const bad = read(f).split("\n").filter((l) => /kinetix/i.test(l) && !identityLine.test(l));
  check(`core has no KinetixUI-design-system dependency: ${rel}`, bad.length === 0, bad[0]?.slice(0, 100));
  if (!f.endsWith("SKILL.md")) check(`references/adapters never name the KinetixUI design system: ${rel}`, !/kinetixui(?!-design-review)/i.test(read(f).replace(/KinetixUI Design Review/g, "")));
}
check("core states the reference profile is never loaded for other projects", /never loaded for other projects/.test(skill));
check("core has no hard-coded platform assumption 'must support React, Angular'", !/must support React, Angular/i.test(skill));

// --- profiles (any depth under profiles/, except README)
const profileFiles = walkMd(join(skillDir, "profiles")).filter((f) => !f.endsWith("/README.md"));
check("at least one reference profile exists", profileFiles.length >= 1);
for (const f of profileFiles) {
  const p = f.replace(skillDir + "/", "");
  const t = read(f);
  for (const h of ["## Detection", "## Positioning", "## Where to discover truth", "## Rules", "### ESTABLISHED", "### PROVISIONAL", "### AUDIT QUESTIONS", "## Regression scenarios", "## Gates"])
    check(`profile ${p} has "${h}"`, t.includes(h));
  check(`profile ${p} has no volatile counts`, !/\b\d{2,}\s+(components|blocks|platforms|tokens)\b/i.test(t.replace(/\d+ ?(px)/g, "")));
  if (p.includes("profiles/reference/")) check(`reference profile ${p} is labelled as a reference/example profile`, /REFERENCE PROFILE \(example\)/.test(t) && /not part of the core/i.test(t));
}

// --- adapters
const ADAPTERS = ["web", "react", "angular", "vue", "svelte", "web-components", "swiftui", "jetpack-compose", "flutter"];
const SECTIONS = ["**Detect.**", "**Where to look.**", "**Static inspection (V1).**", "**Runtime / gated (V2–V3).**", "**Idiomatic checks.**", "**False positives.**", "**Verification ceiling.**"];
check("adapters/README.md exists", existsSync(join(adapterDir, "README.md")));
for (const a of ADAPTERS) {
  const f = join(adapterDir, `${a}.md`);
  check(`adapter exists: ${a}`, existsSync(f));
  if (!existsSync(f)) continue;
  const t = read(f);
  for (const h of SECTIONS) check(`adapter ${a} has ${h}`, t.includes(h));
  check(`SKILL.md names adapter ${a}`, skill.includes(`\`${a}\``));
}
check("every adapter file is expected", adapterFiles.filter((f) => !f.endsWith("README.md")).every((f) => ADAPTERS.includes(f.split("/").pop().replace(".md", ""))));

// --- v0.1 extension concepts present
const fc = read(join(skillDir, "references/finding-classes.md"));
for (const k of ["DEFECT", "INCONSISTENCY", "RISK", "OPPORTUNITY"]) { check(`finding-classes defines ${k}`, fc.includes(`**${k}**`)); check(`SKILL.md mentions ${k}`, skill.includes(k)); }
const ver = read(join(skillDir, "references/verification.md"));
for (const k of ["V0", "V1", "V2", "V3", "V4", "FULL", "DEGRADED", "SOURCE-ONLY", "BLOCKED", "Confidence"]) check(`verification.md defines ${k}`, ver.includes(k));
check("severity.md ties severity to finding class", /OPPORTUNITY/.test(read(join(skillDir, "references/severity.md"))));
for (const k of ["System Model", "Capability discovery", "capability table"]) check(`SKILL.md covers "${k}"`, new RegExp(k, "i").test(skill));
check("system-model.md and capability-discovery.md exist", existsSync(join(skillDir, "references/system-model.md")) && existsSync(join(skillDir, "references/capability-discovery.md")));

// --- identity, install and maturity consistency
const readme = read(join(root, "README.md"));
check("README documents the new install identifier", readme.includes("kinetixui-design-review@kinetixui-design-review"));
check("README documents the namespaced skill invocation", readme.includes("/kinetixui-design-review:kinetixui-design-review"));
check("plugin displayName is KinetixUI Design Review", plugin.displayName === "KinetixUI Design Review");
check("plugin and marketplace publisher is KinetixUI", plugin.author?.name === "KinetixUI" && market.owner?.name === "KinetixUI");
const maturity = existsSync(join(root, "docs/MATURITY.md")) ? read(join(root, "docs/MATURITY.md")) : "";
check("docs/MATURITY.md exists and states INTERNAL DOGFOOD", /Current maturity:\s*\*\*INTERNAL DOGFOOD\*\*/.test(maturity));
check("README states INTERNAL DOGFOOD", /INTERNAL DOGFOOD/.test(readme));
check("no document claims a higher maturity as current", ![readme, maturity, read(join(root, "CHANGELOG.md"))].some((t) => /Current maturity:\s*\*\*(PUBLIC BETA|BETA|STABLE)/i.test(t)));
check("plugin/marketplace metadata does not claim beta/stable", !/beta|stable/i.test(JSON.stringify([plugin, market])));
const OLD = /design-system-review|Design System Review/;
for (const f of walk(root).filter((f) => /\.(md|json|mjs)$/.test(f) && !f.includes("/.git/") && !f.includes("/tests/results/"))) {
  const rel = f.replace(root + "/", "");
  if (["CHANGELOG.md", "README.md", "docs/DOGFOODING.md", "docs/MATURITY.md", "tests/validate.mjs"].includes(rel)) continue;
  check(`no stale former name in ${rel}`, !OLD.test(read(f)));
}

// --- fixtures
const exp = JSON.parse(read(join(root, "tests/fixtures/expectations.json")));
for (const c of exp.cases) {
  check(`fixture exists: ${c.id}`, existsSync(join(root, "tests", c.path)) && walk(join(root, "tests", c.path)).length > 0);
  check(`expectation well-formed: ${c.id}`, ["flag", "no-flag", "tradeoff", "notes"].includes(c.expect) && Array.isArray(c.mustMatch));
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
