---
name: reconcile-branches
description: "Use when the user types /reconcile-branches, or before merging several worktrees and branches into main. Inventories every branch and worktree, tests each merge without touching any working tree, plans the merge order, rehearses it on an integration branch with tests after each step, and merges into main only after the owner approves the plan."
---

# Reconcile branches

Get every branch and worktree to a known state, then land the ones that are ready in an order that works. This is the engine behind `cleanup-orca` and `cleanup-worktrees-branches`.

## HStack V5 role

Layer 4 inventories and rehearses; Layer 3 decides conflicts and the merge order; the owner approves the merge into main.

**Model tier:** T1 for the inventory and the rehearsal; T2 for conflict decisions and the final plan. See [model-routing.md](../../docs/model-routing.md).

1. **Inventory.** Run `git fetch --all --prune`, then collect, for every local and remote branch:
   - its worktree, if any (`git worktree list --porcelain`), and whether that worktree has uncommitted changes (`git -C <path> status --porcelain`);
   - commits ahead and behind main (`git rev-list --left-right --count main...<branch>`) and its unique commits (`git log --oneline main..<branch>`);
   - the files it touches (`git diff --name-only main...<branch>`) and its last commit date;
   - its open PR and check status (`gh pr list --state open --json number,headRefName,mergeable,statusCheckRollup`);
   - its Orca workspace and agent state, when Orca is running (`orca worktree ps --json`).
2. **Classify each branch:**
   - **merged:** already in main (`git merge-base --is-ancestor <branch> main`). Nothing to land.
   - **empty:** no unique commits and a clean tree. Nothing to land.
   - **ready:** unique commits, clean tree, checks green, merges cleanly.
   - **needs rebase:** clean but conflicts with main or with another ready branch.
   - **work in progress:** uncommitted changes, or an agent still working on it. Leave it alone.
   - **unclear:** none of the above. Ask the owner.
3. **Test merges without touching a working tree.** For each ready or needs-rebase branch, run `git merge-tree --write-tree --name-only main <branch>`; a non-zero exit means conflicts, and the output names the files. Check pairs of branches that touch the same files.
4. **Plan the order:** independent and green branches first, smallest first; a branch that builds on another goes after it; branches that overlap go one at a time, each rebased on the result of the last.
5. **Rehearse.** In a separate temporary worktree, create `reconcile/<date>` from main and merge the branches in plan order. Run the tests after each merge. Hand a failure to `verify-and-fix`. A conflict that needs a judgment call goes to T2 with both sides shown.
6. **Show the plan:** a table of branch, state, action, and rehearsal result, plus the conflicts and their resolutions.
7. **Land it after the owner says yes:** fast-forward main to the rehearsed branch, or merge the PRs in plan order with `gh pr merge`, and push.
8. Hand the merged and empty branches and worktrees to `cleanup-worktrees-branches`, or to `cleanup-orca` for Orca workspaces. Remove the temporary worktree.

Never force-push main, never delete a branch with unique unmerged commits, and never discard uncommitted work.

## Report

The branch table (state, action, result), what landed on main with commit SHAs, what is waiting on the owner, and what was left alone and why.
