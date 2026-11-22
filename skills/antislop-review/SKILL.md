---
name: antislop-review
description: "Use when the user asks to check a UI, copy, or code for generic AI-generated patterns."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Antislop review

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to check a UI, copy, or code for generic AI-generated patterns.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/antislop-review <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 applies the rules; Layer 3 decides on the requested exceptions. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. Load the `antislop` core rules. Then load the matching part: `antislop-ui` for interfaces, `antislop-copywriting` for text, `antislop-code` for code comments, `antislop-human` for accessibility, `antislop-layoutmobile` for responsive layouts.
2. Scan the artifact against those rules. Note each hit with its location.
3. Keep anything the user asked for explicitly, even if it matches a pattern. The user's words win.
4. Fix the hits that are not requested. Keep the change set small.
5. Recheck the changed parts.

## Report

Each hit with location and rule, what was fixed, and what was kept on purpose.
