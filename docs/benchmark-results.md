# H Stack benchmark results

Generated 2026-11-22T22:28:32+00:00. Runner: `scripts/benchmark/hstack_bench.py`. Tool versions: `python 3.14.7`, `skillevaluator not installed`.

## What was measured

Four fresh environments were created in a temporary root. Each has an empty home and workspace, no `AGENTS.md`, and no prior session state. A starts with no skills; B, C and D receive a fresh copy of every skill. This keyless runner does not provide MCP or multi-agent execution; those layers are only configured for a live run.

| Configuration | Skills | MCP | Multi-agent | Environment |
| --- | --- | --- | --- | --- |
| A-baseline | Off | Off | Off | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-6gaaa9ho/A-baseline` |
| B-skills | On | Off | Off | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-6gaaa9ho/B-skills` |
| C-skills-mcp | On | Reserved, not exercised | Off | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-6gaaa9ho/C-skills-mcp` |
| D-full-stack | On | Reserved, not exercised | Reserved, not exercised | `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-6gaaa9ho/D-full-stack` |

Quality/harness inspected `/var/folders/lt/lfbc4_451gg2pb0vvbz8lc4m0000gn/T/hstack-bench-6gaaa9ho/B-skills/home/.agents/skills` — fresh installed payload.
Isolation checks: no `AGENTS.md` in any fresh environment = True; all outside the repo = True.

## Skill quality (NVIDIA SkillEvaluator, keyless tier 1 quality)

- **NOT RUN / unavailable**: evaluator reports `not installed`; 62 required check failures were recorded. No quality scores are invented and the run exits non-zero.

## Harness compatibility (n/a-skill catalog)

Harness check unavailable: evaluator unavailable: [Errno 2] No such file or directory: 'skillevaluator'

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
