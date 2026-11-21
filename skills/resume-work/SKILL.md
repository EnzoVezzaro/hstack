---
name: resume-work
description: "Use when the user says to continue, resume, or pick up where things stopped. Reads the last state of the task and continues the next verified step."
---

# Resume work

This skill extends the **W3 Coordinar agentes** workflow.

## HStack V5 role

Layer 2 (Orca) finds the last state; Layer 3 confirms the next step. See [hstack-v5.md](../../docs/hstack-v5.md).

1. Find the last state: the most recent task, branch, worktree, and any open agent sessions or pending checks.
2. Read what was reported as done and check it against the code or the result. Do not trust the summary alone.
3. Continue the next unfinished step. If the step is ambiguous, ask one question.
4. Stop at any step that needs approval for something outward-facing.

## Report

What was verified as done, what was resumed, and the next step.
