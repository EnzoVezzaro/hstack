<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/h-stack-banner.png">
  <img src="assets/h-stack-loop.gif" alt="Pixel-voxel H Stack banner: a voxel H with code, AI, and gaming glyphs and a small leaf">
</picture>

# H Stack

H Stack (read "High Stack") is a set of local agent skills for the multi-agent setup recorded in [the operating model](docs/role-model.md). Each skill is a `SKILL.md` file; the repository is not a plugin and ships no bundled agents or automations.

**Enzo Coding Playbook** is the main router. Invoke it to route a task, or invoke a workflow directly.

## Skills

| Skill | Say | What it does |
| --- | --- | --- |
| [Enzo Coding Playbook](skills/enzo-coding-playbook/SKILL.md) | "use my stack" | Routes an engineering task to one of the workflows below. |
| [Relay Room](skills/relay-room/SKILL.md) | `/relay-room` | Finds the live Orca project and owner, then hands off a bounded task. |
| [Pixel Check](skills/pixel-check/SKILL.md) | `/pixel-check` | Inspects a real screen or app, fixes observed issues, and retests. |
| [Patch Patrol](skills/patch-patrol/SKILL.md) | `/patch-patrol` | Reviews a diff independently and verifies the requested behavior. |
| [Save Point](skills/save-point/SKILL.md) | `/save-point` | Compares current behavior with the last known-good version and repairs the cause. |
| [Skill Workbench](skills/skill-workbench/SKILL.md) | `/skill-workbench` | Turns a repeated, evidenced task into a portable skill. |
| [A New Day](skills/a-new-day/SKILL.md) | `/a-new-day` | Opens the day from live Orca state, recent work, and the next action. |
| [Plan Horizon](skills/plan-horizon/SKILL.md) | `/plan-day`, `/plan-week`, `/plan-month` | Turns current priorities into a feasible plan for one horizon. |
| [Wrap Day](skills/wrap-day/SKILL.md) | `/wrap-day` | Closes the day with verified progress, blockers, and the next step. |
| [Blocker Radar](skills/blocker-radar/SKILL.md) | `/any-blockers` | Finds what is stuck, who owns it, and the smallest next action. |

Some workflows call other skills. Install the ones they need too:

- **Relay Room** — `activate-project-director`, `orca-cli`, `orchestration`.
- **Pixel Check** — `impeccable`, `antislop-ui`, `antislop-human`, `orca-computer-use`, `orchestrated-visual-remediation`.
- **Patch Patrol** — `review`, `review-bugbot`, `review-security`, and optionally `autopilot`.
- **Skill Workbench** — `skill-creator`.
- **Save Point**, **A New Day**, **Plan Horizon**, **Wrap Day**, and **Blocker Radar** need no installed source skill.

The H Stack names are new compositions, not historic installed skill names; none was recorded as invoked in the evidence window. [Skill usage](docs/skill-usage.md) records the evidence tier for each signal, [source skills](docs/source-skills.md) lists the dependencies, and [workflow map](docs/workflow-map.md) shows how the workflows group.

## Install

```bash
git clone https://github.com/EnzoVezzaro/hstack.git
cp -R hstack/skills/* ~/.codex/skills/   # Codex
cp -R hstack/skills/* ~/.claude/skills/  # Claude Code
```

Restart the agent session if it does not discover newly added skills. Keep the `docs/` folder with the skills: the router and workflow files link to it.

## Requirements

- An agent harness that reads local `SKILL.md` files. Trigger names are invocation phrases, not commands registered with every tool.
- The installed source skills listed above, for the workflows that use them. A missing source is reported, not replaced with invented behavior.
- Orca for Relay Room and the daily workflows, which read live sessions, worktrees, and agents. Orca is the source of truth for what is actually running.
- Ego Lite for browser work assigned in the operating model.

## Get started

1. Name **Enzo Coding Playbook** for non-trivial engineering work, or name the workflow you already need.
2. Confirm the real repository, worktree, and existing changes before work begins.
3. Each workflow states its own stop conditions and report format; follow that rather than a fixed sequence across all of them.

```text
use my stack: reproduce the reported regression, fix the cause, and verify the same path.
/pixel-check review the settings page at desktop and mobile widths; report findings before repairing.
/any-blockers check active Orca projects and name the smallest next action for each blocker.
```

## Roles and principles

The V5 setup these skills assume is documented in [the operating model](docs/role-model.md): Codex / ChatGPT is the personal assistant, Orca the orchestrator, Claude Code and Codex the directors, OpenCode / Freebuff / Claude Code / Codex the supervisors and workers, and Ego Lite the browser operator.

- Agents delegate bounded work, verify the result, and report evidence to the owner.
- The human keeps control of product decisions and external actions.
- Prefer free models for routine work; use paid intelligence when the task warrants it.
- Share context and coordinate decisions; manage token budgets rather than adding agents.

## Relationship to the references

[P-Stack](https://github.com/cursor/plugins/tree/main/pstack) is the direct reference. H Stack adopts its named entry router, skills table, install and get-started sections, "make it yours" section, and MIT license. H Stack omits its `.cursor-plugin/` and `plugin.json`, Cursor plugin commands, `agents/` subagents, `automations/`, model-configuration skill, playbook and principle catalogs, and generated harness trees: this repository has no Cursor integration, bundled agents, automations, or model-configuration skill.

[T-Stack](https://github.com/t3dotgg/tstack) is a structural reference. H Stack adopts its compact skill table with a "Say" column, the explicit "some skills call others" dependency note, plain `git clone` + `cp` install, a Requirements section, and "Make them yours" pointing to local config. H Stack omits its GitHub-CLI and PR-centred skills because no such workflow is part of this stack.

## Make them yours

These are starting points. Edit a workflow to match your tools and approval rules, and keep personal settings in your agent's `AGENTS.md` or `CLAUDE.md` so they survive skill updates. When behavior changes, update the router, workflow map, source-skill map, and evidence notes together; see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
