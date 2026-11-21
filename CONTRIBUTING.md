# Contributing to H Stack

H Stack's workflows are small operating procedures. A useful change makes a real repeated task easier to start, safer to complete, or easier to verify.

## Before editing

1. Read the relevant `SKILL.md`, `docs/workflow-map.md`, and `docs/skill-usage.md`.
2. Keep historic evidence separate from a new workflow idea. Say when a route is a synthesis or a proposal.
3. Preserve the user's existing files and stated ownership boundaries.

## Changing a workflow

- Keep one clear trigger, a short sequence, concrete stop conditions, and an honest report format.
- Name source skills only when the workflow depends on them; keep their instructions in their own upstream files.
- Keep irreversible actions behind an explicit user instruction.
- Update the playbook router, workflow map, and source-skill map when adding or renaming a route.
- Use lowercase kebab-case folder and `name` values that match.

## Changing the artwork

The README uses a static fallback image at `assets/h-stack-banner.png` and an original light-only loop at `assets/h-stack-loop.gif`, shown through a `<picture>` element that falls back to the still image for reduced-motion viewers. Keep both at the same framing, keep the code/AI/gaming cues prominent, and keep the High/cannabis cue subtle. Do not restore the old rejected animation.
