#!/usr/bin/env python3
"""Read-only subscription headroom snapshot for the /token-balancer skill.

Reads `orca account list --json` (result.rateLimits) and prints how much of
each provider's allowance is left. It keeps only usage fields: no emails,
account ids, credential sources or home paths leave this script. It never
selects an account, launches an agent or changes a setting.

Usage:
  snapshot.py              # live Orca data, table
  snapshot.py --json       # live Orca data, JSON
  snapshot.py --input f    # a saved `orca account list --json` payload
"""

import argparse
import datetime as dt
import json
import subprocess
import sys

READY = 40  # headroom % at or above: fine for any bounded task
TIGHT = 15  # headroom % at or above: small T0/T1 tasks only; below: hold
SKIP_KEYS = {"usageMetadata"}


def load(path=None):
    if path:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
    else:
        try:
            p = subprocess.run(["orca", "account", "list", "--json"],
                               capture_output=True, text=True, timeout=60)
        except (OSError, subprocess.TimeoutExpired) as exc:
            sys.exit(f"orca account list failed: {exc}")
        try:
            data = json.loads(p.stdout)
        except json.JSONDecodeError:
            sys.exit("orca account list did not return JSON; check `orca --help`.")
    if not data.get("ok", True):
        sys.exit("orca account list returned ok=false.")
    limits = data.get("result", data).get("rateLimits")
    if not isinstance(limits, dict):
        sys.exit("This Orca version reports no rateLimits; quota is unknown.")
    return limits


def windows(entry):
    """Every usage window the provider reported, as (name, used%, reset)."""
    out = []
    for key in ("session", "weekly", "fableWeekly", "monthly"):
        w = entry.get(key)
        if isinstance(w, dict) and isinstance(w.get("usedPercent"), (int, float)):
            out.append((key, w["usedPercent"], reset_of(w)))
    for b in entry.get("buckets") or []:
        if isinstance(b, dict) and isinstance(b.get("usedPercent"), (int, float)):
            out.append((b.get("name", "bucket"), b["usedPercent"], reset_of(b)))
    return out


def reset_of(w):
    if w.get("resetsAt"):
        return dt.datetime.fromtimestamp(w["resetsAt"] / 1000).isoformat(timespec="minutes")
    return w.get("resetDescription")


def band(headroom, wins):
    if headroom is None:
        return "unknown"
    if any(used >= 100 for _, used, _ in wins) or headroom < TIGHT:
        return "hold"
    return "ready" if headroom >= READY else "tight"


def summarize(limits):
    rows = []
    for name, entry in limits.items():
        if not isinstance(entry, dict) or "status" not in entry:
            continue
        wins = windows(entry) if entry.get("status") == "ok" else []
        headroom = 100 - max(u for _, u, _ in wins) if wins else None
        binding = max(wins, key=lambda w: w[1]) if wins else None
        rows.append({
            "provider": entry.get("provider", name),
            "status": entry.get("status"),
            "plan": entry.get("planType"),
            "windows": {w: u for w, u, _ in wins},
            "headroom": headroom,
            "binding_window": binding[0] if binding else None,
            "resets": binding[2] if binding else None,
            "band": band(headroom, wins),
            "note": entry.get("error") if entry.get("status") != "ok" else None,
            "observed": reset_of({"resetsAt": entry["updatedAt"]}) if entry.get("updatedAt") else None,
        })
    order = {"ready": 0, "tight": 1, "hold": 2, "unknown": 3}
    return sorted(rows, key=lambda r: (order[r["band"]], -(r["headroom"] or 0)))


def table(rows):
    lines = [f"{'provider':<13}{'band':<9}{'left':>5}  {'binding window':<22}{'resets':<18}note"]
    for r in rows:
        left = f"{r['headroom']}%" if r["headroom"] is not None else "?"
        lines.append(f"{r['provider']:<13}{r['band']:<9}{left:>5}  {(r['binding_window'] or '-'):<22}"
                     f"{(r['resets'] or '-'):<18}{r['note'] or ''}")
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--input", help="saved `orca account list --json` payload")
    ap.add_argument("--json", action="store_true", help="print JSON instead of a table")
    args = ap.parse_args()
    rows = summarize(load(args.input))
    print(json.dumps(rows, indent=2) if args.json else table(rows))


if __name__ == "__main__":
    main()
