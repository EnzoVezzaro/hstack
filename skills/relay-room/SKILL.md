---
name: relay-room
description: "Use /relay-room when work belongs to an existing Orca project, the current director needs a concise brief, or a bounded handoff must be delivered to a live team. Resolve the real project and active session before sending; verify delivery without treating it as completion."
---

# Relay room — brief the live Orca project

**Purpose:** Route a concrete `<project>` task to its **existing** Orca director, or produce a handoff ready for that director when there is no accessible live session. This is project coordination, not a game, simulated room, new agent persona, or replacement for Orca.

Follow the [HStack skill execution contract](../../docs/skill-contract.md), [HStack V5 roles](../../docs/hstack-v5.md) and [model routing](../../docs/model-routing.md). Layer 1 receives the request; Layer 2 discovers/routes through Orca; Layer 3 decides and accepts; Layer 4 executes. A T0 agent can collect status, a T2 director owns substantive decisions, and workers should use the cheapest capable tier.

## Trigger and inputs

Use when the task names a live Orca project, a director needs a short clear brief, or the user explicitly requests a handoff. Inputs: target `<project>`, desired result, current branch/worktree if known, constraints, and requested action. Keep the brief brief; do **not** start a new team for a small local task.

## 1. Establish the authoritative target

1. Resolve `<project>` to the exact repository, current branch, worktree and baseline revision. Read the project instructions and relevant code/docs; note unrelated pending changes.
2. Confirm the Orca connection or installed CLI exists. Inspect **available** status/session/project commands instead of assuming a particular command syntax or plugin is present.
3. From **live Orca state**, find the corresponding project, active director/supervisor, session identifier, running status, current owner/task, and latest report. Treat an old terminal label, a document, a previous chat or an agent name as unverified.
4. Check whether the same task is already assigned or in progress. If target, identity or ownership is uncertain, do not dispatch into a guessed session.

## 2. Pick one route

- **Active director / owned task:** send the brief to the **same session** by a supported Orca message/dispatch mechanism; do not open a duplicate director.
- **No director active, but project is known:** follow the project's documented activation policy **only if** the user has authorized starting a session and the relevant tool is available; otherwise prepare an unsent handoff.
- **Orca missing, unavailable or no matching session:** output the exact handoff text and destination requirements marked **NOT SENT**. Do not invent a successful delivery or a running agent.
- **Small work with no requested handoff:** route to the appropriate project skill locally instead.

## 3. Deliver a director-ready brief

Keep a single concise message with:

- **Goal:** observable result and why it matters
- **Target:** `<project>`, repo, branch, worktree, baseline SHA, current session/owner if verified
- **Scope:** permitted files/systems and explicit exclusions; preserve unrelated edits
- **Execution:** one owner per bounded task, dependencies, budget/tier limits, tools actually available
- **Acceptance:** tests/probes and independent evidence required on the integrated revision
- **Authority:** actions already approved vs actions requiring a human decision (especially push, merge, deploy, release and deletion)
- **Return:** report location, stop condition, blockers and requested next acknowledgement

Use actual context, not placeholder facts. If a field is unknown, label it unknown rather than filling it in.

## 4. Acknowledge, do not overclaim

1. Use the supported Orca delivery action, then capture the actual message/session receipt if returned.
2. Record separately: **brief prepared**, **delivery acknowledged**, **director accepted**, **work completed**, and **independently verified**. These are not interchangeable.
3. The director sets priorities and acceptance; supervisors own integration; workers implement non-overlapping scopes.
4. Review the **combined** change and rerun the acceptance path at the integrated revision before describing the task as done. Use [coordinate-agents](../coordinate-agents/SKILL.md) for multi-worker tracking and [handoff](../handoff/SKILL.md) when the receiver must continue later.

## Report

State project/revision, actual receiving session or **NOT SENT**, brief summary, proof of delivery, owner, verified progress (if any), blockers, and the next decision. Never claim a worker finished merely because Orca accepted the brief.
