---
name: reposell-release
description: "Use when the user asks to sell a repository, set up reposell, cut a paid release, run the reposell audit, or publish a listing."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Sell a repo with reposell

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## Purpose

Uses [reposell](https://github.com/EnzoVezzaro/reposell), the repository-to-repository listing protocol: signed releases, a `/sell` storefront, and Stripe Payment Links. No server, no database.

## HStack V5 role

Layer 4 runs the CLI and the checks at T0 or T1; Layer 3 reviews the audit at T2; the owner approves anything involving money or a public listing.

**Model tier:** T0 or T1 runs the gates; T2 reviews the audit. See [model-routing.md](references/model-routing.md).

1. Install the CLI if missing: `npm install -g @reposell/cli`.
2. For a new repo: `reposell init` with the user present. The wizard asks for a Stripe Payment Link and secret key. The user enters secrets themselves; never paste them into chat, files, or commits.
3. Check licensing first: `reposell audit` and `reposell license check`. A BLOCKED result stops here.
4. Declare the release: `reposell release <tag> --price <n>`, with the price the user gave.
5. Run the gates: `reposell validate`, then `reposell health`.
6. Show the user the release, price, and gate results. Run `reposell publish <tag>` and `reposell listing publish` only after they say yes.
7. Suggest `protect-repo` first if the repo has no license or AI-training notice.

## Report

Release tag, price, audit and gate results, what was published, and anything waiting on the owner.
