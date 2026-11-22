#!/usr/bin/env python3
"""Generate self-contained required references for every published skill.

One source of truth: the repository docs/ files. Each skill folder gets a
references/ copy of the required normative docs with links rewritten so the
folder works alone (no adjacent root docs/). Links to other required docs stay
local; links to nonessential repo docs, skills, and assets become explicit
absolute GitHub URLs.

Usage:
  python3 scripts/quality/generate_skill_references.py            # write
  python3 scripts/quality/generate_skill_references.py --check    # drift check
"""

import argparse
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"
SKILLS = ROOT / "skills"
REPO = "https://github.com/EnzoVezzaro/hstack/blob/main"
RAW = "https://raw.githubusercontent.com/EnzoVezzaro/hstack/main"
REQUIRED = ("skill-contract.md", "hstack-v5.md", "model-routing.md")
HEADER = "<!-- Generated from docs/{name} by scripts/quality/generate_skill_references.py; do not edit. -->\n\n"


def rewrite(text, source_name):
    """Rewrite a required doc's local links for a standalone references/ folder."""
    def repl(match):
        href = match.group(1).strip()
        if href.startswith(("http://", "https://", "mailto:", "data:", "#")):
            return match.group(0)
        target, sep, anchor = href.partition("#")
        base = pathlib.PurePosixPath(target).name
        if target in REQUIRED or base in REQUIRED:
            new = "./" + (base or target)
        else:
            repo_path = (pathlib.PurePosixPath("docs") / target).as_posix()
            while "/../" in repo_path:
                parts = []
                for piece in repo_path.split("/"):
                    if piece == ".." and parts:
                        parts.pop()
                    else:
                        parts.append(piece)
                repo_path = "/".join(parts)
            if pathlib.PurePosixPath(repo_path).suffix.lower() in (".gif", ".png", ".jpg", ".svg"):
                new = RAW + "/" + repo_path
            else:
                new = REPO + "/" + repo_path
        return f"]({new}{sep + anchor if sep else ''})"
    return re.sub(r"\]\(([^)]+)\)", repl, text)


def generated(name):
    text = (DOCS / name).read_text(encoding="utf-8")
    return HEADER.format(name=name) + rewrite(text, name)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true", help="verify generated files are current")
    args = ap.parse_args()
    errors = []
    written = 0
    for skill in sorted(SKILLS.iterdir()):
        if not (skill / "SKILL.md").is_file():
            continue
        ref_dir = skill / "references"
        if not args.check:
            ref_dir.mkdir(exist_ok=True)
        for name in REQUIRED:
            content = generated(name)
            path = ref_dir / name
            if args.check:
                if not path.is_file() or path.read_text(encoding="utf-8") != content:
                    errors.append(f"stale or missing generated reference: {path.relative_to(ROOT)}")
            else:
                if not path.is_file() or path.read_text(encoding="utf-8") != content:
                    path.write_text(content, encoding="utf-8")
                    written += 1
    if args.check:
        if errors:
            print("Reference drift detected:\n" + "\n".join(errors[:20]))
            return 1
        print(f"Generated references current for {len([p for p in SKILLS.iterdir() if (p / 'SKILL.md').is_file()])} skills.")
        return 0
    print(f"Wrote {written} generated reference files across {len([p for p in SKILLS.iterdir() if (p / 'SKILL.md').is_file()])} skills.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
