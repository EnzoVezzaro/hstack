# Workflow consolidation · audit and proposal (draft)

This is a proposal, not a release plan. It proposes a smaller set of user-facing workflows for H Stack while keeping the current capability, source provenance, multi-repo routing, and Orca-first behavior. One low-risk consolidation is implemented in this branch; the rest is left for the owner to accept or reject.

## Evidence boundary

- I read every `skills/*/SKILL.md` file on this branch, plus `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `docs/hstack-v5.md`, `docs/workflows.md`, `docs/workflow-map.md`, `docs/source-skills.md`, `docs/skill-usage.md`, and `docs/model-routing.md`. Classification below is based on the instructions themselves, not on skill names.
- `docs/skill-usage.md` explicitly limits the invocation record: the Orca bridge audit starts 2026-11-17, the 4.7 GB OpenCode store was not indexed, and no complete skill-load ledger exists (`docs/skill-usage.md`, "Sources and coverage" and "Evidence gaps"). Missing invocation data is therefore **not** evidence that a workflow is unused or should be deleted. No deletion in this proposal rests on usage counts.
- `docs/workflow-map.md` already separates observed activity from new compositions, and records that three earlier proposed names were removed rather than kept to reach a count. This proposal follows that rule: consolidation is driven by repeated behavior and functional overlap, never by a target number.
- H Stack stays multi-repo and Orca-first. Every proposed top-level workflow keeps the `/hstack <project>` project-first rule and the Orca session/worktree checks from `skills/hstack/SKILL.md`, "Project-first routing" and "Shared rules".

## Baselines

Measured at `92598ae` (the branch point from `main`):

| Metric | Baseline | Command |
| --- | ---: | --- |
| `SKILL.md` files | 61 | `find skills -name SKILL.md \| wc -l` |
| Total lines | 1,821 | `find skills -name SKILL.md -print0 \| xargs -0 wc -l \| tail -1` |
| Total words | 18,094 | `find skills -name SKILL.md -print0 \| xargs -0 wc -w \| tail -1` |
| Skills that declare a parent W workflow in their own body | 25 | `grep -rn 'This skill \(extends\|covers\)' skills --include=SKILL.md \| wc -l` |
| Skills marked `disable-model-invocation` | 0 | `grep -rl disable-model-invocation skills --include=SKILL.md \| wc -l` |
| README skill-count mentions | 6 | `grep -n '61' README.md` (one is an animation coordinate) |

The 25 self-declarations are the strongest single signal of fragmentation: those files say they are part of a W workflow (`docs/workflows.md` W1–W11) yet are installed as top-level slash skills. The per-file line and word counts are in the tables below.

## Comparison with T Stack and P Stack

Fetched on 2026-11-22 into a scratch directory (not committed):

- T Stack: `t3dotgg/tstack` — 9 `SKILL.md` files, catalogued in `tstack/README.md`.
- P Stack: `backnotprop/pstack` — 61 `SKILL.md` files. `cursor/plugins/pstack` returned `Not Found` when cloned, so the synced mirror was used; `pstack/MIRROR.md` states it mirrors `cursor/plugins/pstack` with harness-neutral edits, and the header of `pstack/README.md` carries the same notice. P Stack is cited for structure only; no T or P prose was copied into this proposal or any H Stack file.

What the comparison shows:

1. **T Stack keeps one canonical flow and makes variants thin.** `tstack/skills/full-stop/SKILL.md` explicitly directs the reader to `../full-send/SKILL.md` and then lists only its overrides; it does not restate the parent workflow. H Stack instead duplicates shared skeletons in separate top-level files. The two platform variants in H Stack are the clearest example (see the similarity data below).
2. **T Stack publishes an explicit composition graph.** `tstack/README.md` has a short "Some skills call others" section. H Stack has the same idea at `README.md`, "Some skills call others", but pairs it with a much larger flat menu.
3. **P Stack has one clear front door and small principles alongside its playbooks.** The official [`cursor/plugins/pstack`](https://github.com/cursor/plugins/tree/main/pstack) catalog lists 24 short `principle-*` files; they are referenced by `/poteto-mode` and carry `disable-model-invocation: true` so they do not compete for automatic routing. They remain in the README catalog and can still be invoked directly; P Stack does not hide them from users. H Stack has 61 files and zero reference-only markers: every micro-step is a top-level skill.
4. **P Stack does not fill gaps with invented workflows.** `pstack/README.md`, "why are there no planning skills?", declines to add a category when the harness already covers it. H Stack's `docs/workflow-map.md` makes the same move with `field-notes`, `launch-runway`, and `portfolio-radio`. This proposal therefore does not introduce new route names; it only regroups existing ones.

Consequence: the useful structural lesson is *thin variants + reference-only steps*, not "copy the other stack's catalog" and not "reduce to their skill counts". H Stack's role tiers, Orca routing, and `<project>` rule are its own and stay intact.

## Overlap measurements

I tokenized each `SKILL.md` body (frontmatter and a small stopword list removed) and compared all 1,830 pairs by Jaccard similarity and by containment of the smaller file. Highest pairs:

| Pair | Jaccard | Containment of smaller | Reading |
| --- | ---: | ---: | --- |
| `visual-test-ego-lite` ↔ `visual-test-computer-use` | 0.408 | 0.716 | Same workflow, different driver. Implemented below. |
| `a-new-day` ↔ `wrap-day` | 0.338 | 0.546 | Same live-Orca reconciliation pattern; different time framing and report. Keep as two modes of one daily workflow, do not merge yet. |
| `horizon-loop-ego-lite` ↔ `horizon-loop-test` | 0.303 | 0.488 | Two specializations of `horizon-loop` with a different metric. Keep as named modes. |
| `handoff` ↔ `resume-work` | 0.298 | 0.467 | Both read last state and write a next step; distinct handoff vs continue triggers. Keep separate, cross-reference. |
| `docs-content` ↔ `product-hunt-launch` | 0.278 | 0.571 | Launch reuses doc verification and copy rules. Keep launch distinct; make docs rules a reference. |
| `cleanup-orca` ↔ `reconcile-branches` | 0.258 | 0.448 | `cleanup-orca` delegates merges to `reconcile-branches` (`skills/cleanup-orca/SKILL.md`, step 4). Composition, not duplication. |
| `check-github` ↔ `research-explain` | 0.240 | 0.479 | `check-github` says to use `research-explain` for the broader question. Specialization, not duplicate. |
| `cleanup-worktrees-branches` ↔ `reconcile-branches` | 0.198 | 0.609 | Same: cleanup calls the merge engine. Composition. |

This is a triage instrument only. A high score is not a deletion order; several high pairs are deliberate caller/callee or platform pairs.

## Audit of all 61 skills

Classes:

- **Router** — entry point that owns shared rules.
- **Complete** — self-contained multi-stage workflow with its own report; may compose other skills.
- **Micro-step** — short linear sub-procedure; mostly declares a parent W workflow (`docs/workflows.md`) or is called by a parent.
- **Specialization** — explicitly a parent workflow with one changed metric or scope.
- **Independent** — distinct trigger and outcome, no parent workflow.
- **Platform variant** — same user job, different driver.

### Router (1)

| Source path | Lines/Words | Why | Proposed home |
| --- | ---: | --- | --- |
| `skills/hstack/SKILL.md` | 99 / 1,179 | Routes every task, owns project-first and shared rules; 60-row route table. | Stays top-level; route table shrinks to the 15 workflows. |

### Complete workflows (21)

| Source path | Lines/Words | Why | Proposed home |
| --- | ---: | --- | --- |
| `skills/stoner/SKILL.md` | 63 / 799 | Own cycle, settings, stop conditions, per-cycle report; orchestrates six skills. | `horizon` (mode `stoner`) |
| `skills/take-one-dude/SKILL.md` | 33 / 609 | Resolve target → finish line → probe → honest stop; a full execution path. | `build` (mode `solo`) |
| `skills/interface-check/SKILL.md` | 33 / 345 | Inspect → bounded repair → retest; "New H Stack composition" at line 14. | `screens` |
| `skills/relay-room/SKILL.md` | 42 / 414 | Find live line → decide operator → handoff → integrate → report; composition at line 14. | `crew` |
| `skills/patch-patrol/SKILL.md` | 36 / 354 | Fix target → walk diff → verify outcome → PR follow-through; composition at line 14. | `build` (reference) |
| `skills/save-point/SKILL.md` | 35 / 386 | Regression boundary → repair → verify real action; synthesized composition. | `build` (reference) |
| `skills/skill-workbench/SKILL.md` | 36 / 348 | Collect evidence → decide → write → report confidence; composition at line 14. | Stays independent (`workbench`) |
| `skills/set-analytics/SKILL.md` | 45 / 743 | Settings → detect → install → identify → events → proxy → consent → verify. | `launch` (mode `instrument`) |
| `skills/reconcile-branches/SKILL.md` | 40 / 540 | Inventory → classify → test merges → plan → rehearse → land. | `ship` |
| `skills/token-balancer/SKILL.md` | 34 / 502 | One-time and periodic review, read-only, per-project recommendation. | `crew` (reference) |
| `skills/420/SKILL.md` | 47 / 519 | Music → ChatGPT → Oreja → new sesh; own settings block. | `daily` (mode `sesh`) |
| `skills/horizon/SKILL.md` | 33 / 377 | Run prompt, cadence, end date, scheduler, activation gate. | `horizon` |
| `skills/horizon-loop/SKILL.md` | 28 / 276 | Metric, limits, baseline, iterate, stop; parent of two specializations. | `horizon` |
| `skills/get-stoned/SKILL.md` | 31 / 364 | Assumptions → generate → score → pick → prototype. | `discover` (mode `diverge`) |
| `skills/haf/SKILL.md` | 32 / 344 | Brief → source sweep → annotated references → directions → moodboard. | `screens` (mode `inspiration`) |
| `skills/pineapple-express/SKILL.md` | 30 / 323 | List → sort → close → park → stop processes → one approval batch. | `daily` (mode `wind-down`) |
| `skills/puff-puff-pass/SKILL.md` | 26 / 303 | Cheap build → strong review → fix → final check; calls `implement-feature` and `patch-patrol`. | `build` (mode `puff-puff-pass`) |
| `skills/a-new-day/SKILL.md` | 32 / 267 | Gather live Orca state → present four-part brief → focus order. | `daily` (mode `morning`) |
| `skills/blocker-radar/SKILL.md` | 25 / 232 | Scan → classify evidence → owner and next action. | `daily` (mode `blockers`) |
| `skills/plan-horizon/SKILL.md` | 32 / 278 | Input picture → day/week/month shape → advisory output. | `daily` (mode `plan`) |
| `skills/wrap-day/SKILL.md` | 26 / 208 | Reconcile shift → verified vs reported → next step. | `daily` (mode `evening`) |

### Micro-steps / references (27)

Every row marked W declares that parent in its own line 8 (`docs/workflows.md` W1–W11).

| Source path | Lines/Words | Declared parent | Proposed home |
| --- | ---: | --- | --- |
| `skills/implement-feature/SKILL.md` | 25 / 193 | W1 | `build` |
| `skills/verify-and-fix/SKILL.md` | 24 / 172 | W2 | `build` (reference) |
| `skills/coordinate-agents/SKILL.md` | 26 / 256 | W3 | `crew` |
| `skills/handoff/SKILL.md` | 25 / 176 | W3 | `crew` (reference) |
| `skills/resume-work/SKILL.md` | 24 / 173 | W3 | `crew` (reference) |
| `skills/research-explain/SKILL.md` | 24 / 153 | W4 | `discover` |
| `skills/publish-git/SKILL.md` | 25 / 179 | W5 | `ship` |
| `skills/deploy/SKILL.md` | 25 / 201 | W5 | `ship` (mode `deploy`) |
| `skills/fix-ci/SKILL.md` | 24 / 188 | W5 | `ship` (mode `ci`) |
| `skills/cleanup-worktrees-branches/SKILL.md` | 24 / 184 | W5 | `ship` (mode `cleanup`) |
| `skills/run-local/SKILL.md` | 24 / 148 | W6 | `screens` (reference) |
| `skills/docs-content/SKILL.md` | 23 / 143 | W7 | `words` |
| `skills/humanize/SKILL.md` | 24 / 185 | W7 | `words` (reference) |
| `skills/write-readme-opensource/SKILL.md` | 26 / 210 | W7 | `words` (mode `readme`) |
| `skills/seo-audit/SKILL.md` | 24 / 168 | W7 | `words` (mode `seo`) |
| `skills/product-hunt-launch/SKILL.md` | 24 / 199 | W7 | `launch` (mode `list`) |
| `skills/setup-install/SKILL.md` | 23 / 130 | W8 | `setup` (mode `deps`) |
| `skills/cleanup-refactor/SKILL.md` | 24 / 159 | W9 | `build` (mode `refactor`) |
| `skills/cleanup-disk-space/SKILL.md` | 23 / 158 | W9 | `housekeeping` |
| `skills/ui-design/SKILL.md` | 24 / 151 | W10 | `screens` (mode `design`) |
| `skills/antislop-review/SKILL.md` | 24 / 164 | W10 | `screens` (reference) |
| `skills/motion-graphic/SKILL.md` | 24 / 158 | W10 | `words` (mode `motion`) |
| `skills/security-backend/SKILL.md` | 24 / 161 | W11 | Stays independent (`guard`) — high-stakes, T3 |
| `skills/release/SKILL.md` | 24 / 227 | — | `ship` (mode `release`) |
| `skills/acc-context/SKILL.md` | 26 / 254 | — | `own-tools` (reference used by four skills) |
| `skills/break-it-down/SKILL.md` | 23 / 250 | — | `build` (reference) |
| `skills/let-me-watch/SKILL.md` | 28 / 378 | — | `screens` (mode `watch`) |

### Specializations (3)

| Source path | Lines/Words | Evidence | Proposed home |
| --- | ---: | --- | --- |
| `skills/horizon-loop-test/SKILL.md` | 25 / 254 | Line 8: "A `horizon-loop` where the metric is the test suite." | `horizon` (mode `tests`) |
| `skills/horizon-loop-ego-lite/SKILL.md` | 25 / 233 | Line 8: metric is real browser flows. | `horizon` (mode `browser-loop`) |
| `skills/check-github/SKILL.md` | 27 / 228 | Line 8 sends broader questions to `research-explain`. | `discover` (mode `github`) |

### Independent workflows (7)

| Source path | Lines/Words | Why it stays distinct | Proposed home |
| --- | ---: | --- | --- |
| `skills/cleanup-orca/SKILL.md` | 39 / 459 | Orca-specific snapshot, workspace states, terminals; calls `reconcile-branches`. | `housekeeping` |
| `skills/cleanup-chats/SKILL.md` | 31 / 394 | Codex/ChatGPT thread inventory and archive; distinct data source. | `housekeeping` |
| `skills/protect-repo/SKILL.md` | 25 / 242 | Own CLI (`rs`) and license choice; one PR per repo. | `guard` |
| `skills/reposell-release/SKILL.md` | 26 / 260 | Own CLI, Stripe secrets, paid-publication gate. | `own-tools` |
| `skills/proagent-equip/SKILL.md` | 25 / 225 | Own CLI, profile selection before dispatch. | `crew` (reference) |
| `skills/ace-workspace/SKILL.md` | 24 / 215 | Own CLI, dry-run crew workspace across projects. | `crew` (mode `setup`) |
| `skills/setup-hstack/SKILL.md` | 29 / 268 | Writes the `## hstack models` map; first-install gate. | `setup` |

### Platform variants (2)

| Source path | Lines/Words | Evidence | Proposed home |
| --- | ---: | --- | --- |
| `skills/visual-test-ego-lite/SKILL.md` | 24 / 196 | W2; same flow steps, Ego Lite driver. | Merged into `skills/visual-test/SKILL.md` (browser mode) |
| `skills/visual-test-computer-use/SKILL.md` | 25 / 292 | W2; same flow steps, native-window driver. | Merged into `skills/visual-test/SKILL.md` (desktop mode) |

## Proposed smaller structure

Fifteen top-level workflows. Existing files become named modes or references inside them; nothing is deleted to hit this number.

| Top-level workflow | Modes / references from existing files | Independent files kept |
| --- | --- | --- |
| `hstack` | Router table points at the 15 workflows; shared rules unchanged | `skills/hstack/SKILL.md` |
| `daily` | `morning` (a-new-day), `plan` (plan-horizon), `evening` (wrap-day), `blockers` (blocker-radar), `sesh` (420), `wind-down` (pineapple-express) | — |
| `crew` | `relay-room`, `coordinate-agents`, `resume-work`, `handoff`, `break-it-down`, `token-balancer`, `setup` (ace-workspace), reference `proagent-equip` | — |
| `build` | `implement-feature`, references `verify-and-fix`, `patch-patrol`, `save-point`, `break-it-down`, modes `solo` (take-one-dude), `puff-puff-pass`, `refactor` (cleanup-refactor) | — |
| `screens` | `interface-check`, `visual-test` (browser / desktop), `run-local`, `watch` (let-me-watch), `design` (ui-design), references `antislop-review`, `inspiration` (haf) | — |
| `horizon` | `horizon`, `horizon-loop`, modes `tests`, `browser-loop`, `stoner` | — |
| `discover` | `research-explain`, `github` (check-github), `diverge` (get-stoned) | — |
| `words` | `docs-content`, references `humanize`, modes `readme`, `seo`, `motion` | — |
| `launch` | `list` (product-hunt-launch), `instrument` (set-analytics) | — |
| `ship` | `publish-git`, `reconcile-branches`, modes `ci`, `deploy`, `cleanup`, `release` | — |
| `guard` | `security-backend` (T3, independent inside the workflow), `protect-repo` | — |
| `housekeeping` | `cleanup-orca`, `cleanup-chats`, `cleanup-disk-space` | — |
| `own-tools` | `acc-context` (reference), `reposell-release` | — |
| `setup` | `setup-hstack`, mode `deps` (setup-install) | — |
| `workbench` | — | `skills/skill-workbench/SKILL.md` |

### Counts and risk

| | Before | After (proposed) |
| --- | ---: | ---: |
| User-facing top-level skills | 61 | 15 |
| On-disk `SKILL.md` files | 61 | 60 (one variant merged; the rest retained as modes/references) |
| Files marked reference-only (suggested, not applied) | 0 | ~27 (`disable-model-invocation: true`, following the P Stack reference pattern) |

Migration risk:

- **Low** — merging two variants that share a skeleton and differ only by driver (implemented here).
- **Medium** — turning a W-labeled micro-step into a mode/reference while keeping its trigger text in the parent description. Old slash names change, so the router and README must be updated together.
- **High** — collapsing complete workflows with different reports (`a-new-day` / `wrap-day`, `research-explain` / `check-github`, `cleanup-orca` / `cleanup-worktrees-branches`). Deferred: the overlap is in the shared evidence-gathering shape, not in the outcome. Usage gaps mean we cannot currently prove which trigger matters more.

No capability or source is lost in the proposal: `docs/source-skills.md` attributions and the "Not shipped here" list in `README.md` remain accurate because the same upstream skills are still named inside the parent files.

## Implemented in this branch: one variant merge

`skills/visual-test-ego-lite/SKILL.md` and `skills/visual-test-computer-use/SKILL.md` are replaced by `skills/visual-test/SKILL.md`.

Why this one:

- Highest measured overlap of any pair (Jaccard 0.408, 71.6% of the smaller file).
- Both declare the same parent (W2, `skills/*/SKILL.md` line 8), the same V5 layer and model tier, and the same failure report and handoff to `verify-and-fix`.
- The only semantic difference is the driver. The merged file keeps both drivers as explicit, non-interchangeable modes and preserves the mode-specific constraints: logged-in sessions in Ego Lite; programmatic-first, exact build relaunch, accessibility tree, and no system settings or secrets in computer use.
- Capability and provenance are preserved. The old names survive as aliases in the description and in this proposal; the upstream `ego-browser` / `orca-computer-use` sources remain named in the body and in `docs/source-skills.md` / `README.md`, "Not shipped here".

References updated: the router in `skills/hstack/SKILL.md`, `README.md` (badge, menu, examples, co-install table, all skill counts), `docs/hstack-v5.md`, `docs/workflows.md`, `skills/stoner/SKILL.md`, and the two animation source scenes that print skill names. No rendered GIF/PNG was regenerated; those assets are unchanged.

### After-baseline and checks run for this branch

| Metric | Before | After |
| --- | ---: | ---: |
| `SKILL.md` files | 61 | 60 |
| Total lines | 1,821 | 1,812 |
| Total words | 18,094 | 18,080 |

Checks actually run:

- `find skills -name SKILL.md | wc -l` → 60.
- `grep -R 'visual-test-ego-lite\|visual-test-computer-use' --exclude-dir=.git .` → only the alias line in `skills/visual-test/SKILL.md` and historical notes in this proposal; no live route or link points at a removed file.
- `grep -R '61 skills\|skills-61\|all 61\|61 instruction' README.md` → no matches.
- Local Markdown relative-link check over every `*.md`: 307 links resolved, 0 broken.
- `node --check` on both changed animation scenes → OK. No rendered GIF/PNG was regenerated.
- `git diff --check` → clean.
- No runtime test suite exists in this repository; no tests were claimed or run.
