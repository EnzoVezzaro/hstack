---
name: horizon-loop-ego-lite
description: "Use when this H Stack workflow applies. Runs the flows in the browser, fixes what breaks, and reruns."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer5]
---

# Horizon loop in Ego Lite

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when this H Stack workflow applies.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/horizon-loop-ego-lite <project>` — name the target project and keep the work bounded.

A `horizon-loop` where the metric is real user flows passing in the browser.

## HStack V5 role

Layer 5 (Ego Lite) runs the flows; Layer 4 fixes failures; Layer 3 judges unclear ones.

**Model tier:** T0 drives the browser; fixes start at T1; escalate one tier after two failed fixes of the same flow. See [model-routing.md](../../docs/model-routing.md).

1. Agree the flows (for example signup, checkout, settings), the viewports, and the goal: each flow passing N times in a row.
2. Make sure the app is running (`run-local`) and load the `ego-browser` skill.
3. Each iteration: run every flow in Ego Lite as a person would, take a screenshot at each failure, and log pass or fail per flow.
4. Hand each failure to `verify-and-fix` with the exact steps and screenshot. Rerun only the fixed flow, then all flows.
5. Reset the pass streak of a flow whenever it fails.
6. Stop when every flow reaches the streak, on the iteration limit, or after three iterations with no progress.

## Report

Flows with their pass streaks, failures fixed with their causes, flows still failing with screenshots.
