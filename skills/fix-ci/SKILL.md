---
name: fix-ci
description: "Use when a CI run fails or the user asks to fix CI or GitHub Actions. Reads the failing logs, fixes the cause, and reruns the same checks."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Fix CI

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when a CI run fails or the user asks to fix CI or GitHub Actions.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/fix-ci <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 reads the logs and fixes the cause; Layer 3 reviews if the fix is not obvious. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 for obvious failures, T1 otherwise. Escalate to T2 after two failed reruns. See [model-routing.md](../../docs/model-routing.md).

1. Find the failing run with `gh run list` and open the failed steps with `gh run view --log-failed`.
2. Identify the first real error. Ignore cascading failures after it.
3. Reproduce the failing step locally with the same command and versions when possible.
4. Fix the cause. Do not disable the check or mark it optional to get green.
5. Commit the fix. Push only when the user asks, then rerun the workflow with `gh run rerun` and watch it to the end.

## Report

Failing step, root cause, the fix, the local reproduction, and the CI result after the rerun.
