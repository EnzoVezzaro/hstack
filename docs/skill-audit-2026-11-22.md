# HStack skill audit and normalization — 2026-11-22

**Baseline:** `main` at `5d89734cf6bd829a23ee035593d1a69a5e534d10`. **Scope:** every one of the 60 published `skills/*/SKILL.md` files. Static source audit; not a claim that Orca, agents, model subscriptions, or browser/desktop drivers ran.

## Findings and action

| Finding | Change |
| --- | --- |
| `relay-room` used a “Retro switchboard” framing for a live Orca handoff | Rewrote the skill around the exact project, director, session, duplicate detection, real delivery receipt, and explicit unsent fallback |
| Eight skills used decorative retro/game-style descriptors or headings instead of the actual operation | Replaced those descriptors/headings without changing the public slash commands |
| Shared ownership, approval, and verification rules were scattered, or implicitly relied on live tools | Added a normative [execution contract](skill-contract.md), linked by every published skill |
| Older W1–W11 labels appeared as active instructions inside individual skills | Removed those duplicate legacy declarations from individual skill bodies; retain historical taxonomy in [workflows](workflows.md) |
| Upstream source-skill names could be read as guaranteed installed dependencies | Marked composition references as optional and made capability discovery/unsent fallback a required rule |
| No repository check enforced skill frontmatter, links, or contract coverage | Added the dependency-free Node validator and PR CI job |
| The repo already has a [consolidation proposal](consolidation-proposal.md) | Do not silently enact its route renames. Keep all 60 names and current call graph until a separate migration is reviewed |

## Complete inventory

Every skill below was inspected for its trigger, V5 role/tier, dependencies, scope, approval/verification flow, and relationship to other skills. The corrections centralize shared operational invariants; specialized procedural steps remain in their own files. This is not a claim of 60 separate end-to-end runtime tests.

### Entry, routing and delegation (13)

[`/hstack`](../skills/hstack/SKILL.md) · [`/relay-room`](../skills/relay-room/SKILL.md) · [`/coordinate-agents`](../skills/coordinate-agents/SKILL.md) · [`/handoff`](../skills/handoff/SKILL.md) · [`/resume-work`](../skills/resume-work/SKILL.md) · [`/token-balancer`](../skills/token-balancer/SKILL.md) · [`/setup-hstack`](../skills/setup-hstack/SKILL.md) · [`/ace-workspace`](../skills/ace-workspace/SKILL.md) · [`/proagent-equip`](../skills/proagent-equip/SKILL.md) · [`/acc-context`](../skills/acc-context/SKILL.md) · [`/break-it-down`](../skills/break-it-down/SKILL.md) · [`/take-one-dude`](../skills/take-one-dude/SKILL.md) · [`/stoner`](../skills/stoner/SKILL.md)

### Planning, cadence and horizon (10)

[`/420`](../skills/420/SKILL.md) · [`/a-new-day`](../skills/a-new-day/SKILL.md) · [`/blocker-radar`](../skills/blocker-radar/SKILL.md) · [`/plan-horizon`](../skills/plan-horizon/SKILL.md) · [`/wrap-day`](../skills/wrap-day/SKILL.md) · [`/pineapple-express`](../skills/pineapple-express/SKILL.md) · [`/horizon`](../skills/horizon/SKILL.md) · [`/horizon-loop`](../skills/horizon-loop/SKILL.md) · [`/horizon-loop-test`](../skills/horizon-loop-test/SKILL.md) · [`/horizon-loop-ego-lite`](../skills/horizon-loop-ego-lite/SKILL.md)

### Engineering, testing and interfaces (12)

[`/implement-feature`](../skills/implement-feature/SKILL.md) · [`/verify-and-fix`](../skills/verify-and-fix/SKILL.md) · [`/fix-ci`](../skills/fix-ci/SKILL.md) · [`/patch-patrol`](../skills/patch-patrol/SKILL.md) · [`/save-point`](../skills/save-point/SKILL.md) · [`/cleanup-refactor`](../skills/cleanup-refactor/SKILL.md) · [`/run-local`](../skills/run-local/SKILL.md) · [`/interface-check`](../skills/interface-check/SKILL.md) · [`/visual-test`](../skills/visual-test/SKILL.md) · [`/let-me-watch`](../skills/let-me-watch/SKILL.md) · [`/ui-design`](../skills/ui-design/SKILL.md) · [`/antislop-review`](../skills/antislop-review/SKILL.md)

### Research, design and content (10)

[`/check-github`](../skills/check-github/SKILL.md) · [`/research-explain`](../skills/research-explain/SKILL.md) · [`/docs-content`](../skills/docs-content/SKILL.md) · [`/humanize`](../skills/humanize/SKILL.md) · [`/write-readme-opensource`](../skills/write-readme-opensource/SKILL.md) · [`/seo-audit`](../skills/seo-audit/SKILL.md) · [`/get-stoned`](../skills/get-stoned/SKILL.md) · [`/haf`](../skills/haf/SKILL.md) · [`/skill-workbench`](../skills/skill-workbench/SKILL.md) · [`/motion-graphic`](../skills/motion-graphic/SKILL.md)

### Shipping, safety and maintenance (15)

[`/deploy`](../skills/deploy/SKILL.md) · [`/publish-git`](../skills/publish-git/SKILL.md) · [`/release`](../skills/release/SKILL.md) · [`/product-hunt-launch`](../skills/product-hunt-launch/SKILL.md) · [`/set-analytics`](../skills/set-analytics/SKILL.md) · [`/protect-repo`](../skills/protect-repo/SKILL.md) · [`/reposell-release`](../skills/reposell-release/SKILL.md) · [`/reconcile-branches`](../skills/reconcile-branches/SKILL.md) · [`/cleanup-worktrees-branches`](../skills/cleanup-worktrees-branches/SKILL.md) · [`/cleanup-orca`](../skills/cleanup-orca/SKILL.md) · [`/cleanup-chats`](../skills/cleanup-chats/SKILL.md) · [`/cleanup-disk-space`](../skills/cleanup-disk-space/SKILL.md) · [`/setup-install`](../skills/setup-install/SKILL.md) · [`/security-backend`](../skills/security-backend/SKILL.md) · [`/puff-puff-pass`](../skills/puff-puff-pass/SKILL.md)

## Acceptance and remaining limits

- Verify 60 exact name-matched frontmatter entries, all linking to the shared contract.
- Verify local Markdown links resolve and no active descriptions rely on “Retro switchboard” terminology.
- Review `/relay-room` in three concrete scenarios: existing live director, project known but director not running, and Orca unavailable. In each case, a message receipt must never be mistaken for completed work.
- A static source audit cannot demonstrate command availability, session connectivity, real browser flows, or runtime model usage. Those checks must be run in a connected consumer project and recorded with the actual project/revision.
- The previous [consolidation proposal](consolidation-proposal.md) is **not** implemented by this PR. A future compatibility migration would need alias handling and separate acceptance tests.
