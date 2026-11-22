# H Stack operating model

H Stack is a multi-repo setup. Every project task names its `<project>` and resolves to an exact Orca repo/worktree. A request that spans repos names each one and keeps ownership, context, and acceptance checks distinct.

Full V5 reference, with the economics, the skill-to-layer map, and the links: [hstack-v5.md](hstack-v5.md).

This document records the user's V5 multi-agent setup. It describes intended responsibilities, not proof that a particular agent or model is currently available.

## Roles

| Role | System | Responsibility |
| --- | --- | --- |
| Personal assistant | Codex / ChatGPT | Work with the user on goals, decisions, priorities, and reports. |
| Orchestrator | Orca | Coordinate agent sessions, routing, and work allocation. |
| Directors | Claude Code, Codex, OpenCode Go; in free mode a strong OpenCode model or Freebuff full mode (currently suspended) | Frame project work, make technical and product decisions, and define acceptance criteria. |
| Supervisors | Prefer capable free OpenCode models for routine supervision; Freebuff free models are an option when available (this user's account is currently suspended). Paid supervision with OpenCode Go, Claude Code, or Codex only when the task needs it | Break work into bounded tasks, track progress and evidence, and report to directors. |
| Workers | OpenCode Go or free models, Claude Code, Codex; Freebuff free tiers (suspended for now) | Implement, debug, test, research, and return evidence for bounded tasks. |
| Browser operator | Ego Lite | Perform browser-based work when the task requires it. |
| Computer operator | Computer use (Orca, Codex, Claude desktop) | Operate native desktop apps and windows that browser tools cannot reach. |

## Operating principles

- Agents delegate bounded work, verify the result, and report evidence to the responsible owner.
- The human retains control over product decisions and external actions.
- Prefer free models for routine work; use paid intelligence when the task warrants it.
- Optimize context sharing, coordination, decisions, verification, and token budgets. Adding agents is not a goal by itself.
- Check live model availability and assignments before assigning a supervisor; use paid supervision only when the task needs it. Treat this model as intended responsibility, not proof that a model is currently usable.
