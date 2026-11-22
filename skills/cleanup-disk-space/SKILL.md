---
name: cleanup-disk-space
description: "Use when the user asks to free disk space. Measures where the space is used, proposes safe deletions, and deletes only after confirmation."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Clean up disk space

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 measures; the owner confirms every deletion. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](references/model-routing.md).

1. Measure first: find the largest folders in the user's home and the project, and the size of caches, node_modules, build outputs, Docker images, and simulator data.
2. Group the findings into safe (caches, build outputs that can be rebuilt) and needs approval (images, data, anything without a clear rebuild path).
3. Show the list with sizes and ask for confirmation before deleting anything.
4. Delete the approved items. Measure free space again.

## Report

Space before and after, what was deleted, and what was kept and why. Never delete user files or data without explicit approval.
