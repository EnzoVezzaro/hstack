---
name: horizon-loop-ego-lite
description: "Use when the user types /horizon-loop-ego-lite or wants real user flows run in Ego Lite over and over until they pass cleanly N times in a row. Runs the flows in the browser, fixes what breaks, and reruns."
---

# Horizon loop in Ego Lite

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
