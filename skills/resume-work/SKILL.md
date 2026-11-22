---
name: resume-work
description: "Use when the user says to continue, resume, or pick up where an interrupted task stopped."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer2]
---

# Resume work

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user says to continue, resume, or pick up where an interrupted task stopped.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/resume-work <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 2 (Orca) finds the last state; Layer 3 confirms the next step. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** Resume at the tier the task was on. Do not restart at a paid tier. See [model-routing.md](../../docs/model-routing.md).

0. If the repo has `.acc/`, pull focused context with `acc-context` first.
1. Find the last state: the most recent task, branch, worktree, and any open agent sessions or pending checks.
2. Read what was reported as done and check it against the code or the result. Do not trust the summary alone.
3. Continue the next unfinished step. If the step is ambiguous, ask one question.
4. Stop at any step that needs approval for something outward-facing.

## Report

What was verified as done, what was resumed, and the next step.
