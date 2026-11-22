---
name: cleanup-refactor
description: "Use when the user asks to remove unused code, files, or resources, or to refactor without changing behavior. Not for unrelated work."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Clean up and refactor

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to remove unused code, files, or resources, or to refactor without changing behavior.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/cleanup-refactor <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 does the refactor in small steps; Layer 3 reviews any behavior change. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 deletes; T1 refactors; T2 reviews any behavior change. See [model-routing.md](../../docs/model-routing.md).

1. Find unused code and files by searching for references. Use a dead-code tool if the project has one.
2. Propose the list before deleting.
3. Delete in small steps. Run the tests after each one.
4. Refactor only where tests cover the behavior. Behavior must not change.
5. Ask before deleting anything outside the code: images, caches, containers, or data.

## Report

What was removed or refactored, the test results, and what was left alone and why.
