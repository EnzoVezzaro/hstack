---
name: verify-and-fix
description: "Use when the user reports a broken behavior or asks to verify that a change works. Reproduces the issue, fixes the cause, and reruns the same path."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Verify and fix

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user reports a broken behavior or asks to verify that a change works.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/verify-and-fix <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 supervisor reproduces, fixes, and verifies; Layer 3 reviews anything large. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T1 reproduces and fixes. Escalate to T2 after two failed fixes; verify with a different model than the author. See [model-routing.md](../../docs/model-routing.md).

1. Reproduce the reported behavior exactly as described. If you cannot reproduce it, report what you tried and stop.
2. Find the cause, not the symptom. Fix it at that point.
3. Rerun the same path that failed, then the full test suite.
4. For changes larger than a few lines, review the diff with `patch-patrol`.
5. If the fix may have caused a regression, compare with the last known-good version using `save-point`.

## Report

Reproduction steps, root cause, the fix, and the before and after results.
