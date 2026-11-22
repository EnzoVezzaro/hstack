---
name: puff-puff-pass
description: "Use when the user types /puff-puff-pass or wants a feature implemented cheaply and then reviewed by a more powerful model."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Puff, puff, pass: build cheap, review strong

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user types /puff-puff-pass or wants a feature implemented cheaply and then reviewed by a more powerful model.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/puff-puff-pass <project>` — name the target project and keep the work bounded.

The V5 rule in one command: a cheap model writes the change, an expensive model only reads it.

## HStack V5 role

Layer 4 worker implements; Layer 3 director reviews; the worker fixes; the director signs off.

**Model tier:** implementation at T0 or T1; review at T2, or T3 for security-sensitive or architectural changes. The reviewer must be a different model from the implementer. See [model-routing.md](../../docs/model-routing.md).

1. Write the acceptance check first, as in `implement-feature`: a test or an observable behavior.
2. **Puff:** a T0 or T1 worker implements the smallest change that passes the check, runs it, and records the result.
3. **Puff again:** the worker reruns the full suite and writes a short note: what changed, why, and what it is unsure about.
4. **Pass:** send the diff, the note, and the acceptance check to a stronger, different model for review with `patch-patrol`. The reviewer reports findings it can show (a failing case, a line, a risk); it does not rewrite the code.
5. The worker fixes each finding. Findings the worker disputes go back to the reviewer with evidence.
6. The reviewer checks the fixes once more. Stop after two review rounds; if findings remain, escalate one tier or ask the user.
7. Nothing is merged or pushed here; hand the approved change to `publish-git`.

## Report

What was built and by which model, the review findings and how each was resolved, the reviewer's model, and the final check result.
