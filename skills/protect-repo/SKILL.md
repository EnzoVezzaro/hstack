---
name: protect-repo
description: "Use when the user asks to protect a repo from AI training, add a license and AI-training notice, 'shield' repos, or prepare a repo before making it public. Opens a Repo Shield protection pull request for each repo with the rs CLI."
---

# Protect a repo with Repo Shield

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

Uses [Repo Shield](https://github.com/EnzoVezzaro/repo-shield): a signed LICENSE, an explicit AI-training NOTICE, a machine-readable policy, and a weekly watch workflow. It deters; it cannot block scrapers. Say that plainly if the user expects more.

## HStack V5 role

Layer 4 runs the CLI at T0; the owner picks the license and merges the pull request.

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. Install the CLI if missing: `npm i -g @reposell/repo-shield` (installs `rs`).
2. Check the session with `rs whoami`. If not signed in, run `rs login`; the user approves the device code in the browser. Never handle their password.
3. Ask which license to use if it is not set: `mit`, `isc`, `unlicense`, `apache-2.0`, or `gpl-3.0`. Do not choose one for them.
4. Run `rs protect owner/repo --license <id>`, or list several repos. Use `--all` only when the user asks for every repo.
5. Each repo gets one pull request on a `repo-shield/protect` branch. Nothing reaches the default branch until the owner merges.
6. If Repo Shield's own `repo-shield` skill is installed, follow it for details.

## Report

Repos protected, pull request links, license used, and any repo that failed.
