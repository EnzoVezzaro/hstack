---
name: research-explain
description: "Use when the user asks to research a library, repository, or market, or asks why a component works the way it does."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Research and explain

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to research a library, repository, or market, or asks why a component works the way it does.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/research-explain <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 gathers evidence; Layer 3 decides on the recommendation. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 gathers sources; T2 makes the recommendation. See [model-routing.md](../../docs/model-routing.md).

1. State the question in one sentence.
2. Search the web and GitHub (for example `gh search repos` and `gh search code`). Compare the top candidates on fit, activity, license, and maintenance.
3. Read the source, not only the README, for anything you recommend.
4. Explain the mechanism. Separate what is verified from what is inferred.
5. Make a recommendation with the main unknowns.

## Report

Question, candidates compared, recommendation, evidence with links, and unknowns. Make no code changes.
