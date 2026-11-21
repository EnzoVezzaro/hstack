# Skill usage · last month

**Window:** 2026-10-21 → 2026-11-21 (UTC).
**Question answered:** which installed skills and behaviors justify the H Stack workflows, and how strong is each signal?

## Evidence key

| Label | Meaning |
| --- | --- |
| **Invoked** | A recorded tool call loaded or ran that exact skill (`Skill` tool, or Orca CLI `skills get`). |
| **Mentioned** | The exact name appears in text, a handoff, or a file path; no matching tool call. |
| **Inferred** | Behavior matches a skill's trigger, with neither a name nor a call. |
| **Thread-only** | The name appears only in the current Orca thread instruction. Not historic usage. |

Nothing below is promoted across tiers. In particular, a mention is never counted as an invocation, and no "historic skill" is invented to populate a workflow.

## Sources and coverage

- 91 local Claude Code session transcripts under `~/.claude/projects`; 63,140 records inside the window, 0 parse errors.
- Orca bridge audit: 108 records, but only **2026-11-17 → 2026-11-21** — the October part of the window is not covered.
- `orca agent list --json`: 30 sessions (`opencode2` 17, `opencode` 7, `codex` 6).
- Installed-skill inventory: 132 unique `SKILL.md` names across the global skill roots. Presence on disk is not use.

## Invoked — recorded calls

| Skill | Count | Evidence |
| --- | ---: | --- |
| `ego-browser` | 16 | `Skill` tool calls, including subagents, 2026-11-16 → 11-17. |
| `orchestration` | 5 + 2 | Five `Skill` calls (11-15 → 11-16) plus two Orca CLI `skills get orchestration` loads on 11-20. |
| `impeccable` | 2 | `Skill` calls at 2026-11-17 21:33 Z, paired with antislop skills in a UI task. |
| `antislop` | 2 | Same paired UI task. |
| `antislop-ui` | 2 | Same paired UI task. |
| `orca-computer-use` | 1 | `Skill` call at 2026-11-16 16:18 Z. |
| `orca-cli` | 1 | Orca CLI `skills get orca-cli --json` at 2026-11-20 22:48 Z. |

These are call records, not success records; a loaded guide is not proof the work succeeded.

## Mentioned — exact name, no call

| Name | Count | What it actually was |
| --- | ---: | --- |
| `review-security` | 4 | Report filename `review-security.md` in worker handoffs on 2026-11-17 — an artifact path, not a skill load. |
| `antislop-copywriting` | 2 | A docs reference to `skills/antislop-copywriting/SKILL.md` in the same UI task. |

Excluded as false positives: `error-handling` (one generic phrase, "error-handling bug") and `computer-use` (one line of CLI text inside an already-loaded guide). Counting them would manufacture usage.

## Inferred — behavior without a name or call

- **Orca coordination → relay-room sources.** A five-worker dispatch wave on 2026-11-20 (`make-audit-five-20261120`), repeated `status --json` / `worktree list` / `terminal list` probes, `worker_done` waits, and an E2E review dispatch on 2026-11-21. The pattern matches `orca-cli` + `orchestration` even where the guide was not explicitly loaded.
- **Visual audit and repair → pixel-check sources.** The 2026-11-17 paired `impeccable` + `antislop` + `antislop-ui` calls are invoked, not inferred; the *delegated remediation and independent retest* shape around them is inferred from the same sessions.
- **Independent review → patch-patrol sources.** The 2026-11-17 handoff writing findings to `review-security.md` and running `npm test` (337/337) shows a review artifact and a verification step. Which reviewer ran remains unproven.
- **Regression pattern → save-point.** User-message mining found `audit` (240 hits) and `verify` (127 hits) across the window, and the current thread explicitly asks for a regression workflow synthesized from observed behavior. A specific prior-version incident is described in the adjacent reference repo but was **not** independently confirmed in these transcripts; it is not used as primary evidence.
- **Skill authoring → skill-workbench.** An Orca session titled "Project-Aware Copywriting Skill Generator" (`opencode2`, done) shows authoring behavior. No `skill-creator` call was recorded, so its use is inference only.

## Thread-only names — no historic usage

`relay-room`, `pixel-check`, `patch-patrol`, `save-point`, `skill-workbench`, `a-new-day`, `plan-horizon`, `wrap-day`, `blocker-radar`, and the slash forms `/plan-day`, `/plan-week`, `/plan-month`, `/any-blockers` produced **zero** matches in the searched transcripts and local command configs. The routes were specified in the current Orca thread and adjacent reference playbook (reference only, not the target). These are new H Stack compositions, not recovered historic skills.

The adjacent reference also lists larger counts such as `impeccable` 62 and `orca-cli` 35; those are exact-name conversation matches, not invocation counts, and are deliberately not reused here.

## Why these workflows anyway

The engineering workflows are justified by the **combination** of invoked source skills and inferred behavior, not by claims that their new names were used before. Save Point and Skill Workbench rest on inferred user behavior only. The four daily workflows are user-specified routines over live Orca state; their authority comes from the current request. The earlier draft also proposed `field-notes`, `launch-runway`, and `portfolio-radio` over recurring activity patterns; with no invoked, mentioned, or inferred tier behind them, they were removed rather than kept to reach a skill count.

## Evidence gaps

- Orca audit starts 2026-11-17, so October coordination behavior is unmeasured; the window is effectively ~5 days for Orca and ~1 month for Claude transcripts.
- No complete machine-readable skill-load ledger exists locally; `Skill` tool calls are the closest proxy and miss Orca-side or other-harness loads.
- The 4.7 GB OpenCode local store was not indexed; OpenCode-side skill invocations are not counted.
- Sessions on other machines or outside the local index are not covered.
- No model, cost, or billing data was inspected; this report makes no price or ranking claims.
