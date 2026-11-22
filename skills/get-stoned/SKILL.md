---
name: get-stoned
description: "Use when the user types /get-stoned or asks to think outside the box: new ideas for a product, feature, or problem."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Get stoned: divergent thinking

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## Purpose

Structured idea generation. Go wide first, judge later, and keep the strange ideas long enough to see whether one of them is the good one.

## HStack V5 role

Layer 4 workers generate ideas in parallel; Layer 3 judges them and picks what to prototype.

**Model tier:** generate at T0 and T1, with more than one model for variety; judge at T2. See [model-routing.md](references/model-routing.md).

1. State the problem in one sentence and the constraint that matters most (time, money, users, tech). If the user gave a solution instead of a problem, ask what problem it solves.
2. List the assumptions everyone is making about the problem. Flip each one and ask what would follow.
3. Generate ideas with several prompts, at least five ideas each:
   - **borrow:** how would another field solve this (games, logistics, biology, finance, music)?
   - **extremes:** what if it had to work with no budget, or with unlimited budget, or in one day?
   - **remove:** what if the main feature did not exist?
   - **invert:** how would you make the problem worse, and what is the opposite of that?
   - **random input:** pick an unrelated object or word and force a connection.
4. Keep every idea in the list at first, including the absurd ones. Do not judge while generating.
5. Score each idea on impact, effort, and novelty (1 to 5). Mark the ones that could be tested in a day.
6. Pick two or three: one safe, one bold, and one strange one that still scored well. For each, describe the smallest prototype or experiment that would prove it.
7. Make no code changes. Hand the chosen ideas to `break-it-down` or `implement-feature` if the user wants to build one.

## Report

The problem, the flipped assumptions, the full idea list with scores, the two or three picks with their first experiment.
