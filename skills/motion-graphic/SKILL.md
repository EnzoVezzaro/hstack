---
name: motion-graphic
description: "Use when the user asks for a motion graphic, animated explainer, title card, or short video made with code."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Motion graphics

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks for a motion graphic, animated explainer, title card, or short video made with code.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/motion-graphic <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 builds the composition; Layer 1 confirms the message and format with the owner. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T1 builds; T2 checks the message. See [model-routing.md](../../docs/model-routing.md).

1. Define the message, duration, aspect ratio, and the output file. Ask once if any is missing.
2. Load `hyperframes` for the workflow, then `hyperframes-core` for the composition contract and `hyperframes-animation` for motion.
3. Use `hyperframes-registry` before building a named effect by hand.
4. Add audio only if the user asks, using `media-use` and `hyperframes-audio`.
5. Preview, check the frames at key moments, then render.

## Report

Output file path, duration, aspect ratio, render command used, and the frames checked.
