---
name: run-local
description: "Use when the user asks to run the app locally or open localhost to see it. Starts the project, checks the main path, and reports the URL. Not for unrelated work."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Run and test locally

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to run the app locally or open localhost to see it.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/run-local <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 starts the project; Layer 5 (Ego Lite) can take over the browser check. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. Use the project's documented start command. Do not guess one.
2. Wait until the server answers. Then open the URL in the browser (`ego-browser` or the built-in browser).
3. Check the main path and the console for errors.
4. Take a screenshot when the question is visual.
5. Stop the server only if this run started it.

## Report

URL, what was checked, console errors if any, and the screenshot path if taken.
