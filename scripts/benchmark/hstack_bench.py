#!/usr/bin/env python3
"""Keyless H Stack benchmark: fresh environments, skill checks, router contract.

This measures packaging, harness loading, and routing. It does NOT measure
model task success, cost, latency, or multi-agent lift; those need live runs
with credentials and are reported as NOT RUN. See docs/benchmark.md.
"""

import argparse
import datetime as dt
import json
import os
import pathlib
import re
import shutil
import statistics
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_OUT = ROOT / "docs" / "benchmark-results.md"
DEFAULT_ARTIFACTS = ROOT / "benchmarks" / "results" / "latest.json"
CONFIGS = ("A-baseline", "B-skills", "C-skills-mcp", "D-full-stack")


def run(cmd, timeout=120):
    p = subprocess.run([str(x) for x in cmd], capture_output=True, text=True, timeout=timeout)
    return p


def version(evaluator):
    try:
        p = run([evaluator, "--version"])
    except (OSError, subprocess.TimeoutExpired):
        return "not installed"
    return (p.stdout or p.stderr).strip().splitlines()[-1] if p.stdout or p.stderr else "unknown"


def frontmatter(path):
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\s*\n(.*?)\n---", text, re.S)
    if not match:
        return {}
    out = {}
    for line in match.group(1).splitlines():
        m = re.match(r"^([A-Za-z_][\w-]*):\s*(.*)$", line)
        if m:
            out[m.group(1)] = m.group(2).strip().strip('"').strip("'")
    return out


def discover(skills_dir):
    return sorted(p for p in pathlib.Path(skills_dir).iterdir() if (p / "SKILL.md").is_file())


def fresh_env(root, label, skills_dir, install):
    """A new-user environment: empty home/workspace, no AGENTS.md, no prior state."""
    base = pathlib.Path(root) / label
    home = base / "home"
    workspace = base / "workspace"
    base.mkdir(parents=True, exist_ok=True)
    home.mkdir(exist_ok=True)
    workspace.mkdir(exist_ok=True)
    installed = 0
    if install:
        dest = home / ".agents" / "skills"
        shutil.copytree(skills_dir, dest, dirs_exist_ok=True)
        installed = len(discover(dest))
    manifest = {
        "path": str(base),
        "home": str(home),
        "workspace": str(workspace),
        "skills_installed": installed,
        "no_agents_md": not (workspace / "AGENTS.md").exists() and not (home / "AGENTS.md").exists(),
        "isolated_from_repo": base.resolve() != ROOT.resolve() and ROOT.resolve() not in base.resolve().parents,
    }
    return manifest


def make_envs(root, skills_dir):
    manifests = {}
    for label in CONFIGS:
        install = label != "A-baseline"
        manifests[label] = fresh_env(root, label, skills_dir, install)
    return manifests


def quality(evaluator, skills_dir, limit):
    rows = []
    for skill in discover(skills_dir)[:limit] if limit else discover(skills_dir):
        with tempfile.TemporaryDirectory() as tmp:
            p = run([evaluator, "quality-check", skill, "-r", "json", "-o", tmp])
            report = pathlib.Path(tmp) / "skillevaluator-quality.json"
            if not report.exists():
                rows.append({"skill": skill.name, "error": (p.stderr or p.stdout).strip()[:200]})
                continue
            data = json.loads(report.read_text(encoding="utf-8"))
            result = next((r for r in data.get("results", []) if r.get("validator") == "QUALITY"), {})
            q = result.get("quality") or {}
            summary = result.get("summary") or {}
            rows.append({
                "skill": skill.name,
                "score": q.get("overall_score"),
                "grade": q.get("grade"),
                "warnings": summary.get("warnings"),
                "errors": summary.get("errors"),
                "passed": result.get("passed"),
            })
    scores = [r["score"] for r in rows if isinstance(r.get("score"), (int, float))]
    aggregate = {
        "skills": len(rows),
        "scored": len(scores),
        "mean": round(statistics.mean(scores), 1) if scores else None,
        "median": round(statistics.median(scores), 1) if scores else None,
        "min": min(scores) if scores else None,
        "max": max(scores) if scores else None,
        "grades": {g: sum(1 for r in rows if r.get("grade") == g) for g in sorted({r.get("grade") for r in rows if r.get("grade")})},
    }
    return {"aggregate": aggregate, "skills": rows}


def harness(evaluator, skills_dir):
    with tempfile.TemporaryDirectory() as tmp:
        out = pathlib.Path(tmp) / "harness.json"
        run([evaluator, "harness-check", skills_dir, "--json", out])
        if not out.exists():
            return {"error": "harness-check produced no JSON"}
        data = json.loads(out.read_text(encoding="utf-8"))
    # The JSON is keyed by each checked path. Per-skill paths report a
    # one-skill catalog; keep the entry that reflects the whole catalog.
    seen = {}
    for rows in data.get("harness_compatibility", {}).values():
        for row in rows:
            name = row.get("harness")
            size = (row.get("catalog") or {}).get("size", 0)
            if name not in seen or size > (seen[name].get("catalog") or {}).get("size", 0):
                seen[name] = {
                    "harness": name,
                    "status": row.get("status"),
                    "catalog": row.get("catalog"),
                    "findings": [
                        {"effect": f.get("effect"), "message": f.get("message")}
                        for f in row.get("findings", [])
                    ],
                }
    entries = list(seen.values())
    catalogs = [e["catalog"] for e in entries if e.get("catalog")]
    return {
        "entries": entries,
        "catalog_size": catalogs[0].get("size") if catalogs else None,
        "description_chars": catalogs[0].get("desc_chars") if catalogs else None,
        "loads": sum(1 for e in entries if e.get("status") == "loads"),
        "degraded": sum(1 for e in entries if e.get("status") == "degraded"),
        "not_loaded": sum(1 for e in entries if e.get("status") in ("not loaded", "not_loaded")),
    }


def router_table(router_path):
    text = router_path.read_text(encoding="utf-8")
    table = {}
    for line in text.splitlines():
        if not line.startswith("|") or "SKILL.md" not in line:
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 2:
            continue
        reach = cells[0]
        for name, path in re.findall(r"\[([^\]]+)\]\(\.\.\/([^/]+)\/SKILL\.md\)", cells[-1]):
            table[path] = reach
    return table


def route_probe(manifests, cases_path):
    skill_dir = pathlib.Path(manifests["B-skills"]["home"]) / ".agents" / "skills"
    cases = json.loads(pathlib.Path(cases_path).read_text(encoding="utf-8"))
    out = {}
    for label in CONFIGS:
        if label == "A-baseline":
            out[label] = {"passed": 0, "total": len(cases), "reason": "no skills installed"}
            continue
        router = skill_dir / "hstack" / "SKILL.md"
        table = router_table(router)
        passed, misses = 0, []
        for case in cases:
            reach = table.get(case["expected"], "")
            ok = bool(reach) and any(k.lower() in reach.lower() for k in case["keywords"])
            passed += 1 if ok else 0
            if not ok:
                misses.append({"case": case["id"], "expected": case["expected"]})
        out[label] = {
            "passed": passed,
            "total": len(cases),
            "router_rows": len(table),
            "misses": misses,
            "note": "deterministic router contract check, not a model task benchmark",
        }
    return out


def render(results):
    now = results["timestamp"]
    q = results.get("quality", {}).get("aggregate") or {}
    h = results.get("harness") or {}
    r = results.get("route") or {}
    lines = [
        "# H Stack benchmark results",
        "",
        f"Generated {now}. Runner: `scripts/benchmark/hstack_bench.py`. "
        "Tool versions: " + ", ".join(f"`{k} {v}`" for k, v in results["versions"].items()) + ".",
        "",
        "## What was measured",
        "",
        "Four fresh environments were created in a temporary root. Each has an empty home and "
        "workspace, no `AGENTS.md`, and no prior session state. A starts with no skills; B, C and D "
        "receive a fresh copy of every skill. C and D reserve the tool/orchestration layers for a "
        "live run; they are identical to B in this keyless pass.",
        "",
        "| Configuration | Skills | MCP | Multi-agent | Environment |",
        "| --- | --- | --- | --- | --- |",
    ]
    for label in CONFIGS:
        m = results["envs"].get(label, {})
        lines.append(f"| {label} | {'On' if m.get('skills_installed') else 'Off'} | On (reserved) | On (reserved) | `{m.get('path')}` |")
    lines += [
        "",
        "Isolation checks: no `AGENTS.md` in any fresh environment = "
        f"{all(m.get('no_agents_md') for m in results['envs'].values())}; "
        f"all outside the repo = {all(m.get('isolated_from_repo') for m in results['envs'].values())}.",
        "",
        "## Skill quality (NVIDIA SkillEvaluator, keyless tier 1 quality)",
        "",
        f"- Skills scored: **{q.get('scored', 0)}/{q.get('skills', 0)}**; mean **{q.get('mean')}**, median **{q.get('median')}**, "
        f"range **{q.get('min')}–{q.get('max')}** out of 100.",
        f"- Grades: {', '.join(f'{g}: {n}' for g, n in (q.get('grades') or {}).items()) or 'none'}.",
        "",
        "| Skill | Score | Grade | Warnings | Errors |",
        "| --- | ---: | --- | ---: | ---: |",
    ]
    for row in results.get("quality", {}).get("skills", []):
        lines.append(f"| `{row['skill']}` | {row.get('score', 'n/a')} | {row.get('grade', 'n/a')} | {row.get('warnings', 'n/a')} | {row.get('errors', 'n/a')} |")
    lines += [
        "",
        f"## Harness compatibility ({h.get('catalog_size', 'n/a')}-skill catalog)",
        "",
    ]
    if h.get("error"):
        lines.append(f"Harness check unavailable: {h['error']}")
    else:
        lines += [
            f"- Catalog: **{h['catalog_size']} skills**, **{h['description_chars']} description characters**.",
            f"- Loads: **{h['loads']}**, degraded: **{h['degraded']}**, not loaded: **{h['not_loaded']}**.",
            "",
            "| Harness | Status |",
            "| --- | --- |",
        ]
        for e in h["entries"]:
            lines.append(f"| {e['harness']} | {e['status']} |")
        for e in h["entries"]:
            for finding in e.get("findings", []):
                if finding.get("message"):
                    if not lines[-1].startswith("- `"):
                        lines.append("")
                    lines.append(f"- `{e['harness']}`: {finding['message']}")
    lines += [
        "",
        "## Router contract probe (deterministic, not model-based)",
        "",
        "Sample prompts are checked against the `/hstack` route table in the fresh environment. "
        "A case passes when its expected skill is listed and a trigger phrase from the prompt "
        "appears in that row. This tests routing coverage, not whether a model picks the skill.",
        "",
        "| Configuration | Passed | Rows |",
        "| --- | ---: | ---: |",
    ]
    for label in CONFIGS:
        x = r.get(label, {})
        lines.append(f"| {label} | {x.get('passed', 'n/a')}/{x.get('total', 'n/a')} | {x.get('router_rows', 0)} |")
    misses = (r.get("B-skills") or {}).get("misses", [])
    if misses:
        lines += ["", "Misses: " + ", ".join(f"`{m['case']}` → `{m['expected']}`" for m in misses) + "."]
    lines += [
        "",
        "## Not run",
        "",
        "Task success, Pass@k, cost, tokens, latency, tool reliability, skill lift and "
        "single- vs multi-agent comparisons require live model runs. They are **NOT RUN**: no "
        "model API credentials were provided and no subscription quota was spent. Framework "
        "README tables are illustrative and were not copied as results.",
        "",
        "## Reproduce",
        "",
        "```bash",
        "python3 scripts/benchmark/hstack_bench.py all --evaluator /path/to/skillevaluator",
        "```",
        "",
        "See [benchmark.md](benchmark.md) for the full matrix and the live-run procedure.",
    ]
    return "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("command", choices=["env", "quality", "harness", "route", "all"])
    ap.add_argument("--skills-dir", default=str(ROOT / "skills"))
    ap.add_argument("--cases", default=str(ROOT / "skills" / "benchmark" / "cases.json"))
    ap.add_argument("--evaluator", default=os.environ.get("SKILLEVALUATOR", "skillevaluator"))
    ap.add_argument("--out", default=str(DEFAULT_OUT))
    ap.add_argument("--artifacts", default=str(DEFAULT_ARTIFACTS))
    ap.add_argument("--env-root", default=None)
    ap.add_argument("--keep-envs", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    own_root = args.env_root is None
    root = args.env_root or tempfile.mkdtemp(prefix="hstack-bench-")
    skills_dir = pathlib.Path(args.skills_dir)
    results = {
        "timestamp": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),
        "versions": {"python": sys.version.split()[0], "skillevaluator": version(args.evaluator)},
        "envs": {},
        "quality": {"aggregate": {}, "skills": []},
        "harness": {},
        "route": {},
    }

    if args.command in ("env", "all"):
        results["envs"] = make_envs(root, skills_dir)
    else:
        results["envs"] = {label: {"path": str(pathlib.Path(root) / label)} for label in CONFIGS}

    if args.command in ("quality", "all"):
        results["quality"] = quality(args.evaluator, skills_dir, args.limit)
    if args.command in ("harness", "all"):
        results["harness"] = harness(args.evaluator, skills_dir)
    if args.command in ("route", "all"):
        envs = results["envs"] if results["envs"].get("B-skills", {}).get("home") else make_envs(root, skills_dir)
        results["route"] = route_probe(envs, args.cases)

    artifacts = pathlib.Path(args.artifacts)
    artifacts.parent.mkdir(parents=True, exist_ok=True)
    artifacts.write_text(json.dumps(results, indent=2), encoding="utf-8")
    out = pathlib.Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render(results), encoding="utf-8")
    print(f"wrote {out} and {artifacts}")
    if own_root and not args.keep_envs:
        shutil.rmtree(root, ignore_errors=True)
    elif not own_root:
        print(f"environments left at {root}")


if __name__ == "__main__":
    main()
