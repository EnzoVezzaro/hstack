---
name: write-readme-opensource
description: "Use when the user asks to prepare a project for open source: README, LICENSE, CONTRIBUTING, and setup instructions. Not for unrelated work."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Write open-source README

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 writes from the code; the owner chooses the license. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0 writes; T2 checks for leaks before it goes public. See [model-routing.md](references/model-routing.md).

1. Read the code, the scripts, and the existing docs. Describe only what the code does today.
2. Write the README: what it is, who it is for, install and run steps tested on a clean checkout, and a short usage example.
3. Add LICENSE only with the owner's chosen license. Ask if it is not set.
4. Add CONTRIBUTING with how to run tests and open a PR.
5. Check for secrets, personal paths, and internal names before anything is public. Use `security-backend` for that check.
6. Offer `protect-repo` so the repo goes public with a license and an AI-training notice.
7. Run each install and run command exactly as written in the README.

## Report

Files written, the commands run to verify them, and any placeholder the owner must fill in.
