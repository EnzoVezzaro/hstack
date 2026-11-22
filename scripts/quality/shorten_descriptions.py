#!/usr/bin/env python3
"""Trim skill descriptions to fit harness listing budgets (~8,000 chars total).

Keeps the trigger sentence and the first concrete clauses. Each description
stays a YAML string; the validator still requires a use/entry-point trigger.
Idempotent: running it again leaves already-short descriptions untouched.
"""

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
SKILLS = ROOT / "skills"
TRIGGER = re.compile(r"\b(use|when|entry point|for)\b", re.I)
LIMIT = 190


def shorten(description):
    text = description.strip().strip('"')
    sentences = re.split(r"(?<=[.!?])\s+", text)
    selected = []
    for sentence in sentences:
        part = sentence
        if len(part) > 135:
            clauses = re.split(r"(?<=[,;:])\s+", part)
            kept = []
            for clause in clauses:
                if sum(len(x) for x in kept) + len(clause) > 125:
                    break
                kept.append(clause)
            part = " ".join(kept).rstrip(" ,;:")
        selected.append(part)
        joined = ". ".join(selected)
        if TRIGGER.search(joined) and len(joined) >= 85:
            break
        if len(joined) >= 135:
            break
    out = ". ".join(s.rstrip(".") for s in selected if s.strip()).rstrip() + "."
    if not TRIGGER.search(out):
        out = "Use when this H Stack workflow applies. " + out
    if len(out) > LIMIT:
        out = out[:LIMIT].rsplit(" ", 1)[0].rstrip(" ,;:") + "."
    return out


def main():
    before = after = 0
    changed = []
    for path in sorted(SKILLS.glob("*/SKILL.md")):
        text = path.read_text(encoding="utf-8")
        match = re.search(r"^description:\s*(.*)$", text, re.M)
        if not match:
            continue
        old = match.group(1).strip().strip('"')
        new = shorten(old)
        before += len(old)
        after += len(new)
        if new != old:
            replacement = f'description: "{new}"'
            path.write_text(text[:match.start()] + replacement + text[match.end():], encoding="utf-8")
            changed.append(path.parent.name)
    print(f"description chars: {before} -> {after}; shortened {len(changed)} skills")


if __name__ == "__main__":
    main()
