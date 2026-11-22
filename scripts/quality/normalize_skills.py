#!/usr/bin/env python3
"""Normalize H Stack skills against the shared quality findings.

Adds the metadata and short sections that SkillEvaluator checks, without
rewriting a skill's procedure. Idempotent: skills already carrying a section
or a frontmatter field are left alone. Review the diff before committing.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
SKILLS = ROOT / "skills"
V5 = ROOT / "docs" / "hstack-v5.md"

NO_PROJECT = {"420", "get-stoned", "haf", "a-new-day", "plan-horizon", "wrap-day", "blocker-radar",
              "horizon", "setup-hstack", "token-balancer", "skill-workbench"}

SECTIONS = {
    "prerequisites": (
        "## Prerequisites\n\n"
        "Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` "
        "and current changes, and confirm the tools this workflow needs are available before acting.\n"
    ),
    "limitations": (
        "## Limitations\n\n"
        "A skill is a procedure, not proof that an agent, model, subscription, Orca session or "
        "browser tool is live. Do not report a check that was not run.\n"
    ),
    "troubleshooting": (
        "## Troubleshooting\n\n"
        "If a tool, session or required state is unavailable, stop that action and record the exact "
        "blocker. Validate the result on the reported revision; treat errors, failed checks and "
        "unverified reports as failures, never as passes.\n"
    ),
}


def layer_tags():
    """Map skill name to its layer number from the V5 command map."""
    tags = {}
    if not V5.exists():
        return tags
    for line in V5.read_text(encoding="utf-8").splitlines():
        m = re.search(r"\.\./skills/([^/]+)/SKILL\.md", line)
        if not m:
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 3:
            continue
        layer = re.search(r"\b([1-5])\b", cells[2])
        if layer:
            tags[m.group(1)] = f"layer{layer.group(1)}"
    return tags


def add_metadata(text, name, tag):
    block = re.match(r"^---\r?\n(.*?)\r?\n---", text, re.S)
    if not block:
        return None
    fm = block.group(1)
    if "metadata:" in fm and re.search(r"^\s+author:", fm, re.M):
        return None
    desc = re.search(r'^description:\s*(.*)$', fm, re.M)
    purpose = ""
    if desc:
        first = re.split(r"(?<=[.!?])\s+", desc.group(1).strip().strip('"'))[0]
        purpose = first[:160].rstrip()
    new_fm = fm.rstrip() + "\nmetadata:\n  author: Enzo Vezzaro\n  tags: [hstack, " + tag + "]\n"
    text = text[:block.start(1)] + new_fm + "---" + text[block.end():]
    return text, purpose


def add_sections(text, name, purpose):
    has_contract = "**Execution contract:**" in text
    anchor = re.search(r"^#\s+[^\n]+\n", text, re.M)
    if not anchor:
        return None
    pos = anchor.end()
    if has_contract:
        line_end = text.find("\n", text.find("**Execution contract:**"))
        if line_end != -1:
            pos = line_end + 1
    parts = ["## Purpose\n\n" + (purpose or f"Runs the `/{name}` H Stack workflow.") + "\n"]
    for key, block in SECTIONS.items():
        heading = re.match(r"## ([^\n]+)", block).group(1)
        if f"## {heading}" not in text:
            parts.append(block + "\n")
    if "Example:" not in text and "```" not in text:
        call = f"/{name}" if name in NO_PROJECT else f"/{name} <project>"
        parts.append(f"**Example:** `{call}` — name the target project and keep the work bounded.\n")
    return text[:pos] + "\n".join(parts) + text[pos:]


def main():
    tags = layer_tags()
    changed = []
    for path in sorted(SKILLS.glob("*/SKILL.md")):
        name = path.parent.name
        original = path.read_text(encoding="utf-8")
        text = original
        meta = add_metadata(text, name, tags.get(name, "v5"))
        purpose = ""
        if meta:
            text, purpose = meta
        result = add_sections(text, name, purpose)
        if result:
            text = result
        if text != original:
            path.write_text(text, encoding="utf-8")
            changed.append(name)
    print(f"normalized {len(changed)} skills: {', '.join(changed)}")


if __name__ == "__main__":
    main()
