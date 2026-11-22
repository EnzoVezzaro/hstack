# H Stack benchmark results

Generated 2026-11-22T15:59:48+00:00. Runner: `scripts/benchmark/hstack_bench.py`. Tool versions: `python 3.14.7`, `skillevaluator skillevaluator, version 1.0.1`.

## What was measured

Four fresh environments were created in a temporary root. Each has an empty home and workspace, no `AGENTS.md`, and no prior session state. A starts with no skills; B, C and D receive a fresh copy of every skill. C and D reserve the tool/orchestration layers for a live run; they are identical to B in this keyless pass.

| Configuration | Skills | MCP | Multi-agent | Environment |
| --- | --- | --- | --- | --- |
| A-baseline | Off | On (reserved) | On (reserved) | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-3_ith717/A-baseline` |
| B-skills | On | On (reserved) | On (reserved) | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-3_ith717/B-skills` |
| C-skills-mcp | On | On (reserved) | On (reserved) | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-3_ith717/C-skills-mcp` |
| D-full-stack | On | On (reserved) | On (reserved) | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-3_ith717/D-full-stack` |

Isolation checks: no `AGENTS.md` in any fresh environment = True; all outside the repo = True.

## Skill quality (NVIDIA SkillEvaluator, keyless tier 1 quality)

- Skills scored: **62/62**; mean **83.8**, median **83.2**, range **78.2–88.5** out of 100.
- Grades: B: 57, C: 5.

| Skill | Score | Grade | Warnings | Errors |
| --- | ---: | --- | ---: | ---: |
| `420` | 79.8 | C | 12 | 0 |
| `a-new-day` | 84.8 | B | 10 | 0 |
| `acc-context` | 83.2 | B | 9 | 0 |
| `ace-workspace` | 80.8 | B | 10 | 0 |
| `antislop-review` | 84.5 | B | 8 | 0 |
| `benchmark` | 87.8 | B | 8 | 0 |
| `blocker-radar` | 83.2 | B | 9 | 0 |
| `break-it-down` | 80.8 | B | 10 | 0 |
| `check-github` | 80.8 | B | 10 | 0 |
| `cleanup-chats` | 84.8 | B | 10 | 0 |
| `cleanup-disk-space` | 82.0 | B | 9 | 0 |
| `cleanup-orca` | 86.0 | B | 9 | 0 |
| `cleanup-refactor` | 80.8 | B | 10 | 0 |
| `cleanup-worktrees-branches` | 82.0 | B | 9 | 0 |
| `coordinate-agents` | 84.5 | B | 8 | 0 |
| `deploy` | 84.5 | B | 8 | 0 |
| `docs-content` | 80.8 | B | 10 | 0 |
| `fix-ci` | 84.5 | B | 8 | 0 |
| `get-stoned` | 82.2 | B | 10 | 0 |
| `haf` | 83.5 | B | 10 | 0 |
| `handoff` | 82.0 | B | 9 | 0 |
| `horizon` | 86.0 | B | 9 | 0 |
| `horizon-loop` | 86.0 | B | 9 | 0 |
| `horizon-loop-ego-lite` | 83.2 | B | 9 | 0 |
| `horizon-loop-test` | 83.2 | B | 9 | 0 |
| `hstack` | 88.5 | B | 8 | 0 |
| `humanize` | 82.0 | B | 9 | 0 |
| `implement-feature` | 84.5 | B | 8 | 0 |
| `interface-check` | 86.0 | B | 9 | 0 |
| `let-me-watch` | 84.8 | B | 10 | 0 |
| `motion-graphic` | 82.0 | B | 9 | 0 |
| `patch-patrol` | 88.5 | B | 8 | 0 |
| `pineapple-express` | 86.0 | B | 9 | 0 |
| `plan-horizon` | 86.0 | B | 9 | 0 |
| `proagent-equip` | 83.2 | B | 9 | 0 |
| `product-hunt-launch` | 82.0 | B | 9 | 0 |
| `protect-repo` | 83.2 | B | 9 | 0 |
| `publish-git` | 82.0 | B | 9 | 0 |
| `puff-puff-pass` | 79.5 | C | 10 | 0 |
| `reconcile-branches` | 88.5 | B | 8 | 0 |
| `relay-room` | 84.8 | B | 10 | 0 |
| `release` | 80.8 | B | 10 | 0 |
| `reposell-release` | 83.2 | B | 9 | 0 |
| `research-explain` | 78.2 | C | 10 | 0 |
| `resume-all` | 88.5 | B | 8 | 0 |
| `resume-work` | 78.2 | C | 10 | 0 |
| `run-local` | 83.2 | B | 9 | 0 |
| `save-point` | 87.2 | B | 9 | 0 |
| `security-backend` | 84.5 | B | 8 | 0 |
| `seo-audit` | 80.8 | B | 10 | 0 |
| `set-analytics` | 88.5 | B | 8 | 0 |
| `setup-hstack` | 86.0 | B | 9 | 0 |
| `setup-install` | 80.8 | B | 10 | 0 |
| `skill-workbench` | 87.2 | B | 9 | 0 |
| `stoner` | 88.5 | B | 8 | 0 |
| `take-one-dude` | 87.2 | B | 9 | 0 |
| `token-balancer` | 86.0 | B | 9 | 0 |
| `ui-design` | 82.0 | B | 9 | 0 |
| `verify-and-fix` | 80.8 | B | 9 | 0 |
| `visual-test` | 88.5 | B | 8 | 0 |
| `wrap-day` | 79.5 | C | 11 | 0 |
| `write-readme-opensource` | 80.8 | B | 10 | 0 |

## Harness compatibility (62-skill catalog)

- Catalog: **62 skills**, **14611 description characters**.
- Loads: **4**, degraded: **2**, not loaded: **0**.

| Harness | Status |
| --- | --- |
| claude-code | degraded |
| codex | degraded |
| copilot-cli | loads |
| hermes | loads |
| openclaw | loads |
| opencode | loads |

- `claude-code`: The 62 skills in this folder have 14,611 description chars; Claude Code's skill list fits 8,000 (1% of the context window at 4 chars per token; 8,000 if the window is unknown), so descriptions get shortened.
- `codex`: The 62 skills in this folder have 14,611 description chars; Codex's skill list fits about 8,000 (2% of the context window at 4 bytes per token; 8,000 chars if unknown), so descriptions get shortened, then removed, then skills left out.
- `copilot-cli`: 62 skills here: Copilot gives full descriptions to the first 32 only; the rest are listed by name.
- `copilot-cli`: New skills appear only after `/skills reload` or a restart; edits to existing skills apply at once.
- `opencode`: Skill list and text are cached at startup; edits need a restart.

## Router contract probe (deterministic, not model-based)

Sample prompts are checked against the `/hstack` route table in the fresh environment. A case passes when its expected skill is listed and a trigger phrase from the prompt appears in that row. This tests routing coverage, not whether a model picks the skill.

| Configuration | Passed | Rows |
| --- | ---: | ---: |
| A-baseline | 0/12 | 0 |
| B-skills | 12/12 | 61 |
| C-skills-mcp | 12/12 | 61 |
| D-full-stack | 12/12 | 61 |

## Not run

Task success, Pass@k, cost, tokens, latency, tool reliability, skill lift and single- vs multi-agent comparisons require live model runs. They are **NOT RUN**: no model API credentials were provided and no subscription quota was spent. Framework README tables are illustrative and were not copied as results.

## Reproduce

```bash
python3 scripts/benchmark/hstack_bench.py all --evaluator /path/to/skillevaluator
```

See [benchmark.md](benchmark.md) for the full matrix and the live-run procedure.
