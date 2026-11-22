---
name: motion-graphic
description: "Use when the user asks for a motion graphic, animated explainer, title card, or short video made with code."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Motion graphics

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 builds the composition; Layer 1 confirms the message and format with the owner. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T1 builds; T2 checks the message. See [model-routing.md](references/model-routing.md).

1. Define the message, duration, aspect ratio, and the output file. Ask once if any is missing.
2. Load `hyperframes` for the workflow, then `hyperframes-core` for the composition contract and `hyperframes-animation` for motion.
3. Use `hyperframes-registry` before building a named effect by hand.
4. Add audio only if the user asks, using `media-use` and `hyperframes-audio`.
5. Preview, check the frames at key moments, then render.

## Report

Output file path, duration, aspect ratio, render command used, and the frames checked.
