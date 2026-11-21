# Contributing to HStack

HStack's workflows are small operating procedures. A useful change makes a real repeated task easier to start, safer to complete, or easier to verify.

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

The README animation is generated with Python and Pillow:

```bash
python3 -m pip install Pillow
python3 scripts/generate_readme_gif.py
```

Keep it legible at a 384-pixel width, low-noise, and small enough to load quickly in the README.
