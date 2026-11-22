---
name: security-backend
description: "Use when the user asks to review auth, permissions, API endpoints, database migrations, infrastructure, or exposed keys."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer3]
---

# Security, data and backend

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to review auth, permissions, API endpoints, database migrations, infrastructure, or exposed keys.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/security-backend <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 3 reviews, because findings need judgment; the owner approves any destructive change. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T3 for auth and secrets, T2 otherwise. Never T0 alone. See [model-routing.md](../../docs/model-routing.md).

1. Review auth, permissions, and input validation on every changed endpoint.
2. Check that no secret is in code, logs, or chat. If one was exposed, say so and recommend rotation.
3. Review database migrations before they run. Confirm a backup exists for destructive changes.
4. Check rate limits and error messages for data leaks.
5. Run the project's security checks if any exist.

## Report

Findings ranked by severity, each with file, line, and fix. Make no destructive database or infrastructure change without explicit approval.
