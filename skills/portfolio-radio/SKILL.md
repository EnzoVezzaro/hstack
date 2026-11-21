---
name: portfolio-radio
description: "Cross-project status and portfolio briefing workflow. Use when Enzo says /portfolio-radio, asks for a weekly or monthly portfolio report, project roundup, department status, or priorities across repositories."
---

# Portfolio Radio · cross-project signal

New HStack composition for turning live project evidence into a concise portfolio brief.

## Establish coverage

1. Resolve the requested period, timezone, projects, and audience.
2. Use the tracked portfolio list or the user's stated scope. Report any repositories you could not inspect; do not silently narrow to the current priority.
3. Check live worktree, agent, issue, CI, and deployment state where available. Session history and earlier reports are context, not proof of current state.
4. Confirm important claimed outcomes against the current source, artifact, CI run, or provider state when accessible.

## Classify each signal

For every project, separate:

- **Verified done:** current evidence supports completion.
- **Reported done:** a worker or project owner says it is complete, but independent evidence is absent.
- **Active:** a current owner and next action are visible.
- **Blocked:** name the evidence, impact, owner, and smallest next step.
- **Unknown / stale:** required current evidence is unavailable or old.

Do not turn silence, a planned task, a merged code change, or an old success report into a current green status.

## Shape the brief

- Give one short portfolio summary, then a project-by-project table with status, evidence, next action, owner, and decisions needed.
- Order work by the user's accepted priorities, explicit deadlines, and dependencies. Mark recommendations as proposals.
- For Friday retrospectives, emphasize outcomes and next-week priorities. For Monday planning, give milestones and owners only after priorities are accepted.
- Keep private messages, investment details, health information, and credentials out unless they are necessary to the requested report. Never send the report to an external channel without explicit instruction.

## Close

State coverage and evidence gaps. Ask only for a decision that blocks a concrete next step; do not create tasks, reorder priorities, message owners, or change project state unless requested.
