# Workflow map

H Stack groups the recurring work into three shelves. The map separates behavior visible in the local monthly activity analysis from new compositions, and names the evidence tier for each. It does not claim that an H Stack route name was historically invoked.

## Work shelves

| Shelf | Work seen in the activity record | H Stack routes | Evidence status |
| --- | --- | --- | --- |
| Build and coordinate | Existing Orca teams, bounded worker tasks, integration, review, and skill authoring | HSTACK (`/hstack`), Take One Dude, Relay Room, Patch Patrol, Skill Workbench | `orchestration` and `orca-cli` were invoked; coordination and review are inferred from that activity. Authoring is inferred from one observed authoring session. All H Stack route names are thread-only. |
| Experience and recovery | Visual reviews, responsive and accessibility checks, regression recovery | Interface Check, Save Point | Visual-review sources (`impeccable`, `antislop-ui`, `orca-computer-use`) were invoked; Save Point is inferred from repeated user corrections. Both route names are thread-only. |
| Daily operations | Morning briefings, day/week/month planning, end-of-day reports, blockers | A New Day, Plan Horizon, Wrap Day, Blocker Radar | User-specified routines over live Orca state; no historic invocation was found. |

## Routing rules

- H Stack serves work across multiple repositories. Identify the `<project>` or explicitly list all projects before routing; never assume the currently open repo is the target.
- For a code change, start at **HSTACK (`/hstack`)**. It routes to project coordination, interface work, regression recovery, independent review, or skill authoring.
- **Take One Dude** is a new composition for a single agent to own one named project outcome, choose a bounded execution path, and report concrete probe evidence; it is not a historic skill invocation.
- For a repeated task worth capturing, use **Skill Workbench**. It builds a skill from recorded evidence rather than from assumed preferences.
- **Benchmark** is a new composition for measuring skill quality, harness loading, and routing in fresh environments; it is not a historic skill invocation and does not claim live task success on its own.
- **Resume All** is a new composition over Orca's portfolio state; it resumes only genuinely interrupted work and is not a historic skill invocation.
- For personal daily operations, choose the smallest fit: **A New Day**, **Plan Horizon**, **Wrap Day**, or **Blocker Radar**.

## Evidence boundary

The source report covers 2026-10-21 through 2026-11-21. It searched local Claude Code transcripts and a partial Orca bridge audit; it did not cover every harness, machine, account, or session store. See [skill-usage.md](skill-usage.md) for counts and limitations. H Stack's composition names are not presented as prior usage.

Three compositions drafted in the earlier revision — `field-notes`, `launch-runway`, and `portfolio-radio` — are not part of this inventory. They had no invoked, mentioned, or inferred evidence tier and were proposed only as new names over recurring activity; they were removed rather than kept to reach a skill count. `field-notes` and `portfolio-radio` were also explicitly rejected.
