---
name: humanize
description: "Use when the user asks to make text sound human, to remove AI writing patterns, or to review prose before publishing."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Humanize text

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to make text sound human, to remove AI writing patterns, or to review prose before publishing.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/humanize <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 rewrites with the free model; the owner approves the final text. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. Escalate to T2 for launch copy or anything legal. See [model-routing.md](../../docs/model-routing.md).

1. Load the `humanizer` skill and follow its rules. Where it is not installed, use the rules in `antislop-copywriting`.
For marketing copy, also apply `copy-editing` from [marketingskills](https://github.com/coreyhaines31/marketingskills) if it is installed.
2. Keep every fact, number, name, and link. Do not add claims.
3. Remove the patterns it lists, strongest first: contrast staging, dashes everywhere, forced triads, inflated claims, stock words, and bold labels.
4. Read the result once as the intended reader. Cut any sentence that adds nothing.

## Report

The rewritten text, a short list of the patterns removed, and any claim you could not verify and left unchanged.
