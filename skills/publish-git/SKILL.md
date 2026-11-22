---
name: publish-git
description: "Use when the user asks to commit, push, merge to main, clean up branches or PRs, or publish a release."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer3"
---

# Publish and git

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 3 prepares the change; the owner approves every push and merge. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0 prepares the commit; T2 checks it before the owner approves. See [model-routing.md](references/model-routing.md).

1. **Resolve the scope** from the request or a standing rule in the consumer project's `AGENTS.md`. `commit` is `local` and ends at step 4. `push`, `pr`, `merge`, `deploy`, `release` and `delete` each need their own scope name; do not widen a grant because a later step is technically ready. A scope already authorized in this session is not asked for again.
2. Check git status, the current branch, and what will be included. Make sure no secrets are staged.
3. Run `verify-and-fix` first so the checks pass before anything is committed. Readiness is a technical gate, not permission to push or merge.
4. Commit with a conventional message: `type: description`. **Stop here for `local` scope.** Report the SHA and the unpushed state.
5. Only with `push`, `pr`, or `merge` scope: push the exact named commits to the named remote and branch as preparation for that authorized action. Do not push unrelated commits or other branches. A `release` or `delete` grant does not authorize pushing unrelated work.
6. Only with `pr` or `merge` scope: open or update the named PR. A ready PR does not authorize merging.
7. Only with `merge` scope: merge the named PR into the named target after its gates pass. Only with `delete` scope: close or delete the named merged/abandoned PR or branch.
8. Only with `release` scope: publish the named release or npm version.

## Acceptance checks

- "commit these changes" → exactly one local commit, no push, no PR, no merge; report that nothing left the machine.
- "commit and push to my branch" → local commit plus a push of that branch only; no PR merge.
- "open a PR" → branch, commits and PR; no merge even if checks are green.
- Standing `auto-merge: green-and-approved` with that PR green, approved and conflict-free → the named merge is authorized; do not ask again, and do not merge any other PR.
- "prepare this for release" → reviewable candidate only; no tag, publish, or deploy.

## Report

Scope used and where it came from, commit SHAs, PR or release links, observed checks, and anything left intentionally unpushed or unmerged.
