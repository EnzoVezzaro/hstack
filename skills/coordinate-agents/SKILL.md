---
name: coordinate-agents
description: "Use when the user asks to supervise, dispatch, or check work done by several agents. Finds live agents with relay-room, assigns bounded tasks, and verifies results against evidence."
---

# Coordinate agents

This skill covers the **W3 Coordinar agentes** workflow.

## HStack V5 role

Layer 2 (Orca) routes the tasks; Layer 3 decides what to dispatch and accepts results. See [hstack-v5.md](../../docs/hstack-v5.md).

1. Find the live Orca projects, owners, and agents with `relay-room`.
2. For each task, give one owner, a bounded scope, and a definition of done.
3. Do not assign the same work twice. Check the queue before dispatching.
4. Accept an agent's report only when there is evidence: a diff, a passing check, or a visible result. Send unverified reports to `verify-and-fix`.
5. Send the next task to each agent when its current one is verified.

## Report

A table: project, agent, task, status, evidence, next step. Do not publish or merge; use `publish-git` for that, and only when asked.
