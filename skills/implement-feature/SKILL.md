---
name: implement-feature
description: "Use when the user asks to build or change a feature. Writes the acceptance check first, implements the smallest change, then hands verification to verify-and-fix."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Implement a feature

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to build or change a feature.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/implement-feature <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 worker writes the change; Layer 3 approves the acceptance check. Routine work goes to free models. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 for routine changes, T1 for multi-file work. Escalate to T2 after two failed verifications or when the change crosses an architecture boundary. See [model-routing.md](../../docs/model-routing.md).

0. If the repo has `.acc/`, pull focused context with `acc-context` first.
1. Confirm the repo, branch or worktree, and any uncommitted changes. Do not overwrite work in progress.
2. Write the acceptance check first: a test, or an observable behavior you can run. If the spec is ambiguous, ask one question before coding.
3. Implement the smallest change that passes the check. Keep unrelated edits out.
4. Run the check and the existing suite.
5. Hand off to `verify-and-fix` before anything is committed.

## Report

Changed files, the acceptance check and its result, and what is not done yet.
