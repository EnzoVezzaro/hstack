---
name: patch-patrol
description: "Retro night watch for changes. Use when Enzo says /patch-patrol, before handing back a meaningful implementation, when Enzo asks whether a change is safe, or when a PR needs review and CI follow-through. Composes the installed review family: review, review-bugbot and review-security, with autopilot only for requested PR follow-through."
---

# Patch patrol · walk the diff with a flashlight

## HStack V5 role

Layer 3 reviews a diff independently, separate from the worker who wrote it. See [hstack-v5.md](../../docs/hstack-v5.md).

New H Stack composition. Source skills: `review`, `review-bugbot`, `review-security`; optional `autopilot` for PR follow-through.

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

Use `autopilot` only when Enzo asks to track a PR through CI or review milestones. Re-check new commits because they change the reviewed revision. Never merge, publish, or deploy unless asked.
