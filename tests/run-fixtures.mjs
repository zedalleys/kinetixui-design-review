#!/usr/bin/env node
// Runs the skill headlessly against each methodology fixture and applies the heuristic checks in
// fixtures/expectations.json. Requires the `claude` CLI and costs API usage (one short run per case).
// Results are saved to tests/results/ (git-ignored). The manual rubric (RUBRIC.md) is the authority;
// this script catches gross regressions and produces outputs for human review.
//
// Usage: node tests/run-fixtures.mjs [--only <id>[,<id>]] [--model <model>] [--budget <usd>]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const only = opt("--only")?.split(",");
const model = opt("--model");
const budget = opt("--budget", "1.5");
const { cases } = JSON.parse(readFileSync(join(root, "tests/fixtures/expectations.json"), "utf8"));
const outDir = join(root, "tests/results", new Date().toISOString().replace(/[:.]/g, "-"));
mkdirSync(outDir, { recursive: true });
const order = ["P0", "P1", "P2", "P3"];
let failed = 0;

for (const c of cases.filter((c) => !only || only.includes(c.id))) {
  const dir = join(root, "tests", c.path);
  const prompt = `Use kinetixui-design-review in ${c.mode} mode to review the fixture at ${dir}. It is a tiny, self-contained methodology fixture, not a full project: do not search elsewhere, do not modify files, and keep the report short. If a rule or decision is documented in the files, take it into account.`;
  const a = ["--plugin-dir", root, "-p", prompt, "--allowedTools", "Read", "Grep", "Glob", "--disallowedTools", "Edit", "Write", "Bash", "--max-budget-usd", budget];
  if (model) a.push("--model", model);
  const r = spawnSync("claude", a, { encoding: "utf8", timeout: 600000, cwd: root });
  const out = r.stdout || "";
  writeFileSync(join(outDir, `${c.id}.md`), out + (r.stderr ? `\n\n[stderr]\n${r.stderr}` : ""));
  const problems = [];
  if (!out.trim()) problems.push("empty output");
  for (const re of c.mustMatch ?? []) if (!new RegExp(re, "i").test(out)) problems.push(`missing /${re}/`);
  for (const re of c.mustNotMatch ?? []) if (new RegExp(re, "i").test(out)) problems.push(`forbidden /${re}/`);
  // Severity markers: bullet/heading lines starting with P0-P3, or classed lines like "[DEFECT · P1 · FACT ...]" / "DEFECT · P1".
  // Conditional findings ("P1 if confirmed") count as P2, as the skill's severity model specifies.
  const marks = [];
  for (const line of out.split("\n")) {
    const m = line.match(/^\s*(?:[-*#>|]+\s*)*\**\[?(?:(?:DEFECT|INCONSISTENCY|RISK)[^P\n]{0,12})?\b(P[0-3])\b/);
    if (!m) continue;
    marks.push(/if confirmed/i.test(line) ? "P2" : m[1]);
  }
  const worst = marks.length ? order[Math.min(...marks.map((m) => order.indexOf(m)))] : null;
  if (c.expect === "no-flag" && worst && order.indexOf(worst) <= 2) problems.push(`flagged ${worst} on a no-flag fixture`);
  if (c.expect === "notes" && worst && order.indexOf(worst) <= 1) problems.push(`flagged ${worst} where only notes (P2/P3) are expected`);
  if (c.maxSeverity && worst && order.indexOf(worst) < order.indexOf(c.maxSeverity)) problems.push(`severity ${worst} exceeds max ${c.maxSeverity}`);
  if (c.minSeverity && (!worst || order.indexOf(worst) > order.indexOf(c.minSeverity))) problems.push(`no finding at ${c.minSeverity} or worse (worst: ${worst ?? "none"})`);
  if (c.expect === "flag" && !marks.length) problems.push("no severity-labelled findings");
  console.log(`${problems.length ? "FAIL" : "ok  "} ${c.id.padEnd(30)} worst=${worst ?? "-"} ${problems.join("; ")}`);
  if (problems.length) failed++;
}
console.log(`\nOutputs: ${outDir}\n${failed} heuristic failure(s). Review outputs against tests/RUBRIC.md; regexes are a coarse proxy.`);
process.exit(failed ? 1 : 0);
