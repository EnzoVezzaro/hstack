---
name: publish-git
description: "Use when the user asks to commit, push, merge to main, clean up branches or PRs, or publish a release. Runs verify-and-fix first and does nothing outward-facing without explicit approval."
---

# Publish and git

This skill covers the **W5 Publicar y git** workflow.

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
