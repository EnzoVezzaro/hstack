---
name: skill-workbench
description: "Retro burn bay for turning a repeated run into a portable workflow. Use when Enzo says /skill-workbench, asks to create a skill, encode a repeated task, or standardize a workflow from recent project history. Uses the installed skill-creator guide and local evidence; never invents preferences, tools, or successful outcomes."
---

# Skill workbench · burn a new workflow

New H Stack composition. Source skill: `skill-creator`.

## Collect evidence first

- Search local session history in a stated time window for repeated examples. Inventory installed skills in global and project-local folders; deduplicate copies and ignore vendored dependency trees.
- Distinguish **invocation** (a recorded tool call), **exact-name mention** (the name appears in text, a brief, or a file path), and **inference** (behavior matches a trigger without either). Record which kind supports each conclusion.
- Capture user corrections, tool order, repo instructions, inputs, outputs, failure modes, and stop conditions. Mark gaps instead of filling them with invented policy.

## Decide whether a workflow is warranted

- Prefer a small skill for a stable task with a recognizable trigger and a repeatable output.
- If evidence is sparse or conflicting, say so and draft only the supported core. Do not turn one unusual incident into a universal rule.
- State the skill's name, scope, dependencies, and source skills, including when another installed skill is required.

## Write it

- Follow the installed `skill-creator` guidance and standard `SKILL.md` frontmatter; put the trigger in the description and keep the body procedural.
- Include file and user-data preservation, verification evidence, and the completion report where they are part of the real workflow.
- Link to source skills and evidence notes in H Stack. Do not copy unrelated proprietary or vendored skill bodies.

## Report confidence

State the window searched, what appears repeated, and what remains inference. Counts of mentions or copied files are not counts of successful invocations.
