---
name: fix-ci
description: "Use when a CI run fails or the user asks to fix CI or GitHub Actions. Reads the failing logs, fixes the cause, and reruns the same checks."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Fix CI

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 reads the logs and fixes the cause; Layer 3 reviews if the fix is not obvious. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0 for obvious failures, T1 otherwise. Escalate to T2 after two failed reruns. See [model-routing.md](references/model-routing.md).

1. Find the failing run with `gh run list` and open the failed steps with `gh run view --log-failed`.
2. Identify the first real error. Ignore cascading failures after it.
3. Reproduce the failing step locally with the same command and versions when possible.
4. Fix the cause. Do not disable the check or mark it optional to get green.
5. Commit the fix. Push only when the user asks, then rerun the workflow with `gh run rerun` and watch it to the end.

## Report

Failing step, root cause, the fix, the local reproduction, and the CI result after the rerun.
