# H Stack operating model

Full V5 reference, with the economics, the skill-to-layer map, and the links: [hstack-v5.md](hstack-v5.md).

This document records the user's V5 multi-agent setup. It describes intended responsibilities, not proof that a particular agent or model is currently available.

## Roles

| Role | System | Responsibility |
| --- | --- | --- |
| Personal assistant | Codex / ChatGPT | Work with the user on goals, decisions, priorities, and reports. |
| Orchestrator | Orca | Coordinate agent sessions, routing, and work allocation. |
| Directors | Claude Code, Codex | Frame project work, make technical and product decisions, and define acceptance criteria. |
| Supervisors and workers | OpenCode, Freebuff, Claude Code, Codex | Own bounded implementation tasks, delegate when useful, verify results, and report back. |
| Browser operator | Ego Lite | Perform browser-based work when the task requires it. |
| Computer operator | Computer use (Orca, Codex, Claude desktop) | Operate native desktop apps and windows that browser tools cannot reach. |

## Operating principles

- Agents delegate bounded work, verify the result, and report evidence to the responsible owner.
- The human retains control over product decisions and external actions.
- Prefer free models for routine work; use paid intelligence when the task warrants it.
- Optimize context sharing, coordination, decisions, verification, and token budgets. Adding agents is not a goal by itself.
- Check live availability and assignments before treating this model as the current runtime setup.
