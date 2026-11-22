---
name: product-hunt-launch
description: "Use when the user asks to prepare or publish a product on Product Hunt. Prepares the listing, assets, and first comment, and posts only after explicit approval."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer3]
---

# Product Hunt launch

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to prepare or publish a product on Product Hunt.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/product-hunt-launch <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 3 drafts the listing; the owner approves before anything is posted. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 drafts; T2 edits; the owner approves. See [model-routing.md](../../docs/model-routing.md).

1. Read the product's README, landing page, and current status. Note what is real today and what is planned.
2. Draft the tagline (under 60 characters), description, first comment, maker intro, and gallery list. Write them with `copywriting` from [marketingskills](https://github.com/coreyhaines31/marketingskills) if it is installed, then apply `antislop-copywriting` and `humanize`.
3. Check the assets: logo, thumbnail, screenshots at the required sizes. Create missing ones with `motion-graphic` or `ui-design` only if asked.
4. Verify every link and claim. Remove any claim that cannot be shown.
5. Show the full draft to the user. Post or schedule only after explicit approval, since it is public.

## Report

The draft listing, the asset checklist with gaps, the claims that were verified, and what still needs the user's decision.
