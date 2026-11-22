---
name: wrap-day
description: "End-of-day reconciliation of active work. Use when the owner says /wrap-day or asks for an end-of-day summary."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer1"
---

# Wrap day — verified progress and handoff

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## Purpose

End-of-day reconciliation of active work.

## HStack V5 role

Layer 1 (assistant) closes the day with verified progress and the next step. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](references/model-routing.md).

Codex is the personal assistant. Check Orca and the local worktree; a planned task is not a completed task.

## Reconcile the shift

1. Resolve today's local date and timezone.
2. Inspect current Orca project, agent, and worktree states plus today's session activity.
3. For each project, separate verified completion, agent-reported completion, active work, waiting work, and explicit blockers.
4. Confirm source changes or acceptance checks when available. If a project has not reported, label its state unknown rather than complete.
5. Capture the next stated step and its live owner. Note decisions the owner needs to make without turning them into new assignments.

## Report

A concise project table: **Done today**, **Still active / blocked**, **Evidence**, **Next tomorrow**. End with decisions awaiting the owner, if any. Do not close sessions, stop workers, commit, merge, publish, or deploy unless separately asked.
