---
name: research-explain
description: "Use when the user asks to research a library, repository, or market, or asks why a component works the way it does."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Research and explain

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 gathers evidence; Layer 3 decides on the recommendation. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0 gathers sources; T2 makes the recommendation. See [model-routing.md](references/model-routing.md).

1. State the question in one sentence.
2. Search the web and GitHub (for example `gh search repos` and `gh search code`). Compare the top candidates on fit, activity, license, and maintenance.
3. Read the source, not only the README, for anything you recommend.
4. Explain the mechanism. Separate what is verified from what is inferred.
5. Make a recommendation with the main unknowns.

## Report

Question, candidates compared, recommendation, evidence with links, and unknowns. Make no code changes.
