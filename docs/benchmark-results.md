# H Stack benchmark results

Generated 2026-11-22T16:56:52+00:00. Runner: `scripts/benchmark/hstack_bench.py`. Tool versions: `python 3.14.7`, `skillevaluator skillevaluator, version 1.0.1`.

## What was measured

Four fresh environments were created in a temporary root. Each has an empty home and workspace, no `AGENTS.md`, and no prior session state. A starts with no skills; B, C and D receive a fresh copy of every skill. C and D reserve the tool/orchestration layers for a live run; they are identical to B in this keyless pass.

| Configuration | Skills | MCP | Multi-agent | Environment |
| --- | --- | --- | --- | --- |
| A-baseline | Off | On (reserved) | On (reserved) | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-66ke4f5u/A-baseline` |
| B-skills | On | On (reserved) | On (reserved) | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-66ke4f5u/B-skills` |
| C-skills-mcp | On | On (reserved) | On (reserved) | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-66ke4f5u/C-skills-mcp` |
| D-full-stack | On | On (reserved) | On (reserved) | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-66ke4f5u/D-full-stack` |

Isolation checks: no `AGENTS.md` in any fresh environment = True; all outside the repo = True.

## Skill quality (NVIDIA SkillEvaluator, keyless tier 1 quality)

- Skills scored: **62/62**; mean **99.9**, median **100.0**, range **95.0–100.0** out of 100.
- Grades: A: 62.

| Skill | Score | Grade | Warnings | Errors |
| --- | ---: | --- | ---: | ---: |
| `420` | 95.0 | A | 2 | 0 |
| `a-new-day` | 100.0 | A | 0 | 0 |
| `acc-context` | 100.0 | A | 0 | 0 |
| `ace-workspace` | 100.0 | A | 0 | 0 |
| `antislop-review` | 100.0 | A | 0 | 0 |
| `benchmark` | 100.0 | A | 0 | 0 |
| `blocker-radar` | 100.0 | A | 0 | 0 |
| `break-it-down` | 100.0 | A | 0 | 0 |
| `check-github` | 100.0 | A | 0 | 0 |
| `cleanup-chats` | 100.0 | A | 0 | 0 |
| `cleanup-disk-space` | 100.0 | A | 0 | 0 |
| `cleanup-orca` | 100.0 | A | 0 | 0 |
| `cleanup-refactor` | 100.0 | A | 0 | 0 |
| `cleanup-worktrees-branches` | 100.0 | A | 0 | 0 |
| `coordinate-agents` | 100.0 | A | 0 | 0 |
| `deploy` | 100.0 | A | 0 | 0 |
| `docs-content` | 100.0 | A | 0 | 0 |
| `fix-ci` | 100.0 | A | 0 | 0 |
| `get-stoned` | 100.0 | A | 0 | 0 |
| `haf` | 97.5 | A | 1 | 0 |
| `handoff` | 100.0 | A | 0 | 0 |
| `horizon` | 100.0 | A | 0 | 0 |
| `horizon-loop` | 100.0 | A | 0 | 0 |
| `horizon-loop-ego-lite` | 100.0 | A | 0 | 0 |
| `horizon-loop-test` | 100.0 | A | 0 | 0 |
| `hstack` | 100.0 | A | 0 | 0 |
| `humanize` | 100.0 | A | 0 | 0 |
| `implement-feature` | 100.0 | A | 0 | 0 |
| `interface-check` | 100.0 | A | 0 | 0 |
| `let-me-watch` | 100.0 | A | 0 | 0 |
| `motion-graphic` | 100.0 | A | 0 | 0 |
| `patch-patrol` | 100.0 | A | 0 | 0 |
| `pineapple-express` | 100.0 | A | 0 | 0 |
| `plan-horizon` | 100.0 | A | 0 | 0 |
| `proagent-equip` | 100.0 | A | 0 | 0 |
| `product-hunt-launch` | 100.0 | A | 0 | 0 |
| `protect-repo` | 100.0 | A | 0 | 0 |
| `publish-git` | 100.0 | A | 0 | 0 |
| `puff-puff-pass` | 100.0 | A | 0 | 0 |
| `reconcile-branches` | 100.0 | A | 0 | 0 |
| `relay-room` | 100.0 | A | 0 | 0 |
| `release` | 100.0 | A | 0 | 0 |
| `reposell-release` | 100.0 | A | 0 | 0 |
| `research-explain` | 100.0 | A | 0 | 0 |
| `resume-all` | 100.0 | A | 0 | 0 |
| `resume-work` | 100.0 | A | 0 | 0 |
| `run-local` | 100.0 | A | 0 | 0 |
| `save-point` | 100.0 | A | 0 | 0 |
| `security-backend` | 100.0 | A | 0 | 0 |
| `seo-audit` | 100.0 | A | 0 | 0 |
| `set-analytics` | 100.0 | A | 0 | 0 |
| `setup-hstack` | 100.0 | A | 0 | 0 |
| `setup-install` | 100.0 | A | 0 | 0 |
| `skill-workbench` | 100.0 | A | 0 | 0 |
| `stoner` | 100.0 | A | 0 | 0 |
| `take-one-dude` | 100.0 | A | 0 | 0 |
| `token-balancer` | 100.0 | A | 0 | 0 |
| `ui-design` | 100.0 | A | 0 | 0 |
| `verify-and-fix` | 100.0 | A | 0 | 0 |
| `visual-test` | 100.0 | A | 0 | 0 |
| `wrap-day` | 100.0 | A | 0 | 0 |
| `write-readme-opensource` | 100.0 | A | 0 | 0 |

## Harness compatibility (62-skill catalog)

- Catalog: **62 skills**, **7856 description characters**.
- Loads: **6**, degraded: **0**, not loaded: **0**.

| Harness | Status |
| --- | --- |
| claude-code | loads |
| codex | loads |
| copilot-cli | loads |
| hermes | loads |
| openclaw | loads |
| opencode | loads |

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
