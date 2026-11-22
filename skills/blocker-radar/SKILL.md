---
name: blocker-radar
description: "Current blocker scan for project work. Use when the owner says /any-blockers, asks whether anything is blocked, or wants a blocker scan across active Orca work. Not for unrelated work."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer1]
---

# Blocker radar — current project blockers

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Current blocker scan for project work.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/blocker-radar` — name the target project and keep the work bounded.

## HStack V5 role

Layer 1 finds the blockers; Layer 2 (Orca) shows owners and live state. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 finds blockers; T2 when a blocker needs a decision. See [model-routing.md](../../docs/model-routing.md).

Codex is the personal assistant. Inspect live Orca agent and worktree state plus recent project messages. Silence is not evidence of a blocker.

## Scan

- Check agents explicitly marked blocked or waiting, unanswered director or supervisor questions, failed acceptance checks, missing access, and dependencies named in the latest project report.
- Verify the blocker belongs to current work. Mark old, stale, or superseded blockers as such.
- Distinguish **reported blocker**, **observed failure**, **possible risk**, and **no evidence of a blocker**.
- For each blocker, record project, owner, what is waiting, impact, and the smallest next action. Say whether the owner, a director, a worker, or an external dependency owns it.

## Report

Lead with the blockers, then a short list of projects checked with no known blocker. If the next action is an external message or a project change, recommend it without sending or changing anything unless the owner asks.
