---
name: cleanup-worktrees-branches
description: "Use when the user asks to merge work into main and remove the leftover worktrees and branches. Removes only what is merged or abandoned after confirmation."
---

# Clean up worktrees and branches

This skill extends the **W5 Publicar y git** workflow.

## HStack V5 role

Layer 2 (Orca) lists the worktrees; the owner confirms every deletion. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 lists; T2 checks unmerged work before anything is deleted. See [model-routing.md](../../docs/model-routing.md).

1. List all worktrees and local and remote branches, with their last commit and whether each is merged into main.
2. Merge the work that should land in main, using `publish-git`. Do not merge anything that is not reviewed.
3. Show the user the list of branches and worktrees to delete, split into merged and unmerged.
4. Delete the merged ones after confirmation. Ask about each unmerged one separately; never delete it on your own.
5. Remove the worktree folders with `git worktree remove`, then prune.

## Report

Merged, deleted, kept, and the reason for each kept item.
