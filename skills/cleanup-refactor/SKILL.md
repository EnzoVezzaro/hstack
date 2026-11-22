---
name: cleanup-refactor
description: "Use when the user asks to remove unused code, files, or resources, or to refactor without changing behavior. Not for unrelated work."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Clean up and refactor

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 does the refactor in small steps; Layer 3 reviews any behavior change. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0 deletes; T1 refactors; T2 reviews any behavior change. See [model-routing.md](references/model-routing.md).

1. Find unused code and files by searching for references. Use a dead-code tool if the project has one.
2. Propose the list before deleting.
3. Delete in small steps. Run the tests after each one.
4. Refactor only where tests cover the behavior. Behavior must not change.
5. Ask before deleting anything outside the code: images, caches, containers, or data.

## Report

What was removed or refactored, the test results, and what was left alone and why.
