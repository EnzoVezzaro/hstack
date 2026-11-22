---
name: plan-horizon
description: "Time-horizon planning from verified state. Use for /plan-day, /plan-week, /plan-month, or when the owner asks to plan a time horizon."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer1]
---

# Plan horizon — evidence-based project plan

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Time-horizon planning from verified state.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/plan-horizon` — name the target project and keep the work bounded.

## HStack V5 role

Layer 1 (assistant) turns priorities into a feasible plan; the owner approves it. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T2 drafts the plan; T0 gathers the facts first. See [model-routing.md](../../docs/model-routing.md).

Codex is the personal assistant for planning. The horizon arrives through `/plan-day`, `/plan-week`, or `/plan-month`; these are invocation names in this playbook, not historic installed skills.

## Build the input picture

- Check current Orca projects, live directors/supervisors/workers, worktrees, explicit blockers, and each project's stated next action.
- Carry forward only active priorities. Confirm whether earlier plans were completed, changed, or remain open.
- Use stated deadlines and available time. If capacity is unknown, give a priority order instead of inventing hours.
- Distinguish commitments, dependencies, proposals, and decisions that need the owner.

## Shape the plan

- **Day:** one to three focus outcomes, the next action for each, and any dependency that could block progress.
- **Week:** milestones by day or sequence, project owners, and review points.
- **Month:** outcomes, milestones, dependencies, and decision gates; avoid false precision about daily scheduling.
- Keep it feasible for the roles actually live in Orca. Use the existing director and supervisor structure; do not assume every agent is running.

## Output and authority

Present the plan with clear Orca project names and mark evidence versus proposal. Planning is advisory: do not create tasks, message agents, reorder priorities, or commit the user to a deadline unless asked.
