---
name: blocker-radar
description: "Current blocker scan for project work. Use when the owner says /any-blockers, asks whether anything is blocked, or wants a blocker scan across active Orca work. Not for unrelated work."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer1"
---

# Blocker radar — current project blockers

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## Purpose

Current blocker scan for project work.

## HStack V5 role

Layer 1 finds the blockers; Layer 2 (Orca) shows owners and live state. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0 finds blockers; T2 when a blocker needs a decision. See [model-routing.md](references/model-routing.md).

Codex is the personal assistant. Inspect live Orca agent and worktree state plus recent project messages. Silence is not evidence of a blocker.

## Scan

- Check agents explicitly marked blocked or waiting, unanswered director or supervisor questions, failed acceptance checks, missing access, and dependencies named in the latest project report.
- Verify the blocker belongs to current work. Mark old, stale, or superseded blockers as such.
- Distinguish **reported blocker**, **observed failure**, **possible risk**, and **no evidence of a blocker**.
- For each blocker, record project, owner, what is waiting, impact, and the smallest next action. Say whether the owner, a director, a worker, or an external dependency owns it.

## Report

Lead with the blockers, then a short list of projects checked with no known blocker. If the next action is an external message or a project change, recommend it without sending or changing anything unless the owner asks.
