---
name: verify-and-fix
description: "Use when the user reports a broken behavior or asks to verify that a change works. Reproduces the issue, fixes the cause, and reruns the same path."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Verify and fix

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 supervisor reproduces, fixes, and verifies; Layer 3 reviews anything large. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T1 reproduces and fixes. Escalate to T2 after two failed fixes; verify with a different model than the author. See [model-routing.md](references/model-routing.md).

1. Reproduce the reported behavior exactly as described. If you cannot reproduce it, report what you tried and stop.
2. Find the cause, not the symptom. Fix it at that point.
3. Rerun the same path that failed, then the full test suite.
4. For changes larger than a few lines, review the diff with `patch-patrol`.
5. If the fix may have caused a regression, compare with the last known-good version using `save-point`.

## Report

Reproduction steps, root cause, the fix, and the before and after results.
