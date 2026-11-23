# Benchmarking H Stack

Two different questions need two different measurements:

1. **Do the skills work?** Quality, schema, security, harness loading, and task lift from a skill.
2. **Does the stack work better?** Model + harness + skills + MCP + orchestration compared as one system.

Keep their reports separate. A good quality score is not evidence of task success, and a harness README's own tables are not an independent result.

## Frameworks

| Framework | Evaluates | Used here for |
| --- | --- | --- |
| [NVIDIA SkillEvaluator](https://github.com/NVIDIA/SkillEvaluator) | Skill quality, security, compatibility, deduplication, live impact | Keyless quality + harness compatibility; CI gate candidate |
| [SkillsBench](https://github.com/benchflow-ai/skillsbench) | Agent performance with vs without skills | Skill lift on identical cases |
| [SWE-Skills-Bench](https://github.com/GeniusHTX/SWE-Skills-Bench) | Skills' effect on software-engineering tasks | Coding-specific skill cases |
| [Harness Benchmark](https://github.com/Heretek-AI/harness-benchmark) | Harnesses, MCP, LSP, skills, full stacks | Adapter and report design; reproduced runs only |
| [Terminal-Bench](https://github.com/harbor-framework/terminal-bench) | Real terminal engineering tasks | End-to-end task success with deterministic verifiers |

Harness Benchmark's README tables are explicitly illustrative. Do not quote them as results.

## What the local runner measures

`scripts/benchmark/hstack_bench.py` is deterministic and keyless:

- **Fresh environments**: A–D each get an empty home and workspace, no `AGENTS.md`, no prior session state. B–D receive a fresh copy of every skill; A receives none.
- **Quality**: SkillEvaluator's tier-1 quality score for each skill (0–100, dimensions: correctness, discoverability, reliability, efficiency).
- **Harness compatibility**: one catalog-wide check that reports load / degraded / not loaded for each harness profile, including description-budget limits.
- **Router contract**: sample prompts checked against the `/hstack` route table. This is a coverage test of the routing table, **not** a model benchmark.

Missing model metrics (task success, Pass@k, cost, tokens, latency, tool reliability, skill lift) stay marked `NOT RUN`. See [benchmark-results.md](benchmark-results.md).

## Run it

```bash
uv venv --python 3.14 /path/to/hstack-bench-venv
uv pip install --python /path/to/hstack-bench-venv/bin/python skillevaluator
python3 scripts/benchmark/hstack_bench.py all \
  --evaluator /path/to/hstack-bench-venv/bin/skillevaluator
```

Outputs: `docs/benchmark-results.md` (human report) and `benchmarks/results/latest.json` (compact data).

## Keeping the catalog clean

Two local scripts keep the keyless scores reproducible:

- `python3 scripts/quality/normalize_skills.py` adds the metadata and short reference sections that SkillEvaluator checks. It is idempotent and never rewrites a skill's procedure.
- `python3 scripts/quality/shorten_descriptions.py` trims trigger-first descriptions so the whole catalog fits the ~8,000-character listing budget of Claude Code and Codex. This trades long descriptions for full harness loading; keep the trigger and the negative boundary phrase.

The only remaining static findings are the public names `420` and `haf`, which the evaluator considers unconventional or short. Renaming them would break published slash commands, so they stay as documented exceptions.

## Controlled A/B matrix for live runs

Change one layer at a time; keep model, prompt, context, tools, and budget fixed.

| Configuration | Skill | MCP | Multi-agent |
| --- | --- | --- | --- |
| A — Baseline | Off | Off | Off |
| B — Skill only | On | Off | Off |
| C — Skill + tools | On | On | Off |
| D — Full stack | On | On | On |

For each cell record: task completion, actual cost, tokens, latency, reliability over repeated trials, and the marginal gain from the added layer. Run each case enough times to report a mean and a spread; a single pass is an anecdote.

Suggested live sequence:

1. SkillEvaluator `validate --tiers 1,2` to gate quality and overlap before any model spend.
2. SkillsBench or SWE-Skills-Bench for with-skill vs without-skill task lift.
3. Terminal-Bench for end-to-end task success with deterministic verifiers.
4. Harness Benchmark's adapters for the harness/MCP/full-stack comparison, with its numbers reproduced rather than copied.

Live runs need API keys or explicit permission to spend subscription quota. Do not start them implicitly.

## Live runs

`scripts/benchmark/live_bench.py` runs every skill and workflow through OpenCode, in fresh empty repositories, and writes [benchmark-live-results.md](benchmark-live-results.md). It runs only when invoked with `run`.

```bash
python3 scripts/benchmark/live_bench.py smoke                  # keyless: coverage, prompts, installer payload
python3 scripts/benchmark/live_bench.py run --tiers L0         # free tier only
python3 scripts/benchmark/live_bench.py run --skip-unavailable # escalate, but skip tiers whose credits are empty
python3 scripts/benchmark/live_bench.py report benchmarks/results/live-latest.json
```

**Setup per scenario.** Each scenario gets a new git repository with a local bare `origin`, so a push is detectable. Most repositories are empty. A seed adds only the smallest subject a skill needs (a bug, a diff, a CI file). The skill's `SKILL.md` and bundled references are attached to the prompt. Each run gets its own OpenCode server started inside that repository, with `XDG_CONFIG_HOME` pointed at an empty directory, so personal MCP servers, global `AGENTS.md` files, and the host project directory do not reach the run.

**Host isolation.** The run's PATH is prefixed with stubs for app-control and host-state commands (`osascript`, `open`, `orca`, `codex`, `claude`, `acc`, `killall`, `pkill`, `launchctl`, and others). The prompt forbids controlling apps or reading files outside the scratch repository. Any attempt is recorded from the tool stream and fails the scenario, so a skill must report the blocker instead of driving the host machine.

**Ladder.** `opencode/hy4-flash-free` (the free hy4 model on this account) runs first. A failed scenario escalates to `opencode/claude-haiku-5-5`. The `opencode-go/hy4*` models need an OpenCode Go subscription and are not used. Haiku is billed to OpenCode Models credits; if the balance is empty the escalation tier cannot run and the report says so.

**Grading.** A scenario passes when every deterministic check passes (required files, shell commands, origin unchanged, router accuracy at least 0.8) and the judge scores it 4 or higher with an honest report. The default judge is the free `opencode/deepseek-v4.1-flash-free`; override with `--judge-model`. If Haiku escalation is enabled, worker and judge are the same model on that tier, so those grades are self-judged.

**Scope.** Orca, Ego Lite, computer use, PostHog, and similar services are not connected in these runs. A skill that reports that honestly passes; a skill that invents results fails. The live suite covers all 62 skills, five multi-step workflows (feature to commit, CI fix to commit, handoff to a fresh agent, regression fix, local release), and one router test.

**Limits.** One trial per scenario. Quote rates only after repeating a scenario. Free-tier rate limits and timeouts count as failures, and the transcripts keep the evidence.
