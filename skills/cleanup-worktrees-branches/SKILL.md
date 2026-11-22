---
name: cleanup-worktrees-branches
description: "Use when the user asks to merge work into main and remove the leftover worktrees and branches."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer2]
---

# Clean up worktrees and branches

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to merge work into main and remove the leftover worktrees and branches.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/cleanup-worktrees-branches <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 2 (Orca) lists the worktrees; the owner confirms every deletion. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 lists; T2 checks unmerged work before anything is deleted. See [model-routing.md](../../docs/model-routing.md).

1. List all worktrees and local and remote branches, with their last commit and whether each is merged into main.
2. Merge the work that should land in main through `reconcile-branches`, which plans and rehearses the order before anything lands. Do not merge anything that is not reviewed.
3. Show the user the list of branches and worktrees to delete, split into merged and unmerged.
4. Delete the merged ones after confirmation. Ask about each unmerged one separately; never delete it on your own.
5. Remove the worktree folders with `git worktree remove`, then prune.

## Report

Merged, deleted, kept, and the reason for each kept item.
