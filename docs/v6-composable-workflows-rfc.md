# HSTACK v6 RFC — 15 composable workflow commands

Status: proposal only; no v5 behavior changes. Companion to the runtime-agnostic actors RFC (PR #9), and successor to the existing [consolidation audit](consolidation-proposal.md). The current README and router document 62 skills. The owner mandates a maximum of 15 primary commands, including the router, with zero existing commands or capabilities removed.

## Architecture

Expose a small intent-oriented primary surface, not 15 renamed micro-steps. Each entry point owns an end-to-end outcome, with conditional stages and explicit completion criteria. The full existing skill catalog remains installed, individually callable, and discoverable through an advanced catalog/help mode. Preserve names, aliases, paths, contracts, source attribution, and external dependency requirements. The 15 limit applies to the recommended/default HSTACK command surface; native harnesses may expose more legacy commands if they lack visibility controls. Never hide this limitation or delete skills to satisfy a UI count.

## Proposed primary commands and complete workflows

| Command | End-to-end workflow | Existing skills (primary ownership) |
|---|---|---|
| `/hstack` | Resolve intent and project(s) → select and compose workflows → enforce gates → aggregate evidence. | [hstack](../skills/hstack/SKILL.md) |
| `/daily` | Reconcile live state → surface blockers → prioritize and plan → start or close session → persist next actions. | [a-new-day](../skills/a-new-day/SKILL.md), [plan-horizon](../skills/plan-horizon/SKILL.md), [wrap-day](../skills/wrap-day/SKILL.md), [blocker-radar](../skills/blocker-radar/SKILL.md), [420](../skills/420/SKILL.md), [pineapple-express](../skills/pineapple-express/SKILL.md) |
| `/crew` | Discover runtime capabilities → resolve ownership → recover interrupted tasks → select tier and specialist → dispatch → independently verify → hand off. | [relay-room](../skills/relay-room/SKILL.md), [coordinate-agents](../skills/coordinate-agents/SKILL.md), [resume-all](../skills/resume-all/SKILL.md), [resume-work](../skills/resume-work/SKILL.md), [handoff](../skills/handoff/SKILL.md), [token-balancer](../skills/token-balancer/SKILL.md), [proagent-equip](../skills/proagent-equip/SKILL.md), [ace-workspace](../skills/ace-workspace/SKILL.md) |
| `/build` | Scope acceptance → break down → reproduce or baseline → implement/refactor → independent diff review → verify regression and acceptance → report or request ship approval. | [implement-feature](../skills/implement-feature/SKILL.md), [take-one-dude](../skills/take-one-dude/SKILL.md), [verify-and-fix](../skills/verify-and-fix/SKILL.md), [save-point](../skills/save-point/SKILL.md), [patch-patrol](../skills/patch-patrol/SKILL.md), [cleanup-refactor](../skills/cleanup-refactor/SKILL.md), [break-it-down](../skills/break-it-down/SKILL.md), [puff-puff-pass](../skills/puff-puff-pass/SKILL.md) |
| `/screens` | Establish user journey and visual baseline → research/design when requested → run exact build → exercise browser/desktop → review screenshots → repair through build → retest. | [run-local](../skills/run-local/SKILL.md), [visual-test](../skills/visual-test/SKILL.md), [interface-check](../skills/interface-check/SKILL.md), [ui-design](../skills/ui-design/SKILL.md), [antislop-review](../skills/antislop-review/SKILL.md), [haf](../skills/haf/SKILL.md), [let-me-watch](../skills/let-me-watch/SKILL.md) |
| `/horizon` | Define metric/cadence/budget/stop conditions → baseline → execute bounded iterations → measure → retain improvements or revert → checkpoint and stop/escalate. | [stoner](../skills/stoner/SKILL.md), [horizon](../skills/horizon/SKILL.md), [horizon-loop](../skills/horizon-loop/SKILL.md), [horizon-loop-test](../skills/horizon-loop-test/SKILL.md), [horizon-loop-ego-lite](../skills/horizon-loop-ego-lite/SKILL.md) |
| `/discover` | Frame question → collect repository and external evidence → compare options → generate alternatives → recommend or hand off a bounded experiment. | [check-github](../skills/check-github/SKILL.md), [research-explain](../skills/research-explain/SKILL.md), [get-stoned](../skills/get-stoned/SKILL.md) |
| `/words` | Verify source facts → audit docs/search intent → draft or revise → humanize → validate links and claims → produce appropriate text/media deliverable. | [humanize](../skills/humanize/SKILL.md), [docs-content](../skills/docs-content/SKILL.md), [write-readme-opensource](../skills/write-readme-opensource/SKILL.md), [seo-audit](../skills/seo-audit/SKILL.md), [motion-graphic](../skills/motion-graphic/SKILL.md) |
| `/launch` | Define audience and success metric → prepare assets/copy through words/screens → configure consent-aware analytics → verify events → prepare launch → request explicit publication approval → measure. | [set-analytics](../skills/set-analytics/SKILL.md), [product-hunt-launch](../skills/product-hunt-launch/SKILL.md) |
| `/ship` | Inspect exact revision and destination → repair CI → rehearse integration → verify independently → prepare version/changelog → request approval for each external action → publish/deploy → verify live revision → approved cleanup. | [fix-ci](../skills/fix-ci/SKILL.md), [reconcile-branches](../skills/reconcile-branches/SKILL.md), [release](../skills/release/SKILL.md), [publish-git](../skills/publish-git/SKILL.md), [deploy](../skills/deploy/SKILL.md), [cleanup-worktrees-branches](../skills/cleanup-worktrees-branches/SKILL.md) |
| `/guard` | Classify risk → escalate to required tier → audit auth/backend/repo exposure → propose remediation → independently verify → request approval for changes that require it. | [security-backend](../skills/security-backend/SKILL.md), [protect-repo](../skills/protect-repo/SKILL.md) |
| `/housekeeping` | Inventory resources → classify active/unmerged/stale → preserve context and handoffs → dry run → request approval for destructive changes → execute → verify. | [cleanup-orca](../skills/cleanup-orca/SKILL.md), [cleanup-chats](../skills/cleanup-chats/SKILL.md), [cleanup-disk-space](../skills/cleanup-disk-space/SKILL.md) |
| `/own-tools` | Detect ACC/RepoSell applicability → validate prerequisites and context → run relevant tool in safe mode → verify artifacts → gate paid/public actions. | [acc-context](../skills/acc-context/SKILL.md), [reposell-release](../skills/reposell-release/SKILL.md) |
| `/setup` | Resolve projects → discover installed harness/runtime/models and capabilities → install/configure prerequisites → establish tier map → smoke test → report missing capabilities. | [setup-hstack](../skills/setup-hstack/SKILL.md), [setup-install](../skills/setup-install/SKILL.md) |
| `/workbench` | Collect repeatable task evidence → design or revise skill → validate contracts → benchmark isolated environments → compare results → propose changes with evidence. | [skill-workbench](../skills/skill-workbench/SKILL.md), [benchmark](../skills/benchmark/SKILL.md) |

Ownership is for catalog coverage, not exclusive invocation. A workflow can reuse any relevant skill from another group; do not invoke every skill blindly on every run. Across the workflow set every existing capability must be reachable and exercised by tests. Preserve documented legacy aliases, including visual-test variants and plan-day/week/month, by resolving to the same behavior and constraints.

## Execution contract

- Input: named project(s), goal, optional mode, constraints, budget, approval scope and finish criteria. Resolve exact repo/worktree and separate ownership per project before changes.
- Produce a bounded execution graph with stage IDs, skill references, inputs/outputs, dependencies, required capabilities, tier, verification and approval gates. Choose stages by intent, risk and available evidence; record skipped stages and reasons.
- Invoke the canonical skill instructions rather than duplicating them into wrappers. Load lazily, resolve dependencies transitively, detect recursion and avoid duplicate side effects. A workflow may call another workflow only through a bounded subgraph; no router recursion.
- Keep the V5 model-tier rules: cheapest capable execution, escalation for repeated failure/high stakes, return execution to workers, independent reviewer, exact-revision evidence. No workflow may weaken a skill's stricter contract.
- Align with v6 actors/adapters: use capability discovery, durable checkpoints, idempotency keys and one owner per task; Orca is a first-class adapter, not a mandatory hardcoded runtime. Missing capabilities block the affected step with explicit evidence, never simulated success.
- Approval is action-specific: a request to build does not authorize merging, pushing, releasing, deployment, deletion, purchases or other external actions. Pause at the relevant gate, preserve resumable state, and verify after approval.
- Return status (complete/partial/blocked/awaiting approval), revision, stage evidence, reviewer identity, cost/token telemetry when available, skipped stages, and next action. Do not report fabricated checks.

## Examples

- `/build my-app Add password reset and prove it works`: acceptance → security policy via guard → implementation → independent review → tests → browser verification via screens → report; no automatic publish.
- `/ship my-app Release the tested revision to npm`: CI/revision validation → release preparation → explicit publication gate → publish → verify registry/version.
- `/crew repo-a,repo-b Resume interrupted work`: separate owners and scopes, detect real interrupted tasks, resume only where supported, verify evidence.
- `/hstack my-app Improve onboarding conversion`: compose discover, screens, build and launch instrumentation with a bounded metric and approval policy.

## Migration plan

1. Snapshot the actual skills tree, aliases, descriptions, dependencies, contract and test baseline; reconcile against the table above. The table is provisional and based on README/router references, not a fresh filesystem inventory.
2. Add a machine-readable registry (primary commands, canonical skill paths, modes, dependencies and compatibility aliases); validate coverage and max count. Resolve naming collision for existing horizon/hstack via separate workflow entry metadata rather than replacing the underlying skill.
3. Implement compositional wrappers and adapter-aware execution; preserve old direct invocations. Generate primary menu/help and full advanced catalog from the registry. Use harness-specific display filtering only where supported; don't conflate model invocation metadata with UI visibility.
4. Add a primary-workflows installer profile that includes all transitive skills and dependencies; legacy installation remains supported. Missing external capabilities must be diagnosed, not silently installed or faked.
5. Add routing, workflow and compatibility tests; update README, documentation, examples and generated visuals only after validation. Keep V5 stable until owner approval and v6 release.

## Acceptance gates

- [ ] At most 15 primary entries including /hstack; no hidden extra primary entries.
- [ ] 100% coverage of current skills tree and documented aliases; no existing skill file or callable behavior removed; automated registry/tree equality check and duplicate ownership check.
- [ ] Every primary route has a realistic end-to-end fixture with conditional stage selection, evidence and finish criteria; every underlying skill has at least one exercised route or direct compatibility fixture.
- [ ] Cross-workflow reuse works, no recursion, no duplicate dispatch or irreversible action after retry/resume.
- [ ] Multi-repo isolation, runtime capability gaps, independent review and explicit approval gates tested.
- [ ] Legacy slash invocation and install compatibility tested across supported harnesses; native menu limitations documented; prove at least Orca and one non-Orca runtime with actual execution evidence before release.
- [ ] Compare v5/v6 task success, routing accuracy, loaded tokens, latency and costs on identical tasks; no invented results, no mandatory full-catalog load. Preserve capabilities and avoid quality regression; document tradeoffs.
- [ ] No merge or release without owner approval.

## Non-goals

Deleting commands, flattening the skill contracts, forcing all 62 skills into every run, introducing a mandatory orchestration vendor, or shipping this RFC as implemented functionality.
