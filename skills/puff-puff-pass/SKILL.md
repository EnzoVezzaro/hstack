---
name: puff-puff-pass
description: "Use when the user types /puff-puff-pass or wants something implemented cheaply and then reviewed by a more powerful model. A free-tier worker builds it, a stronger and different model reviews it, the worker fixes what the review proves, and the result goes back for a final check."
---

# Puff, puff, pass: build cheap, review strong

The V5 rule in one command: a cheap model writes the change, an expensive model only reads it.

## HStack V5 role

Layer 4 worker implements; Layer 3 director reviews; the worker fixes; the director signs off.

**Model tier:** implementation at T0 or T1; review at T2, or T3 for security-sensitive or architectural changes. The reviewer must be a different model from the implementer. See [model-routing.md](../../docs/model-routing.md).

1. Write the acceptance check first, as in `implement-feature`: a test or an observable behavior.
2. **Puff:** a T0 or T1 worker implements the smallest change that passes the check, runs it, and records the result.
3. **Puff again:** the worker reruns the full suite and writes a short note: what changed, why, and what it is unsure about.
4. **Pass:** send the diff, the note, and the acceptance check to a stronger, different model for review with `patch-patrol`. The reviewer reports findings it can show (a failing case, a line, a risk); it does not rewrite the code.
5. The worker fixes each finding. Findings the worker disputes go back to the reviewer with evidence.
6. The reviewer checks the fixes once more. Stop after two review rounds; if findings remain, escalate one tier or ask the user.
7. Nothing is merged or pushed here; hand the approved change to `publish-git`.

## Report

What was built and by which model, the review findings and how each was resolved, the reviewer's model, and the final check result.
