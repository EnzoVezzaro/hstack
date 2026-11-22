---
name: pineapple-express
description: "Use when the user types /pineapple-express or wants to wrap everything up and go home: close every task that can be closed now, park the rest with a clear handoff, stop leftover processes, and leave a short summary. Nothing outward-facing happens without one batch approval."
---

# Pineapple Express: close it all and go home

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

The end-of-day sweep. Finish what is nearly finished, park what is not, and leave nothing running that should not be.

## HStack V5 role

Layer 2 (Orca) lists sessions, agents, and worktrees; Layer 4 workers close tasks; the owner approves one batch of outward-facing actions.

**Model tier:** T0 for the sweep and the closing work; T2 only to judge whether a task is really done. See [model-routing.md](../../docs/model-routing.md).

1. List everything open: Orca sessions and agents, worktrees and branches, open PRs, todo lists, running dev servers and background jobs, active `horizon` schedules.
2. Sort each item into one of three groups:
   - **close now:** done and verified, or one small step from done;
   - **park:** real work left; it gets a `handoff` brief;
   - **needs the owner:** a decision, a merge, a deploy, a purchase.
3. Close the "close now" group: finish the small step, verify it, commit to the work branch (never directly to `main`), and mark the task done.
4. Park the rest: write a `handoff` brief for each, so tomorrow starts cold without guessing.
5. Stop dev servers, watchers, and background jobs that this session or its agents started. Leave alone anything the user started.
6. Show one list of outward-facing actions waiting for approval (push, merge, close PRs, pause schedules). Do them only after one yes; skip the rest.
7. For a deeper sweep, run `cleanup-orca` for workspaces and `cleanup-chats` for conversations.
8. Finish with `wrap-day` so the day's summary is on record.

## Report

Closed, parked (with brief locations), approved and done, still waiting on the owner, and processes stopped.
