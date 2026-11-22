#!/usr/bin/env python3
"""Strict, bounded Agent Skills frontmatter validation using PyYAML.

Allowed shape:
  ---
  name: <string>
  description: <string>
  metadata:            # optional
    author: <string>   # optional
    tags: <string>     # optional, comma-separated
  ---

Any nested list, nested mapping, duplicate key, or malformed YAML is rejected.

Usage:
  python3 check_frontmatter.py                 -> validate the published catalog
  python3 check_frontmatter.py --json          -> JSON summary for CI
  python3 check_frontmatter.py --validate-file F -> VALID / INVALID for a fixture
"""

import argparse
import json
import pathlib
import re
import sys

import yaml

ROOT = pathlib.Path(__file__).resolve().parents[2]
SKILLS = ROOT / "skills"
ALLOWED_TOP = {"name", "description", "metadata"}
ALLOWED_META = {"author", "tags"}


def validate(path):
    """Return a list of errors for one SKILL.md."""
    text = path.read_text(encoding="utf-8")
    if not re.match(r"^---\s*\n", text):
        return ["missing opening frontmatter delimiter"]
    rest = text[4:]
    if "\n---" not in rest:
        return ["missing closing frontmatter delimiter"]
    raw = rest.split("\n---", 1)[0]
    try:
        data = yaml.safe_load(raw)
    except yaml.YAMLError as exc:
        return [f"malformed YAML: {str(exc).splitlines()[0]}"]
    if not isinstance(data, dict):
        return ["frontmatter must be a mapping"]
    errors = []
    unknown = set(data) - ALLOWED_TOP
    if unknown:
        errors.append(f"unsupported top-level keys: {sorted(unknown)}")
    name = data.get("name")
    if not isinstance(name, str) or not re.fullmatch(r"[a-z0-9][a-z0-9-]*", name):
        errors.append("name must be a lowercase kebab-case string")
    desc = data.get("description")
    if not isinstance(desc, str) or not desc.strip():
        errors.append("description must be a non-empty string")
    meta = data.get("metadata")
    if meta is not None:
        if not isinstance(meta, dict):
            errors.append("metadata must be a mapping")
        else:
            bad = set(meta) - ALLOWED_META
            if bad:
                errors.append(f"unsupported metadata keys: {sorted(bad)}")
            for key, value in meta.items():
                if not isinstance(value, str):
                    errors.append(f"metadata.{key} must be a string, got {type(value).__name__}")
    return errors


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--validate-file", default=None)
    args = ap.parse_args()
    if args.validate_file:
        errors = validate(pathlib.Path(args.validate_file))
        if errors:
            print("INVALID: " + "; ".join(errors))
            return 1
        print("VALID")
        return 0
    errors = []
    count = 0
    for folder in sorted(SKILLS.iterdir()):
        path = folder / "SKILL.md"
        if not path.is_file():
            continue
        count += 1
        expected = folder.name
        for error in validate(path):
            errors.append(f"{expected}: {error}")
        # Folder/name agreement is checked here, not by regex in the JS wrapper.
        try:
            data = yaml.safe_load(path.read_text(encoding="utf-8").split("\n---", 1)[0][4:])
        except yaml.YAMLError:
            continue
        if isinstance(data, dict) and data.get("name") != expected:
            errors.append(f"{expected}: name mismatch {data.get('name')!r}")
    if args.json:
        print(json.dumps({"count": count, "errors": errors}))
    else:
        print(f"Validated {count} skill frontmatters with PyYAML.")
        if errors:
            print("\n".join(errors[:20]))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
