---
name: skill-workbench
description: "Skill design from observed repeatable work. Use when the owner says /skill-workbench, asks to create a skill, encode a repeated task."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer1]
---

# Skill workbench — evidence to reusable procedure

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Skill design from observed repeatable work.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/skill-workbench` — name the target project and keep the work bounded.

## HStack V5 role

Layer 1 (assistant) turns a repeated, evidenced task into a skill; Layer 3 reviews it. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T2 drafts the skill; T0 checks the examples. See [model-routing.md](../../docs/model-routing.md).

Optional upstream references (use only when installed): `skill-creator`.

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
