---
name: ace-workspace
description: "Use when the user asks to set up a crew workspace with a governor, supervisors, and workers across several projects, or mentions ACE."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer2]
---

# Crew workspace with ACE

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to set up a crew workspace with a governor, supervisors, and workers across several projects, or mentions ACE.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/ace-workspace <project>` — name the target project and keep the work bounded.

Uses [ACE](https://github.com/EnzoVezzaro/ace-proagents), which writes a crew arrangement down as data: terminal spaces, one browser space per project, a governor over a worker budget, and one supervisor with workers per project.

## HStack V5 role

Layer 2 (Orca) hosts the sessions; Layer 3 sets the goal and the budget; Layer 4 workers run inside the workspace at T0 or T1.

**Model tier:** T2 sets goal and budget; workers at T0 or T1. See [model-routing.md](../../docs/model-routing.md).

1. Run `npx ace-proagents@latest inspect --json` in the repo and answer the intake from that evidence, not from guesses.
2. Agree the goal, the measurable outcome, and the projects with the user.
3. Preview: `npx ace-proagents@latest setup --goal "<goal>" --outcome "<outcome>" --projects <a>,<b> --dry-run --json`.
4. Show the plan. Run the same command without `--dry-run` only after the user confirms.
5. Drive the crew with `ace govern`, `ace task`, and `ace handoff`. Set the worker budget from the tiers in [model-routing.md](../../docs/model-routing.md).

## Report

Goal, outcome, projects, budget, what was installed, and the first tasks dispatched.
