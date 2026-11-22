---
name: cleanup-orca
description: "Use when the user types /cleanup-orca or says to clean up the Orca space: merge what can be merged, close as much as possible, and remove leftover worktrees, branches, terminals, and finished agents. Snapshots everything first, merges through reconcile-branches, and removes nothing that holds unmerged work."
---

# Clean up Orca

"Let's clean up, merge what you can, and close as much as possible." The goal is an Orca sidebar that only shows work that is still alive.

## HStack V5 role

Layer 2 (Orca) is the source of truth for workspaces and agents; Layer 4 does the sweep; Layer 3 decides merges; the owner approves one batch of merges and removals.

**Model tier:** T0 for the inventory and the closing work; T2 for merge decisions through `reconcile-branches`. See [model-routing.md](../../docs/model-routing.md).

1. **Snapshot first.** Save the output of these to a dated report before changing anything:
   - `orca status --json` and `orca repo list --json`;
   - `orca worktree ps --json` (every workspace, folder workspaces included, with agents);
   - `orca worktree list --repo id:<repoId> --json` for each repo;
   - `orca agent list --json`;
   - `orca workspace cleanup preview --json`, which shows what the owner's own cleanup rules would remove.
2. **Sort every workspace** into one of these groups, using git as well as Orca:
   - **merged or empty:** branch already in main or no unique commits, clean tree, no working agent;
   - **ready to merge:** unique commits, clean tree;
   - **alive:** an agent is working, or the tree has uncommitted changes;
   - **unclear:** anything else.
3. **Capture loose ends.** For each finished agent in a workspace that will close, read its last turn with `orca agent read <id> --json`. Anything unfinished goes into a `handoff` brief.
4. **Merge what can be merged.** Run `reconcile-branches` on the ready group. It rehearses and asks the owner before anything lands on main.
5. **Close and remove,** after one batch approval:
   - stop terminals in workspaces that are done: `orca terminal close --worktree <selector> --all --json`;
   - remove merged or empty workspaces: `orca worktree rm --worktree id:<repoId>::<path> --json`. Use `--force` only after git confirms nothing unique would be lost;
   - delete their merged local branches with `git branch -d` (never `-D`), and remote branches only with the owner's yes;
   - mark the workspaces that stay with `orca worktree set --worktree <selector> --workspace-status <status> --json`, so the sidebar tells the truth.
6. Run `orca workspace cleanup run --json` only when the owner asks to apply their saved cleanup rules.
7. Leave alive and unclear workspaces alone, and list them with the reason.

## Report

Counts before and after, then: merged (with SHAs), removed, terminals closed, handoffs written, kept with reasons, and anything waiting on the owner. Include where the snapshot was saved.
