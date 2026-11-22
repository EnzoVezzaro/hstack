---
name: interface-check
description: "Real runtime inspection for user-facing interfaces. Use when the owner says /interface-check, reports visual disorder, broken UI, responsive defects, inaccessible interaction, or asks for a real browser or app review. Composes impeccable, antislop-ui, antislop-human, orca-computer-use and orchestrated-visual-remediation; a diff alone never counts as a visual pass."
---

# Interface check — observed interface defects

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## HStack V5 role

Layer 5 (Ego Lite or computer use) inspects the real screen; Layer 3 decides the fixes. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T1 inspects; T2 decides design fixes. See [model-routing.md](../../docs/model-routing.md).

Optional upstream references (use only when installed): `impeccable`, `antislop-ui`, `antislop-human`, `orca-computer-use`, `orchestrated-visual-remediation`.

## Inspect before editing

1. Read the repo's design system and interface instructions together with `impeccable`, `antislop-ui`, and `antislop-human` when people-facing interaction is involved.
2. Pin the exact route, screen, state, viewport, and revision. Look at the running app first: use the project's browser/e2e tooling, and `orca-computer-use` only when the target is a native window or browser chrome that code cannot inspect.
3. Record concrete findings with reproduction steps and user impact. Separate functional, layout, copy, responsive, accessibility, and polish issues.
4. For multi-part work, follow `orchestrated-visual-remediation`: read-only audit first, then disjoint implementation owners, then an independent retest by the director. Do not delegate speculative defects.

## Repair in bounded passes

- Tie each fix to an observed finding. Follow existing tokens and component patterns; preserve working behavior and current user changes.
- Prefer a focused repair over a redesign. Run one batched inspection (relevant viewports together), fix what it shows in one batch, confirm with at most one more round, then stop.
- Use the contrast checker from `antislop-human` for any color pairing that cannot be verified by eye; check keyboard use and responsive sizes when relevant.

## Retest and close

- Reopen the current served revision at the original route and viewport and repeat the original interaction.
- Label the evidence: browser automation result, screenshot inspection, or real-device check are not interchangeable.
- Finish with findings fixed, findings remaining, route/state/revision checked, and evidence collected. Never claim a visual pass from a source diff alone.
