---
name: patch-patrol
description: "Independent code and change review. Use when the owner says /patch-patrol, before handing back a meaningful implementation."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer3"
---

# Patch patrol — independent diff review

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## Purpose

Independent code and change review.

## HStack V5 role

Layer 3 reviews a diff independently, separate from the worker who wrote it. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T2 reviews, using a different model from the author. See [model-routing.md](references/model-routing.md).

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
