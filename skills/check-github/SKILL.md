---
name: check-github
description: "Use when the user types /check-github or asks to search GitHub: find repos, code, issues, or examples for a tool or technique."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Check GitHub

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## Purpose

A focused search on GitHub. For a broader question that needs the web and an explanation, use `research-explain`.

## HStack V5 role

Layer 4 searches; Layer 3 makes the recommendation when one is asked for.

**Model tier:** T0 searches and reads; T2 only for a recommendation that drives a decision. See [model-routing.md](references/model-routing.md).

1. Turn the request into search terms and filters (language, stars, recent activity).
2. Search with the GitHub CLI:
   - repos: `gh search repos "<terms>" --sort stars --limit 20`;
   - code: `gh search code "<terms>" --language <lang>`;
   - issues and PRs: `gh search issues "<terms>"` or `gh search prs "<terms>"`.
3. For the top three to five, check the last commit date, open issues, license, and README. Read the source files that matter, not only the README.
4. Rank them on fit for the user's case first, then activity, then stars.
5. Make no changes and clone nothing unless the user asks.

## Report

A table: repo, stars, last activity, license, fit, link. Then the top pick with the reason, and what you could not confirm.
