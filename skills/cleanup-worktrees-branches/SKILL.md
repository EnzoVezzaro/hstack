---
name: cleanup-worktrees-branches
description: "Use when the user asks to merge work into main and remove the leftover worktrees and branches."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer2"
---

# Clean up worktrees and branches

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 2 (Orca) lists the worktrees; the owner confirms every deletion. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0 lists; T2 checks unmerged work before anything is deleted. See [model-routing.md](references/model-routing.md).

1. List all worktrees and local and remote branches, with their last commit and whether each is merged into main.
2. Merge the work that should land in main through `reconcile-branches`, which plans and rehearses the order before anything lands. Do not merge anything that is not reviewed.
3. Show the user the list of branches and worktrees to delete, split into merged and unmerged.
4. Show the concrete delete list. If the request already authorized deleting the merged ones in this session, use that scope without asking again; otherwise confirm that batch first. Ask about each unmerged one separately; never delete it on your own.
5. Remove the worktree folders with `git worktree remove`, then prune.

## Report

Merged, deleted, kept, and the reason for each kept item.
