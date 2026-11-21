---
name: relay-room
description: "Retro switchboard for Orca project work. Use when Enzo says /relay-room, a task belongs to an existing Orca project team, needs an established director briefed, or needs bounded workers coordinated. Composes the installed activate-project-director, orca-cli and orchestration skills; never replaces Orca or fabricates a project role."
---

# Relay room · switchboard for a live project

## HStack V5 role

Layer 2 (Orca) finds the live project and owner before a bounded handoff. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T2 writes the brief; workers start at T0. See [model-routing.md](../../docs/model-routing.md).

New H Stack composition. Source skills: `activate-project-director`, `orca-cli`, `orchestration`.

## 1. Find the live line

- Read the repo's agent instructions, README, product docs, and current change state before touching anything.
- Resolve the Orca CLI from the installed `orca-cli` guide; use the CLI belonging to this session's runtime.
- Locate the exact repo and worktree, then the active director or supervisor, with `orca agent list --json` and `orca status --json`. Check the latest report and state.
- Treat documents, old session titles, and a name like "Director" as hints only. A retained terminal or workspace label is not a running agent.

## 2. Decide who operates

- Established director owns the project: brief that same session using `activate-project-director`.
- Director already working: send one concise update to that session and confirm Orca accepted it.
- Small, contained change with no requested handoff: keep it local rather than paying coordination overhead.
- Never open a duplicate director, worker, or worktree when the existing owner is active.

## 3. Send a handoff that can be executed

Include: outcome; repo / worktree / branch / baseline; existing director or supervisor and exact Orca session; owner, file boundaries, and dependencies; preserve / allowed / excluded actions; usage and model limits; acceptance checks and required evidence; stop condition and report location. Give each worker one outcome with non-overlapping ownership. Preserve unrelated local edits explicitly.

## 4. Coordinate, then integrate

- Director owns product decisions; supervisor owns implementation integration.
- Let Orca wake the coordinator on receipts instead of polling transcripts. Track accepted delivery separately from actual agent state.
- After `worker_done`, inspect the combined diff and re-run the acceptance path on the integrated revision — not on each patch in isolation.

## 5. Report honestly

Separate what workers reported, what the director reviewed, and what you personally verified. Keep merge, release, deployment, and publication at the user's requested milestone. A sent directive is not proof of completion.
