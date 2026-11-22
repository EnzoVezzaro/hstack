---
name: cleanup-disk-space
description: "Use when the user asks to free disk space. Measures where the space is used, proposes safe deletions, and deletes only after confirmation."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Clean up disk space

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to free disk space.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/cleanup-disk-space <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 measures; the owner confirms every deletion. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. Measure first: find the largest folders in the user's home and the project, and the size of caches, node_modules, build outputs, Docker images, and simulator data.
2. Group the findings into safe (caches, build outputs that can be rebuilt) and needs approval (images, data, anything without a clear rebuild path).
3. Show the list with sizes and ask for confirmation before deleting anything.
4. Delete the approved items. Measure free space again.

## Report

Space before and after, what was deleted, and what was kept and why. Never delete user files or data without explicit approval.
