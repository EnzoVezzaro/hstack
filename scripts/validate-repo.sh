#!/usr/bin/env bash
# One entry point for the repository's deterministic checks. No network,
# no model API calls, no Orca connection, no outward actions.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "[1/8] skill catalog, real YAML frontmatter, router, generated refs, raw payloads"
node scripts/validate-skills.mjs
echo "[2/8] frontmatter fixture regressions"
python3 scripts/quality/test_frontmatter.py
echo "[3/8] local Markdown links"
node scripts/quality/check-links.mjs
echo "[4/8] resume scanner regressions"
python3 scripts/orca-resume/test_scan.py
echo "[5/8] benchmark validity regressions"
python3 scripts/benchmark/test_hstack_bench.py
echo "[6/8] authorization document checks"
python3 scripts/quality/test_authorization_scope.py
echo "[7/8] handoff/process document checks"
python3 scripts/quality/test_handoff_lifecycle.py
echo "[8/8] whitespace / diff hygiene"
git diff --check

echo "All repository checks passed."
