---
name: break-it-down
description: "Use when the user types /break-it-down, or a task is too big for one agent or one session. Splits it into small units that each end in a verifiable state, with an order, dependencies, the tier that should do each one, and what can run in parallel."
---

# Break it down

## HStack V5 role

Layer 3 (director) splits the work; Layer 4 workers take the units.

**Model tier:** T2 writes the breakdown, because a bad split costs more than a good model. The units it produces should be small enough for T0 or T1. See [model-routing.md](../../docs/model-routing.md).

1. Write the goal and the done condition in one sentence each. If you cannot, ask before splitting.
2. Split into units that each end in a state someone can check: a passing test, a visible screen, a merged diff, a report.
3. Make each unit small enough for one worker in one session. If a unit needs a design decision, make that decision its own unit, done by T2.
4. For each unit, write: what to do, the files or area it owns, how to check it is done, its dependencies, and its tier.
5. Order the units. Mark the ones with no shared files as parallel.
6. If the repo has `.acc/`, attach the `acc context` path each unit needs.

## Report

A numbered list of units, each with owner area, done check, dependencies, tier, and parallel flag. Ready to hand to `coordinate-agents`, `ace-workspace`, or `horizon`.
