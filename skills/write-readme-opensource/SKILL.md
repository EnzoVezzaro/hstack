---
name: write-readme-opensource
description: "Use when the user asks to prepare a project for open source: README, LICENSE, CONTRIBUTING, and setup instructions. Not for unrelated work."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Write open-source README

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to prepare a project for open source: README, LICENSE, CONTRIBUTING, and setup instructions.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/write-readme-opensource <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 4 writes from the code; the owner chooses the license. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 writes; T2 checks for leaks before it goes public. See [model-routing.md](../../docs/model-routing.md).

1. Read the code, the scripts, and the existing docs. Describe only what the code does today.
2. Write the README: what it is, who it is for, install and run steps tested on a clean checkout, and a short usage example.
3. Add LICENSE only with the owner's chosen license. Ask if it is not set.
4. Add CONTRIBUTING with how to run tests and open a PR.
5. Check for secrets, personal paths, and internal names before anything is public. Use `security-backend` for that check.
6. Offer `protect-repo` so the repo goes public with a license and an AI-training notice.
7. Run each install and run command exactly as written in the README.

## Report

Files written, the commands run to verify them, and any placeholder the owner must fill in.
