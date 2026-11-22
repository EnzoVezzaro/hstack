---
name: proagent-equip
description: "Use when the user asks to equip an agent with a professional profile, run proagent. Gives the worker a ProAgents profile so a cheaper model works like a specialist."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer3]
---

# Equip a worker with ProAgents

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to equip an agent with a professional profile, run proagent.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/proagent-equip <project>` — name the target project and keep the work bounded.

Uses [ProAgents](https://github.com/EnzoVezzaro/proagents), which gives an existing coding agent a profession: expertise, methods, rules, tools, and verification practices.

## HStack V5 role

Layer 3 picks the profile; Layer 4 runs equipped at T0 or T1. A good profile is often cheaper than escalating to a bigger model; try it before moving up a tier.

**Model tier:** T2 picks the profile; the equipped worker runs at T0 or T1. See [model-routing.md](../../docs/model-routing.md).

1. Install if missing: `npm install -g @reposell/proagent`.
2. Run `proagent detect` to see which harness is present, and `proagent list` for available profiles.
3. Pick the profile that matches the task, for example `security-engineer`, `staff-engineer`, or `developer-experience-engineer`. Combine two when needed: `proagent equip staff-engineer security-engineer`.
4. Check it with `proagent inspect <profile>` and `proagent validate`.
5. Equip the worker: `proagent equip <profile>`, or `proagent compile <profile> --target claude-code` for a specific harness.
6. Dispatch the task as usual. The verifier is still a different agent.

## Report

Profile used, harness, validation result, and the worker it was given to.
