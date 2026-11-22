---
name: wrap-day
description: "End-of-day reconciliation of active work. Use when the owner says /wrap-day or asks for an end-of-day summary."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer1]
---

# Wrap day — verified progress and handoff

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

End-of-day reconciliation of active work.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/wrap-day` — name the target project and keep the work bounded.

## HStack V5 role

Layer 1 (assistant) closes the day with verified progress and the next step. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

Codex is the personal assistant. Check Orca and the local worktree; a planned task is not a completed task.

## Reconcile the shift

1. Resolve today's local date and timezone.
2. Inspect current Orca project, agent, and worktree states plus today's session activity.
3. For each project, separate verified completion, agent-reported completion, active work, waiting work, and explicit blockers.
4. Confirm source changes or acceptance checks when available. If a project has not reported, label its state unknown rather than complete.
5. Capture the next stated step and its live owner. Note decisions the owner needs to make without turning them into new assignments.

## Report

A concise project table: **Done today**, **Still active / blocked**, **Evidence**, **Next tomorrow**. End with decisions awaiting the owner, if any. Do not close sessions, stop workers, commit, merge, publish, or deploy unless separately asked.
