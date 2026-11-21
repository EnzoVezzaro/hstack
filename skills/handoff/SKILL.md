---
name: handoff
description: "Use when the user asks to pass a task, branch, or chat to another agent. Writes a self-contained brief so the next agent can continue without the original context."
---

# Hand off to another agent

This skill extends the **W3 Coordinar agentes** workflow.

## HStack V5 role

Layer 2 (Orca) routes the brief; Layer 3 defines the definition of done. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 writes the brief from the record; T2 reviews it when the next agent works on something risky. See [model-routing.md](../../docs/model-routing.md).

0. If the repo has `.acc/`, pull focused context with `acc-context` first.
1. Summarize the goal, the current state, and what is verified versus claimed.
2. List the files, branch, worktree, and commands the next agent needs.
3. State the exact next step and the definition of done.
4. Name what must not be changed and what needs the user's decision.
5. Save the brief where the receiving agent can read it.

## Report

The brief, its location, and the agent or session it was sent to.
