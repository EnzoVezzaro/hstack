---
name: hstack
description: "Default entry point for HSTACK. Use at the start of any non-trivial engineering task, or when the user types /hstack, says 'continue', or is unsure which skill fits. Reads the request, picks the one HSTACK skill that fits (or splits mixed work into ordered steps), and applies the shared rules: real repo first, one owner per task, verify before reporting, and no outward-facing action without approval."
---

# HSTACK

The front door. Read the request, pick a skill from the table, then read only that skill and the source skills it names. If the work is mixed, split it into ordered steps and route each one.

## HStack V5 role

Layer 1 (assistant) routes; Layer 2 (Orca) owns live sessions; Layer 3 decides; Layer 4 executes on free models where it can; Layer 5 (Ego Lite or computer use) touches real screens. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** Routes at T0; hands each step to the tier its skill names. See [model-routing.md](../../docs/model-routing.md).

## Route

| Reach for it when… | Skill |
| --- | --- |
| Starting the day, planning a horizon, closing the day, or hunting blockers | [a-new-day](../a-new-day/SKILL.md), [plan-horizon](../plan-horizon/SKILL.md), [wrap-day](../wrap-day/SKILL.md), [blocker-radar](../blocker-radar/SKILL.md) |
| The work belongs to a live Orca project or needs a director briefed | [relay-room](../relay-room/SKILL.md) |
| Several agents need tasks, or their reports need checking | [coordinate-agents](../coordinate-agents/SKILL.md) |
| "Continue where you left off" | [resume-work](../resume-work/SKILL.md) |
| Another agent should take over | [handoff](../handoff/SKILL.md) |
| Build or change a feature | [implement-feature](../implement-feature/SKILL.md) |
| Something is broken, or a change needs proving | [verify-and-fix](../verify-and-fix/SKILL.md) |
| It used to work and now it doesn't | [save-point](../save-point/SKILL.md) |
| A diff needs an independent review | [patch-patrol](../patch-patrol/SKILL.md) |
| A question about a library, repo, market, or why code works this way | [research-explain](../research-explain/SKILL.md) |
| Run the app locally and look at it | [run-local](../run-local/SKILL.md) |
| Click through a website like a person | [visual-test-ego-lite](../visual-test-ego-lite/SKILL.md) |
| Click through a native desktop app | [visual-test-computer-use](../visual-test-computer-use/SKILL.md) |
| A screen needs an evidence-based UI pass | [interface-check](../interface-check/SKILL.md) |
| CI is red | [fix-ci](../fix-ci/SKILL.md) |
| Install, configure, or initialize a project | [setup-install](../setup-install/SKILL.md) |
| Remove dead code or refactor without changing behavior | [cleanup-refactor](../cleanup-refactor/SKILL.md) |
| Commit, push, merge | [publish-git](../publish-git/SKILL.md) |
| Deploy from a given source | [deploy](../deploy/SKILL.md) |
| Launch on Product Hunt | [product-hunt-launch](../product-hunt-launch/SKILL.md) |
| Add analytics to the product (PostHog by default) | [set-analytics](../set-analytics/SKILL.md) |
| Merge to main and clear worktrees and branches | [cleanup-worktrees-branches](../cleanup-worktrees-branches/SKILL.md) |
| Get many branches and worktrees ready to merge into main, in the right order | [reconcile-branches](../reconcile-branches/SKILL.md) |
| Clean up the Orca space: merge what you can, close as much as possible | [cleanup-orca](../cleanup-orca/SKILL.md) |
| Clean up Codex or ChatGPT chats: carry over loose ends, archive the rest | [cleanup-chats](../cleanup-chats/SKILL.md) |
| Free disk space | [cleanup-disk-space](../cleanup-disk-space/SKILL.md) |
| Design or adjust UI, a landing page, or a logo | [ui-design](../ui-design/SKILL.md) |
| Check UI, copy, or code for generic AI patterns | [antislop-review](../antislop-review/SKILL.md) |
| Make a motion graphic or short video | [motion-graphic](../motion-graphic/SKILL.md) |
| Update docs, product data, or links | [docs-content](../docs-content/SKILL.md) |
| Make text sound like a person wrote it | [humanize](../humanize/SKILL.md) |
| Prepare a project for open source | [write-readme-opensource](../write-readme-opensource/SKILL.md) |
| SEO audit | [seo-audit](../seo-audit/SKILL.md) |
| Auth, endpoints, migrations, infra, or exposed keys | [security-backend](../security-backend/SKILL.md) |
| A repeated task deserves its own skill | [skill-workbench](../skill-workbench/SKILL.md) |
| Hands-off mode: check every repo's PRs, work the queue until it's empty, repeat | [stoner](../stoner/SKILL.md) |
| Too big for one agent or one session | [break-it-down](../break-it-down/SKILL.md) |
| Work that must keep running for days or weeks on a schedule | [horizon](../horizon/SKILL.md) |
| Repeat until a metric or goal is reached | [horizon-loop](../horizon-loop/SKILL.md) |
| Drive the test suite to a goal over many iterations | [horizon-loop-test](../horizon-loop-test/SKILL.md) |
| Run browser flows until they pass N times in a row | [horizon-loop-ego-lite](../horizon-loop-ego-lite/SKILL.md) |
| Cut a new release | [release](../release/SKILL.md) |
| Search GitHub for repos, code, or issues | [check-github](../check-github/SKILL.md) |
| New sesh: music on, ChatGPT open, first task lined up | [420](../420/SKILL.md) |
| Open the running project so the user can watch it | [let-me-watch](../let-me-watch/SKILL.md) |
| New ideas, or a strange solution to something stuck | [get-stoned](../get-stoned/SKILL.md) |
| Unusual UI inspiration from Awwwards, Codrops, Dribbble, and similar | [haf](../haf/SKILL.md) |
| Build it on a cheap model, then have a stronger model review it | [puff-puff-pass](../puff-puff-pass/SKILL.md) |
| Close everything that can be closed and wrap up for the day | [pineapple-express](../pineapple-express/SKILL.md) |
| Pick which models and agents each tier uses | [setup-hstack](../setup-hstack/SKILL.md) |
| The repo has ACC, or needs it | [acc-context](../acc-context/SKILL.md) |
| Protect a repo from AI training before it goes public | [protect-repo](../protect-repo/SKILL.md) |
| Sell a repo or publish a paid release | [reposell-release](../reposell-release/SKILL.md) |
| A worker needs a specialist profile | [proagent-equip](../proagent-equip/SKILL.md) |
| Set up a crew workspace across several projects | [ace-workspace](../ace-workspace/SKILL.md) |

Nothing fits? Ask one question before doing anything.

## Shared rules

1. Find the real repository and active worktree. Read project instructions and inspect existing changes before editing anything.
2. Use Orca for Orca-owned sessions, directors, supervisors, workers, and worktrees. Never invent a live role from a document or an old session title.
3. Preserve unrelated work. One owner per delegated task, with stated file boundaries.
4. Keep implementation, review, and verification separate. Report only checks observed on the revision being handed back.
5. Leave irreversible actions (merge, publish, deploy, release, purchase, deleting data) with the human.
6. Pick the tier with [model-routing.md](../../docs/model-routing.md): start low, escalate one tier on repeated failure or high stakes, hand execution back down once the decision is made.
7. If evidence or a capability is missing, say so and finish the parts that can be done honestly.

## Report

- What changed, and where.
- Which revision was inspected.
- What was verified, including the exact user flow when it matters.
- What remains unverified or blocked.
