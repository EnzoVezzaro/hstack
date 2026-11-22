---
name: publish-git
description: "Use when the user asks to commit, push, merge to main, clean up branches or PRs, or publish a release."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer3]
---

# Publish and git

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to commit, push, merge to main, clean up branches or PRs, or publish a release.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/publish-git <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 3 prepares the change; the owner approves every push and merge. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 prepares the commit; T2 checks it before the owner approves. See [model-routing.md](../../docs/model-routing.md).

1. Check git status, the current branch, and what will be included. Make sure no secrets are staged.
2. Run `verify-and-fix` first so the checks pass before anything is committed.
3. Commit with a conventional message: `type: description`.
4. Push with `-u`. Merge to main only when the PR is ready or the user asks.
5. Close stale PRs or delete branches only after confirming they are merged or abandoned.
6. Publish to npm or create a release only with explicit approval, since it is outward-facing.

## Report

Commit SHAs, PR or release links, and anything left open.
