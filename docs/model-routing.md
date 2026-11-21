# Model routing: escalate and downgrade

HStack runs on one rule from V5: **expensive intelligence makes decisions, cheap intelligence does the work.** This page turns that rule into something every skill follows: which tier starts a task, when it moves up, and when it moves back down.

Your own map lives in your `AGENTS.md` (or `CLAUDE.md`) under a `## hstack models` heading. Run [`/setup-hstack`](../skills/setup-hstack/SKILL.md) to detect your agents and write it. Without that block, skills use the defaults below.

## Tiers

| Tier | Role | Default agents and models | Use it for |
| --- | --- | --- | --- |
| **T0 · free worker** | Layer 4 | OpenCode free models (`big-pickle`, `space-bunny-free`), NVIDIA free tier (`glm-5.3-flash`, `nemotron-3.5-lightning`), Freebuff (`mimo-v2.6-pro`, DeepSeek V4 Flash) | Routine execution: tests, docs, cleanup, setup, data gathering, first drafts, mechanical edits |
| **T1 · strong free worker** | Layer 4 supervisor | NVIDIA `glm-5.3`, `nemotron-3-ultra`, Freebuff DeepSeek V4 Pro or Kimi K2.7 Code | Debugging, multi-file changes, verifying a T0 worker's result |
| **T2 · director** | Layer 3 | Codex (`gpt-6-luna`, medium effort), Claude Code (Sonnet) | Planning, acceptance criteria, reviews, decisions inside a project |
| **T3 · top reasoning** | Layer 3, rare | Codex at high effort, Claude Code with Opus | Architecture, security, anything irreversible, and briefs that failed lower down |

The models listed are the ones seen in this machine's history and config on 2026-11-21. Free models change often; `/setup-hstack` re-detects them.

## Start low

Start every task at the lowest tier that can do it. Most HStack skills start at T0 or T1; each skill states its starting tier in its **HStack V5 role** section.

## Escalate one tier when

1. The same brief fails verification twice at the current tier.
2. The task touches architecture, security, money, deleting data, or a product decision.
3. The worker reports low confidence, or two workers return conflicting results.
4. The context the task needs is larger than the current model handles well.

Escalate one tier at a time. Say in the report why you escalated.

## Downgrade when

1. A higher tier has written the plan or the acceptance check. Execution goes back to T0 or T1 with that brief.
2. The task turned out to be routine.
3. The free model you wanted is down or rate-limited. Try the next free model before a paid one.

## Always

- The agent that verifies is not the agent that wrote the change. Prefer a different model.
- Paid tiers (T2, T3) are spent on decisions and reviews, not on typing.
- Respect any budget written in your `AGENTS.md`. If a task would exceed it, stop and ask.
- Escalating never skips the owner's approval for outward-facing actions.
