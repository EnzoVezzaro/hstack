---
name: visual-test-ego-lite
description: "Use when the user asks to test a running app visually, or to operate it in ego-lite the way a person would. Opens the app, follows the main flows, and reports what a user would see."
---

# Visual testing with ego-lite

This skill extends the **W2 Verificar y arreglar** workflow.

## HStack V5 role

Layer 5 (Ego Lite) operates the browser; Layer 3 decides what counts as a failure. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 drives the browser; T2 judges unclear failures. See [model-routing.md](../../docs/model-routing.md).

1. Start from a running app. If none is running, use `run-local` first.
2. Load the `ego-browser` skill and open the app in ego-lite. Use the user's logged-in sessions only when the task needs them.
3. Follow each main flow as a user would: click, type, navigate. Note every step that fails or looks wrong.
4. Take a screenshot at each failure and at the final state.
5. Repeat the failing flow once to confirm it is not flaky.

## Report

Flows tested, pass or fail per flow, screenshots of failures, and the exact steps to reproduce each one. Do not fix code here; hand failures to `verify-and-fix`.
