---
name: ui-design
description: "Use when the user asks to design or adjust a UI, landing page, styles, or logo. Inspects the real screen at desktop and phone widths before and after changes."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer3]
---

# Design UI and landing

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to design or adjust a UI, landing page, styles, or logo.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/ui-design <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 3 sets the direction; Layer 4 implements; Layer 5 checks the real screen. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T2 sets direction; T0 or T1 implements. See [model-routing.md](../../docs/model-routing.md).

1. Inspect the actual screen at desktop and phone widths with `interface-check`.
2. Use the project's existing tokens and components. Do not invent new ones.
3. Check contrast, focus states, and responsive layout.
4. Make logos or images only when asked.
5. Apply the `antislop-ui` rules, then confirm the result with a fresh screenshot.

## Report

Before and after screenshots, the issues found, what was changed, and what still looks off.
