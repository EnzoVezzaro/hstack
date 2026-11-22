# Source skills and dependencies

This is the dependency record for the published catalog. A **bundled** capability is another H Stack skill in this repository; an **external** capability lives outside it; an **optional** capability is used only when the named tool or installed source skill is actually available.

**Tool versus source skill:** installing a source-skill folder such as `orca-cli` does not install the Orca CLI, and installing `ego-browser` does not install Ego Lite. Tools are host software and must be obtained separately. Where a source has no verified local provenance it is marked **locally discoverable / provenance unverified**, not bundled.

Nothing here claims that a capability is installed, enabled, or was used historically. When one is missing, the workflow continues with an equivalent verified tool and says so, or prepares a clearly **NOT SENT** brief. See the bundled [execution contract](skill-contract.md) and [skill usage](skill-usage.md) for evidence limits.

## Install and payload

Each published skill is self-contained: its required contract, V5 roles and model-routing references are generated into `references/` from this repository's `docs/` source. `npx skills add EnzoVezzaro/hstack`, a raw `cp`, and [`scripts/install/install.sh`](../scripts/install/install.sh) all produce that shape; no adjacent root `docs/` folder is needed.

```bash
git clone https://github.com/EnzoVezzaro/hstack.git
cd hstack
npx skills add EnzoVezzaro/hstack
# or: scripts/install/install.sh --all --skills-root ~/.claude/skills
# or: cp -R skills/* ~/.claude/skills/
```

Installing a skill does **not** install the other skills it mentions, or any external tool. Companion-skill links are optional. Helper scripts (`benchmark`, `token-balancer`, `resume-all`, `validate-repo`) require this repository checkout; they are not copied by an installer and no standalone helper payload is claimed.

## Full catalog

| Skill | Bundled companions (install separately) | External / optional capability | Obtain / status |
| --- | --- | --- | --- |
| `420` | resume-work, let-me-watch | Apple Music / YouTube, ChatGPT app and Oreja (external apps, not skills) | external desktop apps; user install |
| `a-new-day` | — | live Orca CLI (tool, not a source skill) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `acc-context` | — | `acc` CLI (tool); only for repos with `.acc/` | user install / host tool; see the skill prerequisites |
| `ace-workspace` | — | `ace-proagents` / `proagent` CLIs (tools) | user install / host tool; see the skill prerequisites |
| `antislop-review` | — | `antislop` source-skill family and copywriting sources (not bundled; provenance not verified here) | not bundled; locally discoverable, provenance unverified unless documented upstream |
| `benchmark` | — | optional `skillevaluator` (tool); other frameworks are references only | user install / host tool; see the skill prerequisites |
| `blocker-radar` | — | live Orca CLI (tool, not a source skill) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `break-it-down` | — | ACC when a repo has `.acc/`; ACE CLI (tool) when used | user install / host tool; see the skill prerequisites |
| `check-github` | — | GitHub CLI `gh` (tool) | install <https://cli.github.com> and authenticate |
| `cleanup-chats` | acc-context | ChatGPT app plus `acc-context` for repos with `.acc/` | external desktop apps; user install |
| `cleanup-disk-space` | — | none | n/a |
| `cleanup-orca` | reconcile-branches, handoff | live Orca CLI (tool) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `cleanup-refactor` | verify-and-fix | none | n/a |
| `cleanup-worktrees-branches` | reconcile-branches | live Orca CLI (tool) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `coordinate-agents` | relay-room, verify-and-fix, publish-git, proagent-equip, ace-workspace | `proagent` / ACE CLIs (tools) when specialist profiles are used | user install / host tool; see the skill prerequisites |
| `deploy` | verify-and-fix | target platform CLI/API chosen from the project (tool) | user install / host tool; see the skill prerequisites |
| `docs-content` | — | `antislop` and copywriting sources (not bundled; provenance not verified here) | user install / host tool; see the skill prerequisites |
| `fix-ci` | verify-and-fix | GitHub CLI `gh` (tool) or platform CI API | install <https://cli.github.com> and authenticate |
| `get-stoned` | — | none | n/a |
| `haf` | interface-check, ui-design | `ego-browser` / browser access (tool) | install the `ego-browser` skill or use an existing browser; Ego Lite is a separate tool |
| `handoff` | acc-context | live Orca CLI (tool) for discovery/delivery; optional `acc-context` | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `horizon` | break-it-down | live Orca CLI (tool); optional `orca-cli` source skill; a scheduler | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `horizon-loop` | — | none | n/a |
| `horizon-loop-ego-lite` | horizon-loop, verify-and-fix | `ego-browser` / Ego Lite (tool); browser access | install the `ego-browser` skill or use an existing browser; Ego Lite is a separate tool |
| `horizon-loop-test` | horizon-loop, verify-and-fix | none | n/a |
| `hstack` | all routes it names | none | n/a |
| `humanize` | — | `humanizer` source skill plus copywriting sources (not bundled; provenance not verified here) | not bundled; locally discoverable, provenance unverified unless documented upstream |
| `implement-feature` | verify-and-fix | ACC when a repo has `.acc/` | user install / host tool; see the skill prerequisites |
| `interface-check` | verify-and-fix | optional `impeccable`, `antislop-ui`, `antislop-human`, `orca-computer-use` source skills | not bundled; locally discoverable, provenance unverified unless documented upstream |
| `let-me-watch` | run-local | local browser or emulator (tool) | install the `ego-browser` skill or use an existing browser; Ego Lite is a separate tool |
| `motion-graphic` | — | `hyperframes` and `media-use` source skills (not bundled) | not bundled; locally discoverable, provenance unverified unless documented upstream |
| `patch-patrol` | interface-check, verify-and-fix | optional `review`, `review-bugbot`, `review-security`, `autopilot` source skills | not bundled; locally discoverable, provenance unverified unless documented upstream |
| `pineapple-express` | handoff, wrap-day, cleanup-orca, cleanup-chats | live Orca CLI (tool) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `plan-horizon` | — | live Orca CLI (tool, not a source skill) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `proagent-equip` | — | `proagent` CLI (tool); reposell CLI where named | user install / host tool; see the skill prerequisites |
| `product-hunt-launch` | humanize, motion-graphic, ui-design | `antislop` and copywriting sources (not bundled; provenance not verified here) | user install / host tool; see the skill prerequisites |
| `protect-repo` | — | Repo Shield CLI (tool) | user install / host tool; see the skill prerequisites |
| `publish-git` | verify-and-fix | npm CLI (tool) when publishing a package | user install / host tool; see the skill prerequisites |
| `puff-puff-pass` | implement-feature, patch-patrol, publish-git | none | n/a |
| `reconcile-branches` | verify-and-fix, cleanup-worktrees-branches | live Orca CLI (tool) and GitHub CLI `gh` (tool) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `relay-room` | — | live Orca CLI (tool); optional `orca-cli` / `orchestration` source skills | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `release` | verify-and-fix, humanize | GitHub CLI `gh` (tool); npm when publishing a package | install <https://cli.github.com> and authenticate |
| `reposell-release` | protect-repo | `reposell` CLI (tool) | user install / host tool; see the skill prerequisites |
| `research-explain` | — | GitHub CLI `gh` (tool) | install <https://cli.github.com> and authenticate |
| `resume-all` | resume-work, token-balancer | live Orca CLI (tool, not a source skill); optional `orca-cli` source skill | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `resume-work` | acc-context | live Orca CLI (tool, not a source skill) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `run-local` | — | `ego-browser` or built-in browser (tool) | install the `ego-browser` skill or use an existing browser; Ego Lite is a separate tool |
| `save-point` | — | none | n/a |
| `security-backend` | verify-and-fix | none | n/a |
| `seo-audit` | — | none | n/a |
| `set-analytics` | run-local, publish-git | PostHog wizard `npx @posthog/wizard@latest` or connected PostHog MCP (tool) | user install / host tool; see the skill prerequisites |
| `setup-hstack` | — | agent CLIs it detects; browser/computer-use tools when assigned | install the `ego-browser` skill or use an existing browser; Ego Lite is a separate tool |
| `setup-install` | — | none | n/a |
| `skill-workbench` | — | `skill-creator` source skill: discover locally; not verified as a built-in | not bundled; locally discoverable, provenance unverified unless documented upstream |
| `stoner` | coordinate-agents, fix-ci, verify-and-fix, puff-puff-pass, reconcile-branches, break-it-down, handoff, horizon | live Orca CLI (tool) and GitHub CLI `gh` (tool) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `take-one-dude` | implement-feature, verify-and-fix | none | n/a |
| `token-balancer` | — | live Orca CLI quota surfaces (tool, not a source skill) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `ui-design` | interface-check | `antislop-ui` source skill (not bundled) | not bundled; locally discoverable, provenance unverified unless documented upstream |
| `verify-and-fix` | patch-patrol, save-point | none | n/a |
| `visual-test` | run-local, verify-and-fix | `ego-browser` (tool) for browser mode; computer use (tool) for native mode | install the `ego-browser` skill or use an existing browser; Ego Lite is a separate tool |
| `wrap-day` | — | live Orca CLI (tool, not a source skill) | install Orca (<https://github.com/stablyai/orca>); verify with `orca --help` |
| `write-readme-opensource` | protect-repo | none | n/a |

## Notes on evidence

The catalog was designed from observed work; the new route names are not historic installed skill names. `benchmark`, `resume-all`, and `take-one-dude` are compositions added after the audit. See [workflow map](workflow-map.md) and [skill usage](skill-usage.md).

P-Stack (<https://github.com/cursor/plugins/tree/main/pstack>) and T-Stack (<https://github.com/t3dotgg/tstack>) are external structural references only. This repository does not vendor their skills or require them.
