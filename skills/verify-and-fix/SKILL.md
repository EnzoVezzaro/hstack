---
name: verify-and-fix
description: "Use when the user reports something broken or asks to verify that a change works. Reproduces the issue, fixes the cause, and reruns the same path."
---

# Verify and fix

This skill covers the **W2 Verificar y arreglar** workflow.

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
