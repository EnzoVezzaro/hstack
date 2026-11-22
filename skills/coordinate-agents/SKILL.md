---
name: coordinate-agents
description: "Use when the user asks to supervise, dispatch, or check work done by several agents. Finds live agents with relay-room, assigns bounded tasks, and verifies results against evidence."
---

# Coordinate agents

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## HStack V5 role

Layer 2 (Orca) routes the tasks; Layer 3 decides what to dispatch and accepts results. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T2 dispatches and accepts; workers start at T0 and move up only by the escalation rules. See [model-routing.md](../../docs/model-routing.md).

1. Find the live Orca projects, owners, and agents with `relay-room`.
2. For each task, give one owner, a bounded scope, and a definition of done.
3. Do not assign the same work twice. Check the queue before dispatching.
4. Pick each worker's tier with [model-routing.md](../../docs/model-routing.md): start at T0, move up one tier after two failed verifications or for architecture, security, money, or deletion, and hand execution back down once a higher tier has written the plan. Note every escalation in the report.
5. For specialist work, equip the worker with `proagent-equip` before moving it up a tier. For a new multi-project crew, set up the workspace with `ace-workspace`.
6. Accept an agent's report only when there is evidence: a diff, a passing check, or a visible result. Send unverified reports to `verify-and-fix`.
7. Send the next task to each agent when its current one is verified.

## Report

A table: project, agent, task, status, evidence, next step. Do not publish or merge; use `publish-git` for that, and only when asked.
