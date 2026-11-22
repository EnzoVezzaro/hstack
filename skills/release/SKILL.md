---
name: release
description: "Use when the user types /release or asks to make a new release: pick the next version, write the changelog from what actually changed, tag it, and create the GitHub release. Publishing to npm or other registries happens only on explicit request."
---

# Release

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## HStack V5 role

Layer 3 prepares and checks the release; the owner approves the tag going public.

**Model tier:** T0 gathers commits and drafts notes; T2 reviews the version and notes. See [model-routing.md](../../docs/model-routing.md).

1. Make sure you are on the release branch (usually `main`), up to date, with a clean tree.
2. Find the last tag (`git describe --tags --abbrev=0`) and list what changed since: commits and merged PRs.
3. Propose the next version with semver: breaking change means major, a feature means minor, fixes only mean patch. The user can override.
4. Run `verify-and-fix` checks on that exact commit.
5. Draft the release notes from the real changes, grouped as added, changed, fixed. Run them through `humanize`.
6. Show the version and notes. After the user approves: create an annotated tag, push it, and run `gh release create <tag> --notes-file <file>`.
7. Publish to npm or another registry only if the user asked. If the repo uses `reposell`, hand the paid release to `reposell-release`.

## Report

Version, tag, release link, the notes, and anything not published.
