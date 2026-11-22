---
name: plan-horizon
description: "Time-horizon planning from verified state. Use for /plan-day, /plan-week, /plan-month, or when the owner asks to plan a time horizon."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer1"
---

# Plan horizon — evidence-based project plan

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## Purpose

Time-horizon planning from verified state.

## HStack V5 role

Layer 1 (assistant) turns priorities into a feasible plan; the owner approves it. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T2 drafts the plan; T0 gathers the facts first. See [model-routing.md](references/model-routing.md).

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
