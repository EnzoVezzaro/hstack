---
name: acc-context
description: "Use when a repo has AGENTS.md plus a .acc/ folder, when the user asks to install, init, check, or update ACC (Agent Code Context), or before an agent starts work in an unfamiliar codebase. Pulls focused, provenance-tagged context with the acc CLI instead of rediscovering the architecture."
---

# ACC context

Uses [ACC](https://github.com/EnzoVezzaro/agents-code-context), the convention that makes a repo explain itself to agents through `AGENTS.md` and `.acc/`.

## HStack V5 role

Layer 4 runs the CLI at T0; Layer 3 decides what goes into durable memory. ACC context keeps briefs small, so cheaper workers can handle the task.

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. If the repo has no ACC yet and the user wants it: `npm install -g acc-code-context`, then `acc engine --init-context` (or `acc init --scan` for a manual start). Show the user what was created before committing.
2. Before working on an area, get its context: `acc context <path> --depth 1`. Add `--include memory` to see what earlier agents recorded.
3. Use `acc graph <path>` to see topology and drift, and `acc graph --format mermaid` for a diagram.
4. After a change, run `acc check` and fix any `ACC0xx` diagnostic the change introduced.
5. When you learn something the next agent needs, record it: `acc memory add <path> "<fact>"`. Only durable facts, not progress notes.

ACC is a work in progress. If a command fails, fall back to reading `AGENTS.md` directly and say so.

## Report

Context used, diagnostics before and after, and any memory entries added.
