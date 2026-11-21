---
name: blocker-radar
description: "Retro signal scanner for stuck work. Use when Enzo says /any-blockers, asks whether anything is blocked, or wants a blocker scan across active Orca work. Reports what is waiting, who owns it, the evidence, and the next useful action."
---

# Blocker radar · signal scanner

Codex is the personal assistant. Inspect live Orca agent and worktree state plus recent project messages. Silence is not evidence of a blocker.

## Scan

- Check agents explicitly marked blocked or waiting, unanswered director or supervisor questions, failed acceptance checks, missing access, and dependencies named in the latest project report.
- Verify the blocker belongs to current work. Mark old, stale, or superseded blockers as such.
- Distinguish **reported blocker**, **observed failure**, **possible risk**, and **no evidence of a blocker**.
- For each blocker, record project, owner, what is waiting, impact, and the smallest next action. Say whether Enzo, a director, a worker, or an external dependency owns it.

## Report

Lead with the blockers, then a short list of projects checked with no known blocker. If the next action is an external message or a project change, recommend it without sending or changing anything unless Enzo asks.
