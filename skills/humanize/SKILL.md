---
name: humanize
description: "Use when the user asks to make text sound human, to remove AI writing patterns, or to review prose before publishing."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Humanize text

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 rewrites with the free model; the owner approves the final text. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0. Escalate to T2 for launch copy or anything legal. See [model-routing.md](references/model-routing.md).

1. Load the `humanizer` skill and follow its rules. Where it is not installed, use the rules in `antislop-copywriting`.
For marketing copy, also apply `copy-editing` from [marketingskills](https://github.com/coreyhaines31/marketingskills) if it is installed.
2. Keep every fact, number, name, and link. Do not add claims.
3. Remove the patterns it lists, strongest first: contrast staging, dashes everywhere, forced triads, inflated claims, stock words, and bold labels.
4. Read the result once as the intended reader. Cut any sentence that adds nothing.

## Report

The rewritten text, a short list of the patterns removed, and any claim you could not verify and left unchanged.
