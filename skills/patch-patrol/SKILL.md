---
name: patch-patrol
description: "Independent code and change review. Use when the owner says /patch-patrol, before handing back a meaningful implementation."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer3]
---

# Patch patrol — independent diff review

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Independent code and change review.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/patch-patrol <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 3 reviews a diff independently, separate from the worker who wrote it. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T2 reviews, using a different model from the author. See [model-routing.md](../../docs/model-routing.md).

Optional upstream references (use only when installed): `review`, `review-bugbot`, `review-security`; optional `autopilot` for PR follow-through.

## Fix the target

- Identify the exact repo, branch, diff, and revision. Include uncommitted changes only when they are part of the requested patch.
- Read project instructions and relevant contracts before reviewing. Review independently of the implementation report; "tests passed" without a command and observed result is a claim, not evidence.

## Walk the diff

- Use the installed `review` skill to choose the review path. Use `review-security` for security-relevant changes; use `review-bugbot` only when that path is explicitly wanted and the reviewer is actually available.
- Look for behavioral defects, regressions, data loss, security issues, missing error handling, and tests that fail to protect user-visible behavior.
- State severity, affected file or area, triggering condition, and why it matters. Separate confirmed findings from questions, style preferences, and risks that need runtime evidence.
- Do not invent findings to fill a report. If none are demonstrated, say so and describe the scope examined.

## Verify the user's outcome

- Choose the smallest test, build, browser, or device check that proves the requested behavior.
- Run it on the reviewed revision; report actual commands and results, or clearly mark reported results you could not reproduce.
- For visual or interactive behavior, hand off to [interface-check](../interface-check/SKILL.md) for the post-integration pass.

## PR follow-through

Use `autopilot` only when the owner asks to track a PR through CI or review milestones. Re-check new commits because they change the reviewed revision. Never merge, publish, or deploy unless asked.
