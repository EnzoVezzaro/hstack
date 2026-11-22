---
name: docs-content
description: "Use when the user asks to update the README, docs, product data, affiliate links, or marketing copy."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Docs, content and products

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to update the README, docs, product data, affiliate links, or marketing copy.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/docs-content <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 drafts and edits; Layer 1 checks facts with the owner before anything is published. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. Read the current README, docs, or product data first.
2. Update only what changed. Keep the existing structure and tone.
3. Verify every fact, price, and link. Open affiliate and product links before publishing them.
4. For marketing copy, use `copywriting` or `copy-editing` from [marketingskills](https://github.com/coreyhaines31/marketingskills) when installed, then the `antislop-copywriting` rules.

## Report

What changed, which facts or links were verified, and which were not.
