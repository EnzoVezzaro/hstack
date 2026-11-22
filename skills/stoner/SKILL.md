---
name: stoner
description: "Use when the user types /stoner or asks for stoner mode: a hands-off loop that checks every Orca repo, checks the open PRs on each, ranks the work, keeps agents working through the queue until it is empty, then checks the PRs again. Pushes fixes to PR branches on its own; merges, closes, deletes, and deploys only with a yes or a standing rule."
---

# Stoner mode

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

Set it and walk away. One cycle: **scan Orca repos → check PRs on each → prioritize → work the queue until it's empty → check PRs again.** The loop keeps going until you stop it, the budget runs out, or there is nothing left to do.

## HStack V5 role

Layer 2 (Orca) supplies repos, workspaces, and agents; Layer 3 ranks the queue and accepts results; Layer 4 workers do the tasks; the owner approves merges and anything else that can't be undone.

**Model tier:** scans at T0; prioritizing at T2, because a bad queue wastes the whole loop; tasks start at T0 or T1 and escalate by the rules. See [model-routing.md](../../docs/model-routing.md).

## Settings

Read an optional `## stoner` block in `AGENTS.md` (project or `~/.claude/AGENTS.md`). Defaults in brackets:

- `repos`: which Orca repos to include [all visible repos];
- `max workers`: parallel agents [3];
- `auto-merge`: `never` or `green-and-approved` [never];
- `idle wait`: minutes to wait when the queue is empty [30];
- `stop after`: hours or cycles before stopping on its own [8 hours];
- `quiet hours`: when to pause [none].

## One cycle

1. **Scan Orca.** `orca repo list --json` for the repos, `orca worktree ps --json` for workspaces and agent states. Map each repo path to its GitHub name with `gh repo view --json nameWithOwner` run in that path. Skip repos without a GitHub remote.
2. **Check the PRs on each repo.** `gh pr list --repo <owner/name> --state open --json number,title,headRefName,isDraft,mergeable,reviewDecision,statusCheckRollup,updatedAt,url`. For anything red or blocked, get the detail: `gh pr checks <n> --repo <owner/name>` and the review comments with `gh pr view <n> --repo <owner/name> --comments`.
3. **Turn each PR into tasks:** fix failing checks, answer review comments, resolve merge conflicts, finish an unfinished change, or mark it ready to merge. Add live Orca workspaces with work in progress that have no PR yet.
4. **Prioritize, once per cycle.** Rank the tasks across all repos:
   1. anything blocking other work or a release;
   2. PRs that are one fix away from mergeable (red CI on an approved PR, one open review thread);
   3. review comments waiting on us, oldest first;
   4. merge conflicts, before they grow;
   5. the rest, small before large.
   Respect the owner's priorities from `AGENTS.md` or today's `plan-horizon`. Split big items with `break-it-down`. Give each task a tier, an owner, and a done check.
5. **Work the queue.** Dispatch tasks in order with `coordinate-agents`, never more than `max workers` at once:
   - failing checks → `fix-ci`;
   - review comments and unfinished changes → `implement-feature` or `verify-and-fix`, reviewed with `puff-puff-pass`;
   - conflicts and merge-ready sets → `reconcile-branches`;
   - UI changes → `visual-test` with the matching platform mode before they count as done.
   A task is done only with evidence: green checks, resolved threads, a passing run. Push the fix to the PR's own branch. Escalate a task that fails twice; park it with a `handoff` brief if it fails at T2.
6. **Merge only what is allowed.** Merge-ready PRs go into one list for the owner. Merge without asking only when `auto-merge: green-and-approved` is set and the PR is green, approved, and conflict-free. Never force-push, never merge into a protected branch against its rules.
7. **Restart.** When the queue is empty or everything left waits on the owner, go back to step 1. If nothing changed since the last cycle, wait `idle wait` minutes first and stay quiet.

## Keeping it running

- In Claude Code, run the cycle under `/loop` and let it pace itself.
- For multi-day runs, schedule the cycle with `horizon` (a Codex automation by default) and an end date.
- Write each cycle to a log (for example `~/.hstack/stoner/log.md`): repos scanned, PRs seen, the queue, what got done, what waits on the owner.

## Stop when

- the owner says stop, or `stop after` is reached;
- the budget in `AGENTS.md` would be exceeded;
- the same task fails three cycles in a row (park it and move on);
- a step needs an action that only the owner can approve and nothing else is left to do. Ask once with the full list and keep the loop alive for new PRs.

## Report

Per cycle, only when something changed: PRs fixed, merged, or waiting on the owner, tasks parked with their briefs, and the next cycle time. At the end: totals across cycles and anything still open.
