---
name: write-readme-opensource
description: "Use when the user asks to prepare a project for open source: README, LICENSE, CONTRIBUTING, and setup instructions. Writes accurate docs from the code, not from plans."
---

# Write open-source README

This skill extends the **W7 Contenido, productos y docs** workflow.

## HStack V5 role

Layer 4 writes from the code; the owner chooses the license. See [hstack-v5.md](../../docs/hstack-v5.md).

1. Read the code, the scripts, and the existing docs. Describe only what the code does today.
2. Write the README: what it is, who it is for, install and run steps tested on a clean checkout, and a short usage example.
3. Add LICENSE only with the owner's chosen license. Ask if it is not set.
4. Add CONTRIBUTING with how to run tests and open a PR.
5. Check for secrets, personal paths, and internal names before anything is public. Use `security-backend` for that check.
6. Run each install and run command exactly as written in the README.

## Report

Files written, the commands run to verify them, and any placeholder the owner must fill in.
