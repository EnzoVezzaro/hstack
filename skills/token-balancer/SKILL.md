---
name: token-balancer
description: "Use when the user asks /token-balancer, wants to know which subscription has allowance left in Orca, or needs a model picked for the next task by remaining quota and past performance, once or on a schedule."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer1, layer2]
---

# Token balancer

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual projects, check live state, preserve unrelated work, and keep observed numbers separate from assumptions.

## Purpose

Keep work moving across the owner's Orca projects. Read how much of each subscription is left, then match each next task to a model that has the allowance to finish it and a record of doing that kind of work well. This skill observes and recommends. It never selects an account, launches or reassigns an agent, changes a model, or spends paid credits.

**Example:** `/token-balancer <project-a> <project-b>`: what can each project's next task run on right now?
**Example:** `/token-balancer every 2h until Friday, <project>`: the same check on a schedule.

## HStack V5 role

Layer 2 (Orca) supplies live usage, accounts, worktrees, and agent state. Layer 1 turns it into a recommendation for the owner or the project's director to apply. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 collects and formats the snapshot; use T1 when evidence conflicts or several projects compete for the same allowance. See [model-routing.md](../../docs/model-routing.md).

## Prerequisites

- The Orca CLI on PATH. Confirm with `orca --help`; read `orca skills get orca-cli` when it is available.
- The project set, taken from the request or an explicit `## token-balancer` block in a consumer project's `AGENTS.md`. If neither is clear, ask. The open repo is not the whole portfolio.
- Each project's `## hstack models` mapping, if it has one. It says which models the owner allows per tier.

## 1. Read the allowance

Run the read-only snapshot:

```bash
python3 scripts/token-balancer/snapshot.py          # table
python3 scripts/token-balancer/snapshot.py --json   # for a report
```

Run it from an H Stack checkout. Without the script, run `orca account list --json` and read `result.rateLimits`. Each provider (claude, codex, opencode-go, cursor, antigravity, gemini, kimi, minimax, zcode, grok, …) reports `status`, `planType`, and the windows it has: `session` (about 5 h), `weekly`, `monthly`, or `buckets`, each with `usedPercent` and a reset time.

- **Headroom** is 100 minus the highest `usedPercent` across that provider's windows. The tightest window is the one that stops you.
- **Bands:** `ready` (40% or more left), `tight` (15–39% left: small T0/T1 tasks only), `hold` (any window at 100% or under 15% left: wait for the reset), `unknown` (status is not `ok`).
- Treat `unknown` as unknown. Never estimate a quota from a plan name, a model label, or token counts in chat.
- Do not copy emails, account ids, credential sources, or home paths into a report. The script already strips them.

## 2. Gather performance evidence

For each project, look at recent work of the same kind (bug fix, tests, UI, refactor, review):

- `orca worktree ps --json` and `orca worktree list --repo <project> --json` for active and finished worktrees, and the agent and model that ran each one where Orca records it.
- Verified outcomes: merged PRs, green CI, and passed acceptance checks count. "Agent said done" without a check does not.
- Failure signals: verification failed twice, the work was reassigned, or a higher tier had to escalate.
- The project's `## hstack models` notes and any earlier token-balancer reports.

Compare like with like. Session percent, weekly percent, requests, and tokens are different units, so don't rank them against each other. When there are fewer than three comparable outcomes, mark the recommendation **provisional**.

## 3. Recommend

For each `<project>`, take the next task and its tier from [model-routing.md](../../docs/model-routing.md), then choose in this order:

1. Allowed for that tier by the project's `## hstack models` mapping.
2. Its provider is `ready`, or `tight` with a small task. Skip `hold` and `unknown`.
3. The best verified record on comparable work.
4. The lowest cost among what's left. When two providers are close, take the one with more headroom so neither runs dry.

Give one fallback from a different provider. If nothing qualifies, say so and give the earliest reset time. Don't push the task up a tier just to find capacity. Raising the tier is the owner's call.

When several projects draw on the same provider, split by priority. The highest-priority project gets the scarce allowance first, and the rest move to the fallback.

## Periodic review

For a schedule, use [horizon](../horizon/SKILL.md) to draft a fresh-run monitor with an owner-chosen cadence and end date. The prompt names the project set, the snapshot command, the report destination, and the no-reassignment rule. Activate it only after the owner confirms cadence, end date, prompt, and scheduler. Each run re-reads live values instead of carrying old balances forward. It reports only changes that matter: a provider changed band, a reset happened, or a recommendation changed.

## Report

One line of snapshot per provider: band, headroom, binding window, reset, and observation time. Then for each `<project>`: next task and tier, recommended model and fallback, the evidence behind it, confidence (observed / provisional), and any owner action needed. End with the next scheduled check, only if one is actually active.

## Limitations

- Orca only reports providers it can read. A provider showing `unavailable` might still have quota left. Report it as unknown.
- Usage is per account, not per project. Projects that share an account share its allowance.
- A snapshot goes stale. Reset times are exact, but usage keeps moving while agents run.

## Troubleshooting

- **No `rateLimits` in the output:** this Orca version doesn't report usage. Say quota is unknown and recommend on performance and cost alone, marked provisional.
- **A provider's `error` says not signed in or not configured:** report the message as given. Fixing credentials is an owner action.
- **The numbers look wrong:** check `updatedAt`, re-run after a minute, and report both readings rather than picking one.
