---
name: benchmark
description: "Use when the user asks to benchmark H Stack or its skills: measure skill quality, harness loading, and routing in fresh environments, or set up a controlled A/B matrix with SkillsBench, SkillEvaluator, Harness Benchmark, or Terminal-Bench."
---

# Benchmark the stack

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

Measure before claiming improvement. This skill separates **skill checks** (does a skill work?) from **stack benchmarks** (does the whole setup perform better?), and keeps the two reports apart.

## HStack V5 role

Layer 4 runs the checks; Layer 3 interprets the result and the owner approves anything that costs money or publishes results. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T1 runs deterministic checks; T3 reviews conclusions before publishing. See [model-routing.md](../../docs/model-routing.md).

## Two different questions

| Question | Framework | What it answers |
| --- | --- | --- |
| Is each skill well formed, safe, and loadable? | [NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) | Quality score, schema, harness compatibility, and (with keys and a sandbox) live skill lift. |
| Does a skill help an agent finish tasks? | [SkillsBench](https://github.com/benchflow-ai/skillsbench), [SWE-Skills-Bench](https://github.com/GeniusHTX/SWE-Skills-Bench) | With-skill vs without-skill task success on the same cases. |
| Does the whole stack beat another configuration? | [Harness Benchmark](https://github.com/Heretek-AI/harness-benchmark), [Terminal-Bench](https://github.com/harbor-framework/terminal-bench) | Harness, MCP, skills, and orchestration compared under controlled budgets. |

Treat published numbers in a framework's own README as illustrative until you reproduce them. Harness Benchmark labels its tables as examples; do not copy them into a result.

## Keyless run (no model API key)

The local runner needs Python 3 and, for the skill checks, `skillevaluator`:

```bash
python3 scripts/benchmark/hstack_bench.py all
```

It creates a separate fresh environment for each configuration, installs the skills there, and records a manifest. It then runs quality and harness checks and a deterministic router contract probe. Results go to `docs/benchmark-results.md` with compact JSON in `benchmarks/results/latest.json`.

Use a dedicated interpreter so the evaluation tooling stays out of the repo:

```bash
uv venv --python 3.14 /path/to/hstack-bench-venv
uv pip install --python /path/to/hstack-bench-venv/bin/python skillevaluator
python3 scripts/benchmark/hstack_bench.py all --evaluator /path/to/hstack-bench-venv/bin/skillevaluator
```

## Controlled A/B matrix (needs model access)

Run the same cases in fresh environments, changing one layer at a time. Keep model, prompt, context, tools, and budget fixed.

| Configuration | Skill | MCP | Multi-agent |
| --- | --- | --- | --- |
| A — Baseline | Off | Off | Off |
| B — Skill only | On | Off | Off |
| C — Skill + tools | On | On | Off |
| D — Full stack | On | On | On |

Record success rate, real cost, tokens, latency, reliability over repeated trials, and the marginal gain of each layer. A layer that adds complexity without a measured gain does not belong in the default route.

## Stop conditions

- Without model credentials, report only keyless results. Never present a router contract check as a model benchmark.
- Do not publish a comparison unless every cell used the same cases, model, context, and budget.
- Do not spend subscription quota or cloud credits without the owner's explicit approval.

## Report

Date, tool versions, environments (fresh or reused), configurations, cases and repetition count, measured metrics with units, limitations, and the exact command to reproduce. Missing measurements stay marked `NOT RUN`.
