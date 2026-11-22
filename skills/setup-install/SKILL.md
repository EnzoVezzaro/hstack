---
name: setup-install
description: "Use when the user asks to install dependencies, set up a project, or initialize a repo."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Install and configure

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 installs and configures; no paid model needed for routine setup. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](references/model-routing.md).

1. Check prerequisites and versions.
2. Install the declared dependencies from the lockfile.
3. Configure the environment from `.env.example`. Never write secret values into tracked files or chat.
4. Initialize the project and verify with its start command or test.

## Report

What was installed, what was configured, and how it was verified. List any missing secret by name, not by value.
