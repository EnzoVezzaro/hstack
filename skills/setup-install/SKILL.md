---
name: setup-install
description: "Use when the user asks to install dependencies, set up a project, or initialize a repo."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Install and configure

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to install dependencies, set up a project, or initialize a repo.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/setup-install <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 installs and configures; no paid model needed for routine setup. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. Check prerequisites and versions.
2. Install the declared dependencies from the lockfile.
3. Configure the environment from `.env.example`. Never write secret values into tracked files or chat.
4. Initialize the project and verify with its start command or test.

## Report

What was installed, what was configured, and how it was verified. List any missing secret by name, not by value.
