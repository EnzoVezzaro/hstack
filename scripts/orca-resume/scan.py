#!/usr/bin/env python3
"""Read-only Orca portfolio snapshot for the /resume-all skill.

Only runs documented read commands. It classifies worktrees and candidate
sessions; it never starts, stops, resumes or reassigns an agent.
"""

import argparse
import datetime as dt
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_REPORT = ROOT / "docs" / "orca-resume-scan.md"
DEFAULT_JSON = ROOT / "docs" / "orca-resume-scan.json"


def orca(*args):
    try:
        p = subprocess.run(["orca", *args, "--json"], capture_output=True, text=True, timeout=60)
    except (OSError, subprocess.TimeoutExpired):
        return None
    try:
        data = json.loads(p.stdout)
    except json.JSONDecodeError:
        return None
    if not data.get("ok"):
        return None
    return data.get("result")


def git_state(path):
    out = {"dirty": None, "branch": None, "ahead": None, "error": None}
    try:
        p = subprocess.run(["git", "-C", path, "status", "--porcelain"], capture_output=True, text=True, timeout=20)
        out["dirty"] = len([x for x in p.stdout.splitlines() if x.strip()])
        p = subprocess.run(["git", "-C", path, "rev-parse", "--abbrev-ref", "HEAD"], capture_output=True, text=True, timeout=20)
        out["branch"] = p.stdout.strip() or None
        base = "main" if out["branch"] != "main" else "master"
        p = subprocess.run(["git", "-C", path, "rev-list", "--count", f"{base}..HEAD"], capture_output=True, text=True, timeout=20)
        out["ahead"] = int(p.stdout.strip()) if p.returncode == 0 and p.stdout.strip().isdigit() else 0
    except (OSError, subprocess.TimeoutExpired, ValueError) as exc:
        out["error"] = str(exc)[:120]
    return out


def read_state(session_id, limit=8):
    data = orca("agent", "read", session_id, "--limit", str(limit))
    if not data:
        return None
    entries = data.get("entries") or []
    last = next(
        (e.get("text") for e in reversed(entries) if e.get("role") == "assistant" and e.get("text")),
        None,
    )
    return {"state": data.get("state"), "last_message": last}


def classify(w, git, deep):
    agents = w.get("agents") or []
    working = [a for a in agents if a.get("state") == "working"]
    broken = [
        a for a in agents
        if a.get("interrupted") or (a.get("mainAgent") or {}).get("outcome") == "failure"
    ]
    if working:
        group = "working"
    elif broken:
        group = "interrupted"
    elif (git.get("dirty") or 0) > 0 or (git.get("ahead") or 0) > 0:
        group = "unfinished"
    else:
        group = "complete-or-idle"

    candidates = []
    for a in broken:
        item = {
            "session_id": a.get("orcaSessionId"),
            "agent": a.get("agentType"),
            "title": a.get("conversationName") or a.get("taskTitle"),
            "prompt": (a.get("prompt") or "")[:300],
            "outcome": (a.get("mainAgent") or {}).get("outcome"),
            "interrupted": bool(a.get("interrupted")),
        }
        if deep and item["session_id"]:
            item["read"] = read_state(item["session_id"])
        candidates.append(item)

    return {
        "group": group,
        "working_agents": len(working),
        "candidates": candidates,
        "workspace_status": w.get("workspaceStatus"),
        "status": w.get("status"),
        "is_archived": bool(w.get("isArchived")),
    }


def render(data):
    s = data["summary"]
    lines = [
        "# Orca resume scan",
        "",
        f"Generated {data['timestamp']}. Read-only snapshot; nothing was started, stopped or resumed.",
        "",
        f"Projects: **{s['projects']}**, worktrees: **{s['worktrees']}**. "
        f"Groups: " + ", ".join(f"{k} **{v}**" for k, v in s["groups"].items()) + ".",
        "",
        "`interrupted` means a failure/cancellation outcome or an interrupted flag. `unfinished` "
        "means dirty or unmerged changes with no failed agent: review it, do not auto-resume.",
        "",
        f"Session search index: enabled={data['search_index'].get('enabled')}, "
        f"phase={data['search_index'].get('phase')}. "
        "Resume commands from `orca search` are usable only when enabled is true and phase is current.",
        "",
        "| Project | Worktree | Branch | Group | Working agents | Candidates | Dirty / ahead |",
        "| --- | --- | --- | --- | ---: | ---: | --- |",
    ]
    for w in data["worktrees"]:
        g = w["assessment"]
        git = w["git"]
        lines.append(
            f"| {w['repo']} | {w['workspace']} | `{git.get('branch') or '-'}` | {g['group']} | "
            f"{g['working_agents']} | {len(g['candidates'])} | {git.get('dirty')} / {git.get('ahead')} |"
        )
    lines += ["", "## Candidate sessions", ""]
    any_candidate = False
    for w in data["worktrees"]:
        for c in w["assessment"]["candidates"]:
            any_candidate = True
            read = c.get("read") or {}
            lines += [
                f"- **{w['repo']} / {w['workspace']}** — `{c['session_id']}` ({c['agent']}), "
                f"{c['title'] or 'untitled'}, outcome={c['outcome']}, interrupted={c['interrupted']}.",
                f"  - Prompt: {c['prompt']}",
                f"  - Last read state: {read.get('state', 'not read')}"
                + (f"; {read.get('last_message')}" if read.get("last_message") else ""),
            ]
    if not any_candidate:
        lines.append("None. No session has a failure outcome or an interrupted flag.")
    lines += [
        "",
        "## Next",
        "",
        "Review each candidate with `orca agent read`, find a resumable session with "
        "`orca search \"<distinctive phrase>\" --path <worktree> --json`, and present the batch "
        "with its model mapping for owner approval. Never resume a `working` agent or this session.",
    ]
    return "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--report", default=str(DEFAULT_REPORT))
    ap.add_argument("--json", default=str(DEFAULT_JSON))
    ap.add_argument("--deep", action="store_true", help="read the last turn of each candidate session")
    args = ap.parse_args()

    projects = orca("project", "list") or {}
    ps = orca("worktree", "ps") or {}
    index = orca("search", "--index-status") or {}
    worktrees = []
    for w in ps.get("worktrees", []):
        path = w.get("path")
        if not path:
            continue
        git = git_state(path)
        worktrees.append({
            "repo": w.get("repo"),
            "workspace": w.get("displayName"),
            "path": path,
            "worktree_id": w.get("worktreeId"),
            "git": git,
            "assessment": classify(w, git, args.deep),
        })
    groups = {}
    for w in worktrees:
        g = w["assessment"]["group"]
        groups[g] = groups.get(g, 0) + 1
    data = {
        "timestamp": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),
        "summary": {
            "projects": len(projects.get("projects", [])),
            "worktrees": len(worktrees),
            "groups": groups,
        },
        "search_index": {
            "enabled": index.get("enabled"),
            "phase": index.get("phase"),
        },
        "worktrees": worktrees,
    }
    report = pathlib.Path(args.report)
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(render(data), encoding="utf-8")
    json_path = pathlib.Path(args.json)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"wrote {report} and {json_path}; {len(worktrees)} worktrees, {groups}")


if __name__ == "__main__":
    main()
