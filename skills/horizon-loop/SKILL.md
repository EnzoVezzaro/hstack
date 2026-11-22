---
name: horizon-loop
description: "Use when the user types /horizon-loop or wants a task repeated for a long time until a threshold or goal is reached."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Horizon loop: repeat until the goal

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user types /horizon-loop or wants a task repeated for a long time until a threshold or goal is reached.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/horizon-loop <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 workers run the iterations; Layer 3 sets the goal and steps in on a stall.

**Model tier:** iterations at T0 or T1. After two iterations with no progress, escalate one tier for the next iteration, then hand back down. See [model-routing.md](../../docs/model-routing.md).

1. Agree the metric, the threshold, and how to measure it with one command or check. A goal you cannot measure cannot be looped.
2. Agree the limits: maximum iterations, maximum time or budget, and the stall rule (for example, no gain in three iterations).
3. Measure the baseline and write it to the loop log (for example `.hstack/loops/<id>.md`).
4. Each iteration:
   1. read the log;
   2. change one thing;
   3. measure with the same command;
   4. keep the change only if the metric improved and nothing else broke; otherwise revert it;
   5. append the change, the measurement, and the decision to the log.
5. Stop when the threshold is reached, a limit is hit, or the stall rule fires. Do not lower the threshold to finish.
6. For loops that outlive a session, run each iteration from a schedule set up with `horizon`, or with Claude Code `/loop`.

## Report

Baseline, final value, threshold, iterations run, why it stopped, and the changes kept.
