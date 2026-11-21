---
name: wrap-day
description: "Retro end-of-shift logbook. Use when Enzo says /wrap-day or asks for an end-of-day summary. Reconciles current Orca project status, what was completed today, what remains active or blocked, and the next action for tomorrow."
---

# Wrap day · end-of-shift logbook

## HStack V5 role

Layer 1 (assistant) closes the day with verified progress and the next step. See [hstack-v5.md](../../docs/hstack-v5.md).

Codex is the personal assistant. Check Orca and the local worktree; a planned task is not a completed task.

## Reconcile the shift

1. Resolve today's local date and timezone.
2. Inspect current Orca project, agent, and worktree states plus today's session activity.
3. For each project, separate verified completion, agent-reported completion, active work, waiting work, and explicit blockers.
4. Confirm source changes or acceptance checks when available. If a project has not reported, label its state unknown rather than complete.
5. Capture the next stated step and its live owner. Note decisions Enzo needs to make without turning them into new assignments.

## Report

A concise project table: **Done today**, **Still active / blocked**, **Evidence**, **Next tomorrow**. End with decisions awaiting Enzo, if any. Do not close sessions, stop workers, commit, merge, publish, or deploy unless separately asked.
