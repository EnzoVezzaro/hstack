#!/usr/bin/env bash
# Install H Stack skills as self-contained folders.
#
# Each published skill carries its required normative docs in references/.
# Those files are generated from the repository docs/ source by
# scripts/quality/generate_skill_references.py and drift-checked before install.
# No adjacent root docs/ folder and no generic user docs directory is used.
#
# Usage:
#   scripts/install/install.sh [--all | SKILL...] [--skills-root DIR]
#
# This installs only the named skill folders. Optional companion skills, tools,
# and external source skills are not installed; see docs/source-skills.md.
# Helper scripts are NOT installed: /benchmark, /token-balancer and /resume-all
# require a repository checkout (see docs/benchmark.md and the skill files).
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

skills_root="${HOME}/.claude/skills"
install_all=0
names=()

while [ "$#" -gt 0 ]; do
  case "$1" in
    --all) install_all=1; shift ;;
    --skills-root) skills_root="$2"; shift 2 ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    -*) echo "Unknown option: $1" >&2; exit 2 ;;
    *) names+=("$1"); shift ;;
  esac
done

if [ "$install_all" -eq 0 ] && [ "${#names[@]}" -eq 0 ]; then
  install_all=1
fi

mkdir -p "$(dirname "$skills_root")"
skill_dest="${skills_root%/}"
mkdir -p "$skill_dest"

# Drift check: generated references must match the single docs/ source.
python3 "$REPO/scripts/quality/generate_skill_references.py" --check

installed=()
if [ "$install_all" -eq 1 ]; then
  for skill in "$REPO"/skills/*; do
    [ -f "$skill/SKILL.md" ] || continue
    cp -R "$skill" "$skill_dest/"
    installed+=("$(basename "$skill")")
  done
else
  for name in "${names[@]}"; do
    case "$name" in
      */*|.*) echo "Invalid skill name: $name" >&2; exit 2 ;;
    esac
    if [ ! -f "$REPO/skills/$name/SKILL.md" ]; then
      echo "No such H Stack skill: $name" >&2; exit 2
    fi
    cp -R "$REPO/skills/$name" "$skill_dest/"
    installed+=("$name")
  done
fi

# Verify the installed payload itself: required references must exist and all
# required-document links must resolve inside the installed skill folder.
node "$REPO/scripts/install/check-payload.mjs" "$skill_dest" "${installed[@]}"

echo "Installed ${#installed[@]} self-contained skill(s) to $skill_dest"
echo "Required references are bundled in each skill's references/ folder."
echo "Optional companion skills and external tools are not installed; see docs/source-skills.md."
echo "Helper scripts require a repository checkout; they are not copied by this installer."
