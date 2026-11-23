#!/usr/bin/env bash
# One entry point for the repository's deterministic checks. No network,
# no model API calls, no Orca connection, no outward actions.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

echo "[1/9] skill catalog, real YAML frontmatter, router, generated refs, raw payloads"
node scripts/validate-skills.mjs
echo "[2/9] frontmatter fixture regressions"
python3 scripts/quality/test_frontmatter.py
echo "[3/9] local Markdown links"
node scripts/quality/check-links.mjs
echo "[4/9] resume scanner regressions"
python3 scripts/orca-resume/test_scan.py
echo "[5/9] benchmark validity regressions"
python3 scripts/benchmark/test_hstack_bench.py
echo "[6/9] live benchmark harness regressions"
python3 -m pytest scripts/benchmark/test_live_bench.py -q
echo "[7/9] authorization document checks"
python3 scripts/quality/test_authorization_scope.py
echo "[8/9] handoff/process document checks"
python3 scripts/quality/test_handoff_lifecycle.py
echo "[9/9] whitespace / diff hygiene"
git diff --check

echo "All repository checks passed."
