---
name: break-it-down
description: "Use when the user types /break-it-down, or a task is too big for one agent or one session."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer3]
---

# Break it down

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user types /break-it-down, or a task is too big for one agent or one session.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/break-it-down <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 3 (director) splits the work; Layer 4 workers take the units.

**Model tier:** T2 writes the breakdown, because a bad split costs more than a good model. The units it produces should be small enough for T0 or T1. See [model-routing.md](../../docs/model-routing.md).

1. Write the goal and the done condition in one sentence each. If you cannot, ask before splitting.
2. Split into units that each end in a state someone can check: a passing test, a visible screen, a merged diff, a report.
3. Make each unit small enough for one worker in one session. If a unit needs a design decision, make that decision its own unit, done by T2.
4. For each unit, write: what to do, the files or area it owns, how to check it is done, its dependencies, and its tier.
5. Order the units. Mark the ones with no shared files as parallel.
6. If the repo has `.acc/`, attach the `acc context` path each unit needs.

## Report

A numbered list of units, each with owner area, done check, dependencies, tier, and parallel flag. Ready to hand to `coordinate-agents`, `ace-workspace`, or `horizon`.
