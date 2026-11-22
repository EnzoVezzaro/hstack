---
name: resume-work
description: "Use when the user says to continue, resume, or pick up where an interrupted task stopped."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer2"
---

# Resume work

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 2 (Orca) finds the last state; Layer 3 confirms the next step. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** Resume at the tier the task was on. Do not restart at a paid tier. See [model-routing.md](references/model-routing.md).

0. If the repo has `.acc/`, pull focused context with `acc-context` first.
1. Find the last state: the most recent task, branch, worktree, and any open agent sessions or pending checks.
2. Read what was reported as done and check it against the code or the result. Do not trust the summary alone.
3. Continue the next unfinished step. If the step is ambiguous, ask one question.
4. Stop at any step that needs approval for something outward-facing.

## Report

What was verified as done, what was resumed, and the next step.
