---
name: enzo-coding-playbook
description: "Front console for the Enzo Coding Playbook. Use when Enzo says \"use my stack\", continue Orca work, review a change, repair a regression, improve a UI, turn a repeated task into a skill, or run a day/horizon routine. Routes to the H Stack workflows listed here; Orca stays the source of truth for live sessions and roles."
---

# Enzo Coding Playbook · front console

Pick one workflow and read only that workflow plus the source skills it names. Invoke this router with **“use my stack”**, or name a trigger below. The switchboard is in `docs/source-skills.md`; what the history actually proves is in `docs/skill-usage.md`.

| Switch | Trigger | Reach for it when… | Workflow |
| --- | --- | --- | --- |
| **RELAY-ROOM** | `/relay-room` | an Orca project team, a director brief, or a worker wave | [relay-room](../relay-room/SKILL.md) |
| **INTERFACE-CHECK** | `/interface-check` | a screen, page, or native app needs an evidence-based UI pass | [interface-check](../interface-check/SKILL.md) |
| **PATCH-PATROL** | `/patch-patrol` | a diff needs independent review or a PR needs follow-through | [patch-patrol](../patch-patrol/SKILL.md) |
| **SAVE-POINT** | `/save-point` | behavior that used to work broke and the last good version matters | [save-point](../save-point/SKILL.md) |
| **SKILL-WORKBENCH** | `/skill-workbench` | a repeated task deserves its own portable skill | [skill-workbench](../skill-workbench/SKILL.md) |
| **A-NEW-DAY** | `/a-new-day` | starting the day across live projects | [a-new-day](../a-new-day/SKILL.md) |
| **PLAN-HORIZON** | `/plan-day`, `/plan-week`, `/plan-month` | turning current priorities into a feasible plan | [plan-horizon](../plan-horizon/SKILL.md) |
| **WRAP-DAY** | `/wrap-day` | closing the shift with an honest status log | [wrap-day](../wrap-day/SKILL.md) |
| **BLOCKER-RADAR** | `/any-blockers` | a scan for what is stuck and who owns it | [blocker-radar](../blocker-radar/SKILL.md) |

## Shared operating rules

1. Find the real repository and active worktree. Read project instructions and inspect existing changes before editing anything.
2. Use Orca for Orca-owned sessions, directors, supervisors, workers, and worktrees. Never invent a live role from a document or an old session title.
3. Preserve unrelated user and agent work. One owner per delegated task, with stated file boundaries.
4. Keep implementation, review, and product verification separate. Report only checks observed on the revision being handed back.
5. Leave irreversible actions — merge, publish, deploy, release, purchase, physical actuation — with the human.
6. If evidence or a capability is missing, say so and finish the parts that can be done honestly.

## Completion report

- What changed, and where.
- Which revision or version was inspected.
- What was actually verified, including the exact user flow when it matters.
- What remains unverified or blocked.
- The next concrete action, only if one is needed.

H Stack's named routes are **new H Stack compositions**, not historic installed skill names. The evidence and limits behind them are recorded in `docs/skill-usage.md` and `docs/workflow-map.md`.
