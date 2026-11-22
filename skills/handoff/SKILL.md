---
name: handoff
description: "Use when the user asks to pass a task, branch, or chat to another agent. Writes a self-contained brief so the next agent can continue without the original context."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer2]
---

# Hand off to another agent

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to pass a task, branch, or chat to another agent.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/handoff <project>` — name the target project and keep the work bounded.

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
