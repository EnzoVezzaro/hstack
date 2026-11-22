---
name: save-point
description: "Regression diagnosis using a verified known-good baseline. Use when the owner says /save-point, reports a feature that used to work, asks what changed, or considers a rollback. Synthesized from observed user behavior in project work; it is not an installed global skill and does not assume a single historic incident."
---

# Save point — restore verified behavior

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## HStack V5 role

Layer 4 compares with the last good version; Layer 3 decides the repair. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T1. Escalate to T2 when the cause spans several releases. See [model-routing.md](../../docs/model-routing.md).

This workflow was **synthesized from observed user behavior** — repeated instructions to compare with a previously working version, restore the configured behavior, and verify the real user action. It is a new H Stack composition, not a historic installed skill. Evidence and its limits are in `docs/skill-usage.md`.

## Find the regression boundary

1. Restate the behavior that used to work and the behavior observed now. The user's own settings and real path are the acceptance contract.
2. Find the last known-good tag, commit, build, or artifact and verify its identity. Do not rely on memory or an agent's summary.
3. Compare the smallest relevant code, configuration, permission, packaging, and runtime changes between that baseline and the current revision.
4. Reproduce the failure on the current revision where possible. Separate a source-level cause from a stale build, environment, permission, or unsupported platform.

## Repair at the source

- Prefer restoring the earlier working path or fixing the cause; remove newly introduced setup steps that are not essential to the requested behavior.
- Respect the settings the user selected. Do not force a different product behavior to hide a defect.
- Preserve unrelated files and in-flight worker edits.
- Treat a rollback as an option only after stating what it would revert and which valid fixes it would discard.

## Verify the real action

- Re-run the same user action on the repaired revision, including activation and release/restore behavior.
- Test independent triggers and modes separately, then together.
- Use live browser, audio, or device evidence when the claim depends on it. A unit test or successful build alone cannot prove the real behavior works.
- Report the previous/current version comparison, the changed cause, the repair, the evidence, and any remaining platform limits.
