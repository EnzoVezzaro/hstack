---
name: setup-install
description: "Use when the user asks to install dependencies, set up a project, or initialize a repo. Installs from the lockfile and configures the environment without exposing secrets."
---

# Install and configure

This skill covers the **W8 Instalar y configurar** workflow.

## HStack V5 role

Layer 4 installs and configures; no paid model needed for routine setup. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. Check prerequisites and versions.
2. Install the declared dependencies from the lockfile.
3. Configure the environment from `.env.example`. Never write secret values into tracked files or chat.
4. Initialize the project and verify with its start command or test.

## Report

What was installed, what was configured, and how it was verified. List any missing secret by name, not by value.
