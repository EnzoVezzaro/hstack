---
name: security-backend
description: "Use when the user asks to review auth, permissions, API endpoints, database migrations, infrastructure, or exposed keys."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer3"
---

# Security, data and backend

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 3 reviews, because findings need judgment; the owner approves any destructive change. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T3 for auth and secrets, T2 otherwise. Never T0 alone. See [model-routing.md](references/model-routing.md).

1. Review auth, permissions, and input validation on every changed endpoint.
2. Check that no secret is in code, logs, or chat. If one was exposed, say so and recommend rotation.
3. Review database migrations before they run. Confirm a backup exists for destructive changes.
4. Check rate limits and error messages for data leaks.
5. Run the project's security checks if any exist.

## Report

Findings ranked by severity, each with file, line, and fix. Make no destructive database or infrastructure change without explicit approval.
