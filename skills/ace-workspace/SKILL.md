---
name: ace-workspace
description: "Use when the user asks to set up a crew workspace with a governor, supervisors, and workers across several projects, or mentions ACE."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer2"
---

# Crew workspace with ACE

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## Purpose

Uses [ACE](https://github.com/EnzoVezzaro/ace-proagents), which writes a crew arrangement down as data: terminal spaces, one browser space per project, a governor over a worker budget, and one supervisor with workers per project.

## HStack V5 role

Layer 2 (Orca) hosts the sessions; Layer 3 sets the goal and the budget; Layer 4 workers run inside the workspace at T0 or T1.

**Model tier:** T2 sets goal and budget; workers at T0 or T1. See [model-routing.md](references/model-routing.md).

1. Run `npx ace-proagents@latest inspect --json` in the repo and answer the intake from that evidence, not from guesses.
2. Agree the goal, the measurable outcome, and the projects with the user.
3. Preview: `npx ace-proagents@latest setup --goal "<goal>" --outcome "<outcome>" --projects <a>,<b> --dry-run --json`.
4. Show the plan. Run the same command without `--dry-run` only after the user confirms.
5. Drive the crew with `ace govern`, `ace task`, and `ace handoff`. Set the worker budget from the tiers in [model-routing.md](references/model-routing.md).

## Report

Goal, outcome, projects, budget, what was installed, and the first tasks dispatched.
