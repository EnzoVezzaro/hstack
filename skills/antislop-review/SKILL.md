---
name: antislop-review
description: "Use when the user asks to check a UI, copy, or code for generic AI-generated patterns."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Antislop review

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 applies the rules; Layer 3 decides on the requested exceptions. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](references/model-routing.md).

1. Load the `antislop` core rules. Then load the matching part: `antislop-ui` for interfaces, `antislop-copywriting` for text, `antislop-code` for code comments, `antislop-human` for accessibility, `antislop-layoutmobile` for responsive layouts.
2. Scan the artifact against those rules. Note each hit with its location.
3. Keep anything the user asked for explicitly, even if it matches a pattern. The user's words win.
4. Fix the hits that are not requested. Keep the change set small.
5. Recheck the changed parts.

## Report

Each hit with location and rule, what was fixed, and what was kept on purpose.
