# The HStack role model

A compact map of who decides and who implements. Orca is the source of truth for which sessions and worktrees actually exist; this model never promotes a documented role into a live one.

```text
You
 └─ Codex · coordinator / planning console
      └─ Orca · sessions, worktrees, routing
           ├─ Director · Codex (observed live)
           │            Claude Code (not observed live — no role assigned)
           └─ Supervisors / workers · OpenCode (live), Codex (observed)
                                       Claude Code, Freebuff (not observed live)
```

## Live check · 2026-11-21

`orca agent list --json` returned 30 sessions: `opencode2` 17 done, `opencode` 5 done + 2 working, `codex` 6 done. No Claude Code or Freebuff agent appeared. `claude` and `freebuff` are installed on this Mac, and `hstack/.freebuff/project-id` exists, but installation is not availability. This playbook was authored by the current OpenCode session; authoring is not a director role. Re-check live state before assigning work.

## Roles

- **Coordinator — Codex.** Keeps goals and decisions in view, checks current Orca state, proposes day/week/month plans, routes a project task to its existing owner, and brings back an evidence-based report.
- **Director — Codex or Claude Code.** Owns problem framing, product and architecture decisions, scope, and acceptance criteria. The existing Orca director session is the target when one exists. Only a role observed live is assigned.
- **Supervisor — OpenCode, Codex, or another live agent.** Owns an implementation area, assigns bounded work when useful, prevents overlapping file ownership, integrates results, and reports what was actually checked. Product scope is not silently rewritten.
- **Worker — any live coding agent.** Owns one clear task with a limited file or behavior scope, preserves unrelated edits, reports changed files and checks, and raises blockers instead of guessing. A worker does not claim project-wide verification from its own patch.

## Choosing layers

- **Small contained change:** work directly in the correct checkout and use the project's normal review path.
- **Existing Orca project:** coordinate with the live director; keep a supervisor if one already exists.
- **Parallel work:** split only across independent, reviewable boundaries.
- **No live team found:** continue locally when practical, report what is missing, and do not manufacture a director or supervisor.
