<!-- Generated from docs/skill-contract.md by scripts/quality/generate_skill_references.py; do not edit. -->

# HStack skill execution contract

This file is normative for every `skills/*/SKILL.md`. A skill is a short, portable operating procedure; it is **not** proof that an agent, subscription, Orca session, source skill, or UI tool is available. Keep the workflow specific and inherit these invariants rather than copying them into sixty files.

## 1. Resolve the work, not a theme

- For repository work, name `<project>`, resolve the real repository, current branch, worktree and revision, and read that project's `AGENTS.md` / `CLAUDE.md`, relevant docs and current changes. Never assume the current directory is the target.
- For multi-project work, enumerate repositories and keep separate task owners, file boundaries, baselines, and acceptance checks.
- For non-repository tasks, resolve the actual artifact, service, account or environment. Do not invent a project simply to satisfy a template.
- Preserve unrelated in-progress edits and existing ownership. If scope is ambiguous enough to risk changing the wrong project, stop and resolve it before writing.

## 2. Respect the five layers

| Layer | Job | Boundary |
| --- | --- | --- |
| 1 — Assistant | Understand the user's goal, select skills, communicate and summarize | Does not pretend to be a live worker or director |
| 2 — Orca | Discover and coordinate **actual** project sessions, agents and worktrees | Existing documentation is not live session state |
| 3 — Director | Architecture, product decisions, task specification, acceptance and independent review | Do not silently replace the existing director |
| 4 — Supervisor / worker | Bounded implementation, debugging, research and local checks | One owner per task; do not claim independent sign-off on own patch |
| 5 — Ego Lite / computer use | Inspect and operate real browser or desktop interactions | A diff, build or screenshot is not a completed user-flow test |

When Orca is in scope, first confirm its actual connection or CLI, discover the project and session from live state, and inspect its capabilities. CLI names in examples are illustrative only; never assume a command or tool exists without checking its help/schema. If Orca is not available, deliver a self-contained, clearly **unsent** handoff and do not fabricate an agent response.

## 3. Choose the cheapest capable model

Use the consumer project's confirmed `## hstack models` mapping and [model routing](./model-routing.md). T0 handles routine execution; T1 handles integration; T2/T3 handle decisions and risk. Escalate for repeated failed verification or consequential decisions, state the reason, then hand routine execution back down. Never assert a particular model is active based on a reference table or old report. Avoid delegating when doing so adds more overhead than the task.

## 4. Execute with evidence

1. Identify input, desired outcome, scope, dependencies, acceptance check and stop condition.
2. Inspect source and real runtime state before changing anything. Treat past chats, plans, reports and skill names as hints, not proof.
3. Give every task one active owner and explicit file or resource boundaries; verify no duplicate assignment before dispatch.
4. Use the actual available tool or installed source skill. A named upstream skill is not automatically installed; inspect it or continue with equivalent verified tools, noting the substitution.
5. Capture evidence from the **revision being reported**: commands and results, diff, build, test, CI, real user path, screenshots or logs as appropriate. Independent review must be by someone other than the author when possible.
6. Distinguish **observed**, **agent-reported**, **planned**, **not checked**, and **blocked**. Dispatch acknowledgement does not equal completion.

## 5. Authority and safety gates

### Action scope

Reading and proposing are distinct from acting, and file edits do not imply permission to commit. Every request carries an action scope. Name it before acting and stop at its boundary:

| Scope | What it authorizes | What it does not authorize |
| --- | --- | --- |
| `inspect` | Read, classify, propose, prepare a reviewable plan | Any change to files or external state |
| `local` | Local edits and a **local commit only** | Push, PR, merge, deploy, release, deletion |
| `push` | `local` plus pushing the named commits to the named remote/branch | PR merge, deploy, release |
| `pr` | `push` plus opening/updating the named PR | Merging or closing the PR |
| `merge` | `pr` plus merging the named PR into the named target | Deploy, release, deletion |
| `deploy` | Deploying the named revision to the named environment | Release, publication |
| `release` | Publishing the named release/version | Unrelated deployment or publication |
| `delete` | Deleting only the named data, branch or worktree | Anything outside that list |

- `commit` means `local`. It ends after the local commit; do not push "while you are there".
- Push, PR, merge, deploy, release, deletion, purchases, external messages or posts, and consequential account changes need authorization **for that scope**. A request to open a PR authorizes the scoped branch/commits/PR, **not** merge or deployment.
- A standing rule written by the owner (for example a `## stoner` block in the consumer project's `AGENTS.md`) or an authorization already given in the session **is** authorization for the scope it names. Do not ask again for the same scope; do not widen it. Record where the standing grant came from.
- Technical readiness is never an authority grant. Green checks, an approved PR, or a passing probe do not turn `local` into `push` or `pr` into `merge`. A standing `auto-merge: green-and-approved` rule is an explicit `merge` grant bounded by its own conditions, not a general permission to merge.
- Prepare concrete, reviewable work first when the outstanding scope is unclear; present it and stop before the irreversible step.
- Protect secrets and user data. Never put credentials in prompts, logs or reports.
- On missing tooling, inaccessible state, failed checks, uncertain ownership, or unmet acceptance criteria, stop that action; finish any safe part and report the precise blocker.

## 6. Required handback

Keep it short but auditable: **project / revision**, **outcome and changed files**, **owner or receiving session**, **observed evidence and checks**, **reported-only or unverified work**, **blockers and next action**, **approvals still needed**. A failed or unavailable check must never be reported as passed.

## Naming and scope

Route descriptions name a concrete trigger and outcome, not a theme or a gaming metaphor. Preserve public slash commands unless a documented migration is requested. Optional creative skill names are not license to reinterpret engineering tasks as gameplay. See [HStack V5](./hstack-v5.md), [role model](https://github.com/EnzoVezzaro/hstack/blob/main/docs/role-model.md), [workflow map](https://github.com/EnzoVezzaro/hstack/blob/main/docs/workflow-map.md), and [contributing](https://github.com/EnzoVezzaro/hstack/blob/main/CONTRIBUTING.md).
