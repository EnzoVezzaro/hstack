# HStack V5

HStack is the multi-agent setup described in the V5 post ("My AI Degen Stack V5"). This document is the reference for that setup: the roles, the economics, the principles, and which skill does what in it. [role-model.md](role-model.md) holds the short operating model; this file adds the detail.

The skills in this repo are local `SKILL.md` files. Nothing here proves that a given agent or model is running right now. Check live assignments in Orca before treating the roles as the current runtime.

## Evolution

| Version | Chain |
| --- | --- |
| V1 | Herdr → OpenCode / Freebuff → Ego Lite |
| V2 | Herdr → Codex → OpenCode / Freebuff → Ego Lite |
| V3 | ORCA → Herdr → Codex → OpenCode / Freebuff → Ego Lite |
| V4 | ORCA → Codex / Claude Code → OpenCode / Freebuff → Ego Lite |
| **V5** | **Codex → ORCA → Codex / Claude Code → OpenCode / Freebuff → Ego Lite** |

## Roles

| Layer | Tool | Role | Does | Model tier |
| --- | --- | --- | --- | --- |
| 1 | Codex / ChatGPT Plus | Personal assistant | Voice commands, conversation, planning, project tracking, reports to the owner | Paid |
| 2 | Orca (open source) | Orchestrator | Agent sessions, context, routing, coordination, work allocation | Free (tool) |
| 3 | Claude Code / Codex | Directors | Complex reasoning, architecture, delegation, product decisions, acceptance criteria | Paid |
| 4 | OpenCode / Freebuff / Claude Code / Codex | Supervisors and workers | Parallel coding, debugging, testing, research, execution | Free models for routine work |
| 5 | Ego Lite (open source) | Browser operator | Navigate websites and apps, collect information, test real workflows | Free (tool) |

Principles from the post:

- Expensive intelligence makes decisions. Cheap intelligence handles execution.
- Agents delegate, verify, and report back.
- Humans stay in control.
- More agents is not more intelligence. The goal is to share context, coordinate decisions, delegate, verify, and stay within token budgets.

## Economics (from the post)

| Item | Cost |
| --- | --- |
| Codex / ChatGPT Plus | $20/month |
| Claude Code / Claude Pro | $20/month |
| ORCA | Open source |
| Ego Lite | Open source |
| OpenCode | Open source, with free models |
| Freebuff | Free usage |
| **Total** | **$40/month** (subscription and free-tier limits apply; API costs, hosting, and extra usage are not included) |

Prices are as stated in the post. Verify current pricing before relying on them.

## Command map by role

Each HStack skill runs in one layer. Routine execution goes to layer 4 on free models; decisions and acceptance go to layer 3 or to the owner.

| Skill | Command | Layer that runs it | Decision owner |
| --- | --- | --- | --- |
| [enzo-coding-playbook](../skills/enzo-coding-playbook/SKILL.md) | "use my stack" | 1 routes | Owner |
| [a-new-day](../skills/a-new-day/SKILL.md) | `/a-new-day` | 1 | Owner |
| [plan-horizon](../skills/plan-horizon/SKILL.md) | `/plan-day`, `/plan-week`, `/plan-month` | 1 | Owner |
| [wrap-day](../skills/wrap-day/SKILL.md) | `/wrap-day` | 1 | Owner |
| [blocker-radar](../skills/blocker-radar/SKILL.md) | `/any-blockers` | 1 with 2 | Owner |
| [coordinate-agents](../skills/coordinate-agents/SKILL.md) | `/coordinate-agents` | 2 Orca | Layer 3 |
| [relay-room](../skills/relay-room/SKILL.md) | `/relay-room` | 2 | Layer 3 |
| [resume-work](../skills/resume-work/SKILL.md) | `/resume-work` | 2 | Layer 3 |
| [handoff](../skills/handoff/SKILL.md) | `/handoff` | 2 | Layer 3 |
| [implement-feature](../skills/implement-feature/SKILL.md) | `/implement-feature` | 4 worker | Layer 3 approves the acceptance check |
| [verify-and-fix](../skills/verify-and-fix/SKILL.md) | `/verify-and-fix` | 4 supervisor | Layer 3 |
| [patch-patrol](../skills/patch-patrol/SKILL.md) | `/patch-patrol` | 3 reviews 4's diff | Layer 3 |
| [save-point](../skills/save-point/SKILL.md) | `/save-point` | 4 | Layer 3 |
| [research-explain](../skills/research-explain/SKILL.md) | `/research-explain` | 4 researches, 3 decides | Layer 3 |
| [run-local](../skills/run-local/SKILL.md) | `/run-local` | 4 | Layer 3 |
| [visual-test-ego-lite](../skills/visual-test-ego-lite/SKILL.md) | `/visual-test-ego-lite` | 5 Ego Lite | Layer 3 |
| [interface-check](../skills/interface-check/SKILL.md) | `/interface-check` | 5 with 3 | Layer 3 |
| [ui-design](../skills/ui-design/SKILL.md) | `/ui-design` | 3 designs, 4 implements | Layer 3 |
| [antislop-review](../skills/antislop-review/SKILL.md) | `/antislop-review` | 4 | Layer 3 |
| [motion-graphic](../skills/motion-graphic/SKILL.md) | `/motion-graphic` | 4 | Layer 3 |
| [docs-content](../skills/docs-content/SKILL.md) | `/docs-content` | 4 drafts, 1 checks facts | Owner |
| [humanize](../skills/humanize/SKILL.md) | `/humanize` | 4 | Owner |
| [write-readme-opensource](../skills/write-readme-opensource/SKILL.md) | `/write-readme-opensource` | 4 | Owner |
| [seo-audit](../skills/seo-audit/SKILL.md) | `/seo-audit` | 3 | Owner |
| [product-hunt-launch](../skills/product-hunt-launch/SKILL.md) | `/product-hunt-launch` | 3 drafts | Owner approves posting |
| [setup-install](../skills/setup-install/SKILL.md) | `/setup-install` | 4 | Layer 3 |
| [fix-ci](../skills/fix-ci/SKILL.md) | `/fix-ci` | 4 | Layer 3 |
| [cleanup-refactor](../skills/cleanup-refactor/SKILL.md) | `/cleanup-refactor` | 4 | Layer 3 |
| [cleanup-worktrees-branches](../skills/cleanup-worktrees-branches/SKILL.md) | `/cleanup-worktrees-branches` | 2 | Owner confirms deletions |
| [cleanup-disk-space](../skills/cleanup-disk-space/SKILL.md) | `/cleanup-disk-space` | 4 measures | Owner confirms deletions |
| [publish-git](../skills/publish-git/SKILL.md) | `/publish-git` | 3 | Owner approves push and merge |
| [deploy](../skills/deploy/SKILL.md) | `/deploy <deployment-source>` | 3 | Owner approves target and version |
| [security-backend](../skills/security-backend/SKILL.md) | `/security-backend` | 3 | Owner |
| [skill-workbench](../skills/skill-workbench/SKILL.md) | `/skill-workbench` | 1 with 3 | Owner |
| [general-tasks](../skills/general-tasks/SKILL.md) | `/general-tasks` | 1 classifies, hands to the skill | Owner |

## Tools

- Orca (orchestrator): <https://github.com/stablyai/orca>
- Freebuff: <https://freebuff.com> and the npm package `freebuff`
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
