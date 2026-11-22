---
name: horizon-loop-test
description: "Use when the user types /horizon-loop-test or wants tests driven to a goal over many iterations: every test green."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Horizon loop for tests

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user types /horizon-loop-test or wants tests driven to a goal over many iterations: every test green.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/horizon-loop-test <project>` — name the target project and keep the work bounded.

A `horizon-loop` where the metric is the test suite.

## HStack V5 role

Layer 4 workers fix failures; Layer 3 decides when a failing test is wrong rather than the code.

**Model tier:** T0 for straightforward failures, T1 for anything spanning several files. After two failed fixes of the same test, escalate one tier. See [model-routing.md](../../docs/model-routing.md).

1. Agree the goal: all green, coverage at or above a number, or N clean consecutive runs to rule out flakes.
2. Run the full suite and record the baseline in the loop log.
3. Each iteration: take the first failing test, reproduce it alone, fix the cause in the code, rerun that test, then rerun the suite.
4. Never skip, delete, loosen, or mark a test optional to make it pass. If the test itself is wrong, stop and ask a T2 reviewer or the owner.
5. For flakes, rerun the suite the agreed number of times. A flake counts as a failure until its cause is fixed.
6. Stop on the goal, on the iteration limit, or after three iterations with no progress.

## Report

Baseline and final results, tests fixed with their causes, tests still failing, and any test flagged as wrong.
