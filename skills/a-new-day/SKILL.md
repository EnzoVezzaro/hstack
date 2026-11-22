---
name: a-new-day
description: "Morning briefing workflow. Use when the owner says /a-new-day, asks for a morning project brief, or wants to resume the day across projects. Checks live Orca projects, yesterday's completed work, current state, and today's next steps."
---

# A new day — evidence-based morning brief

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## HStack V5 role

Layer 1 (assistant) opens the day from live state; the owner decides the priorities. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. Escalate to T2 only for a priority conflict the owner must decide. See [model-routing.md](../../docs/model-routing.md).

Codex is the personal assistant in this routine. Live Orca state comes first; chat history is context, not current status.

## Gather

1. Resolve today's date and local timezone. Use Orca's repo, worktree, and agent listings to identify current project work.
2. For each active or recently active project, inspect the newest director or supervisor report and current agent states. Use the session index for the previous local calendar day only; do not mix old sessions into yesterday's work.
3. Extract completed work, active work, explicit blockers, and the next stated action. Confirm important claims against the current worktree or source state when available.
4. Mark stale sessions and agent-reported outcomes as stale or reported until current evidence confirms them.

## Present

A compact project-by-project brief:

- **Yesterday:** completed work and evidence.
- **Now:** live agent and worktree state.
- **Next today:** the stated next step and its owner.
- **Needs the owner:** only decisions or approvals genuinely waiting.

End with a short proposed focus order. Do not create tasks, send instructions, merge, publish, deploy, or change priorities without an explicit request.
