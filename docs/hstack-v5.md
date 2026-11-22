# HStack V5

HStack is the multi-agent setup described in the V5 post ("My AI Degen Stack V5"). This document is the reference for that setup: the roles, the economics, the principles, and which skill does what in it. [role-model.md](role-model.md) holds the short operating model; this file adds the detail.

![The whole HSTACK V5 map: you, five layers with their tools, models, and skills, and what ships](../assets/animations/architecture.gif)

The skills in this repo are local `SKILL.md` files. Nothing here proves that a given agent or model is running right now. Check live assignments in Orca before treating the roles as the current runtime.

H Stack is a **multi-repo infrastructure**: Orca coordinates distinct projects, repositories, and worktrees. Every code task names its `<project>`; multi-repo tasks list all projects and keep their context, ownership, and acceptance checks separate. Subscription limits and model recommendations are observations per provider/account, then matched to each project's next task; see [`token-balancer`](../skills/token-balancer/SKILL.md).

## Operating contract

Every published skill follows the [HStack execution contract](skill-contract.md). V5 roles and model tiers define responsibilities, **not** proof of active Orca sessions, connected tools, or available models. See the [complete catalog audit](skill-audit-2026-11-22.md) for the current 60 routes and the scope of static versus runtime verification.

## Evolution

| Version | Chain |
| --- | --- |
| V1 | Herdr → OpenCode / Freebuff → Ego Lite |
| V2 | Herdr → Codex → OpenCode / Freebuff → Ego Lite |
| V3 | ORCA → Herdr → Codex → OpenCode / Freebuff → Ego Lite |
| V4 | ORCA → Codex / Claude Code → OpenCode / Freebuff → Ego Lite |
| **V5** | **Codex → ORCA → Codex / Claude Code → OpenCode / Freebuff → Ego Lite + computer use** |

## Roles

| Layer | Tool | Role | Does | Model tier |
| --- | --- | --- | --- | --- |
| 1 | Codex / ChatGPT Plus | Personal assistant | Voice commands, conversation, planning, project tracking, reports to the owner | Paid |
| 2 | Orca (open source) | Orchestrator | Agent sessions, context, routing, coordination, work allocation | Free (tool) |
| 3 | Claude Code / Codex | Directors | Complex reasoning, architecture, delegation, product decisions, acceptance criteria | Paid |
| 4 | OpenCode / Claude Code / Codex (Freebuff suspended for now) | Supervisors and workers | Parallel coding, debugging, testing, research, execution | Free models for routine work |
| 5 | Ego Lite (open source) | Browser operator | Navigate websites and web apps, collect information, test real workflows | Free (tool) |
| 5 | Computer use (Orca `orca computer`, Codex Computer Use, Claude desktop) | Computer operator | Drive native desktop apps and windows a browser tool cannot reach | Included with the tools above |

Principles from the post:

- Expensive intelligence makes decisions. Cheap intelligence handles execution.
- Agents delegate, verify, and report back.
- Humans stay in control.
- More agents is not more intelligence. The goal is to share context, coordinate decisions, delegate, verify, and stay within token budgets.

## Escalating and downgrading

Every skill starts at the cheapest of four tiers that can do the work (workers, supervisors, directors, gods mode) and moves up one tier only on repeated failure or high stakes, then hands execution back down. The tiers, defaults, and rules are in [model-routing.md](model-routing.md); `/setup-hstack` writes your own map.

## Own products in the stack

| Product | What it adds | Skill |
| --- | --- | --- |
| [ACC](https://github.com/EnzoVezzaro/agents-code-context) | Repos that explain themselves to agents (`AGENTS.md` + `.acc/`), focused context, durable memory | `acc-context` |
| [Repo Shield](https://github.com/EnzoVezzaro/repo-shield) | License, AI-training notice, policy, and a weekly watch | `protect-repo` |
| [reposell](https://github.com/EnzoVezzaro/reposell) | Signed paid releases and listings with Stripe Payment Links | `reposell-release` |
| [ProAgents](https://github.com/EnzoVezzaro/proagents) | Professional profiles that make a cheap worker act like a specialist | `proagent-equip` |
| [ACE](https://github.com/EnzoVezzaro/ace-proagents) | Crew workspaces: governor, supervisors, workers, budget | `ace-workspace` |
| [Oreja](https://github.com/EnzoVezzaro/oreja) | Pauses or lowers the music while ChatGPT or another chosen app is talking | `420` |

## Economics (from the post)

| Item | Cost |
| --- | --- |
| Codex / ChatGPT Plus | $20/month |
| Claude Code / Claude Pro | $20/month |
| ORCA | Open source |
| Ego Lite | Open source |
| OpenCode | Open source, with free models |
| Freebuff | Account suspended for now ([the story](../README.md#a-note-to-the-freebuff-team)) |
| **Total** | **$40/month** (subscription and free-tier limits apply; API costs, hosting, and extra usage are not included) |

Prices are as stated in the post. Verify current pricing before relying on them.

## Command map by role

Each HStack skill runs in one layer. Routine execution goes to layer 4 on free models; decisions and acceptance go to layer 3 or to the owner.

| Skill | Command | Layer that runs it | Decision owner |
| --- | --- | --- | --- |
| [hstack](../skills/hstack/SKILL.md) | `/hstack` | 1 routes | Owner |
| [a-new-day](../skills/a-new-day/SKILL.md) | `/a-new-day` | 1 | Owner |
| [plan-horizon](../skills/plan-horizon/SKILL.md) | `/plan-day`, `/plan-week`, `/plan-month` | 1 | Owner |
| [wrap-day](../skills/wrap-day/SKILL.md) | `/wrap-day` | 1 | Owner |
| [blocker-radar](../skills/blocker-radar/SKILL.md) | `/any-blockers` | 1 with 2 | Owner |
| [coordinate-agents](../skills/coordinate-agents/SKILL.md) | `/coordinate-agents` | 2 Orca | Layer 3 |
| [relay-room](../skills/relay-room/SKILL.md) | `/relay-room` | 2 | Layer 3 |
| [resume-work](../skills/resume-work/SKILL.md) | `/resume-work` | 2 | Layer 3 |
| [handoff](../skills/handoff/SKILL.md) | `/handoff` | 2 | Layer 3 |
| [implement-feature](../skills/implement-feature/SKILL.md) | `/implement-feature` | 4 worker | Layer 3 approves the acceptance check |
| [take-one-dude](../skills/take-one-dude/SKILL.md) | `/take-one-dude <project>` | 1 routes; execution follows the task skill | Owner gets probe evidence |
| [verify-and-fix](../skills/verify-and-fix/SKILL.md) | `/verify-and-fix` | 4 supervisor | Layer 3 |
| [patch-patrol](../skills/patch-patrol/SKILL.md) | `/patch-patrol` | 3 reviews 4's diff | Layer 3 |
| [save-point](../skills/save-point/SKILL.md) | `/save-point` | 4 | Layer 3 |
| [research-explain](../skills/research-explain/SKILL.md) | `/research-explain` | 4 researches, 3 decides | Layer 3 |
| [run-local](../skills/run-local/SKILL.md) | `/run-local` | 4 | Layer 3 |
| [visual-test](../skills/visual-test/SKILL.md) | `/visual-test` | 5 Ego Lite or computer use | Layer 3 |
| [interface-check](../skills/interface-check/SKILL.md) | `/interface-check` | 5 with 3 | Layer 3 |
| [ui-design](../skills/ui-design/SKILL.md) | `/ui-design` | 3 designs, 4 implements | Layer 3 |
| [antislop-review](../skills/antislop-review/SKILL.md) | `/antislop-review` | 4 | Layer 3 |
| [motion-graphic](../skills/motion-graphic/SKILL.md) | `/motion-graphic` | 4 | Layer 3 |
| [docs-content](../skills/docs-content/SKILL.md) | `/docs-content` | 4 drafts, 1 checks facts | Owner |
| [humanize](../skills/humanize/SKILL.md) | `/humanize` | 4 | Owner |
| [write-readme-opensource](../skills/write-readme-opensource/SKILL.md) | `/write-readme-opensource` | 4 | Owner |
| [seo-audit](../skills/seo-audit/SKILL.md) | `/seo-audit` | 3 | Owner |
| [set-analytics](../skills/set-analytics/SKILL.md) | `/set-analytics` | 4 installs, 3 plans events | Owner provides keys and approves |
| [product-hunt-launch](../skills/product-hunt-launch/SKILL.md) | `/product-hunt-launch` | 3 drafts | Owner approves posting |
| [setup-install](../skills/setup-install/SKILL.md) | `/setup-install` | 4 | Layer 3 |
| [fix-ci](../skills/fix-ci/SKILL.md) | `/fix-ci` | 4 | Layer 3 |
| [cleanup-refactor](../skills/cleanup-refactor/SKILL.md) | `/cleanup-refactor` | 4 | Layer 3 |
| [cleanup-worktrees-branches](../skills/cleanup-worktrees-branches/SKILL.md) | `/cleanup-worktrees-branches` | 2 | Owner confirms deletions |
| [reconcile-branches](../skills/reconcile-branches/SKILL.md) | `/reconcile-branches` | 4 rehearses, 3 decides | Owner approves the merge into main |
| [cleanup-orca](../skills/cleanup-orca/SKILL.md) | `/cleanup-orca` | 2 with 4 | Owner approves one batch |
| [cleanup-chats](../skills/cleanup-chats/SKILL.md) | `/cleanup-chats` | 1 with 4 | Owner approves the archive list |
| [cleanup-disk-space](../skills/cleanup-disk-space/SKILL.md) | `/cleanup-disk-space` | 4 measures | Owner confirms deletions |
| [publish-git](../skills/publish-git/SKILL.md) | `/publish-git` | 3 | Owner approves push and merge |
| [deploy](../skills/deploy/SKILL.md) | `/deploy <deployment-source>` | 3 | Owner approves target and version |
| [security-backend](../skills/security-backend/SKILL.md) | `/security-backend` | 3 | Owner |
| [stoner](../skills/stoner/SKILL.md) | `/stoner` | 2 scans, 3 ranks, 4 works | Owner approves merges unless a standing rule allows them |
| [break-it-down](../skills/break-it-down/SKILL.md) | `/break-it-down` | 3 | Layer 3 |
| [horizon](../skills/horizon/SKILL.md) | `/horizon` | 1 designs, 2 or Codex runs | Owner activates the schedule |
| [horizon-loop](../skills/horizon-loop/SKILL.md) | `/horizon-loop` | 4 | Layer 3 |
| [horizon-loop-test](../skills/horizon-loop-test/SKILL.md) | `/horizon-loop-test` | 4 | Layer 3 |
| [horizon-loop-ego-lite](../skills/horizon-loop-ego-lite/SKILL.md) | `/horizon-loop-ego-lite` | 5 with 4 | Layer 3 |
| [release](../skills/release/SKILL.md) | `/release` | 3 | Owner approves the tag |
| [check-github](../skills/check-github/SKILL.md) | `/check-github` | 4 | Layer 3 |
| [420](../skills/420/SKILL.md) | `/420` | 1 sets up, 2 opens the workspace | Owner |
| [let-me-watch](../skills/let-me-watch/SKILL.md) | `/let-me-watch` | 4 starts, 5 shows | Owner |
| [get-stoned](../skills/get-stoned/SKILL.md) | `/get-stoned` | 4 generates, 3 judges | Layer 3 |
| [haf](../skills/haf/SKILL.md) | `/haf` | 5 browses, 3 picks | Layer 3 |
| [puff-puff-pass](../skills/puff-puff-pass/SKILL.md) | `/puff-puff-pass` | 4 builds, 3 reviews | Layer 3 |
| [pineapple-express](../skills/pineapple-express/SKILL.md) | `/pineapple-express` | 2 lists, 4 closes | Owner approves one batch |
| [setup-hstack](../skills/setup-hstack/SKILL.md) | `/setup-hstack` | 1 | Owner approves the map |
| [token-balancer](../skills/token-balancer/SKILL.md) | `/token-balancer` | 1 reads, 2 may compare | Owner applies recommendation |
| [acc-context](../skills/acc-context/SKILL.md) | `/acc-context` | 4 | Layer 3 |
| [protect-repo](../skills/protect-repo/SKILL.md) | `/protect-repo` | 4 | Owner merges the PR |
| [reposell-release](../skills/reposell-release/SKILL.md) | `/reposell-release` | 4 with 3 | Owner approves publishing |
| [proagent-equip](../skills/proagent-equip/SKILL.md) | `/proagent-equip` | 3 picks, 4 runs | Layer 3 |
| [ace-workspace](../skills/ace-workspace/SKILL.md) | `/ace-workspace` | 2 with 3 | Owner confirms setup |
| [skill-workbench](../skills/skill-workbench/SKILL.md) | `/skill-workbench` | 1 with 3 | Owner |

## Tools

- Orca (orchestrator): <https://github.com/stablyai/orca>
- Freebuff: <https://freebuff.com> and the npm package `freebuff` (account suspended for now)
- Codex: <https://github.com/openai/codex>

Other tools (Claude Code, OpenCode, Ego Lite) are named in the post. Their links are in the list below.

## Links from the V5 post

The post lists seven short links. Their destinations could not be confirmed from here: each one answers with a LinkedIn redirect, not a destination. The mapping to tools is therefore left unassigned until the owner confirms it.

1. https://lnkd.in/gGseNDAx
2. https://lnkd.in/g6_KjAZU
3. https://lnkd.in/g5_Hu6-i
4. https://lnkd.in/gBeeWUSm
5. https://lnkd.in/gfd946mT
6. https://lnkd.in/geTfhbF2
7. https://lnkd.in/gpA3yv9u

## Caveats

- Subscription and free-tier limits apply. Free models change; check availability before routing work to them.
- Routine work goes to free models in layer 4. Use paid intelligence only when the task needs it.
- Nothing outward-facing (publishing, deploying, pushing, merging, deleting) happens without the owner's approval, whatever the layer.
