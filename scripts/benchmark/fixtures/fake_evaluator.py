#!/usr/bin/env python3
"""Fixture evaluator for benchmark regression tests. No external tools."""

import json
import os
import pathlib
import sys

mode = os.environ.get("FAKE_EVAL_MODE", "quality-failed")
args = sys.argv[1:]
if "quality-check" in args:
    out = pathlib.Path(args[args.index("-o") + 1])
    out.mkdir(parents=True, exist_ok=True)
    if mode == "quality-failed":
        payload = {
            "results": [{
                "validator": "QUALITY",
                "passed": False,
                "quality": {"overall_score": 99, "grade": "A"},
                "summary": {"warnings": 0, "errors": 1},
            }],
        }
    elif mode == "quality-empty-schema":
        payload = {"results": [{"validator": "QUALITY", "passed": True, "quality": {}}]}
    else:
        payload = {"results": []}
    (out / "skillevaluator-quality.json").write_text(json.dumps(payload))
    sys.exit(0)
if "harness-check" in args:
    out = pathlib.Path(args[args.index("--json") + 1])
    if mode == "harness-empty":
        out.write_text(json.dumps({}))
    elif mode == "harness-malformed":
        out.write_text("{not json")
    else:
        out.write_text(json.dumps({"harness_compatibility": {"x": [{
            "harness": "claude-code", "status": "loads", "catalog": {"size": 1, "desc_chars": 10}, "findings": [],
        }]}}))
    sys.exit(0)
print("unknown fixture invocation", file=sys.stderr)
sys.exit(2)
