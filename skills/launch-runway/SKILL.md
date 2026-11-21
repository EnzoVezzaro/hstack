---
name: launch-runway
description: "Release and launch preparation workflow. Use when Enzo says /launch-runway, asks to prepare, verify, or follow through on a software release, deployment, publication, or product launch."
---

# Launch Runway · release desk

New HStack composition for getting a change ready to ship. A push, merge, release, deployment, publication, purchase, or external announcement happens only when the user explicitly authorizes that action.

## Pin the target

1. Confirm repository, checkout, branch, intended destination, and exact commit or working tree.
2. Read release instructions, versioning rules, CI workflow, and current change state. Preserve unrelated edits.
3. Build a gate list from the repository’s documented release contract; do not invent passing criteria after seeing the results.

## Prove the candidate

- Run only relevant documented checks and report their exact commands and outcomes.
- Review the final diff and metadata that affect the release, including version, generated files, changelog, permissions, and target environment.
- Inspect CI for the exact commit; a local pass does not prove CI passed.
- For provider-backed behavior, verify provider state separately from local configuration.
- For visual or interactive changes, use **Pixel Check** and inspect the real route and state at the needed viewports.
- Record flaky, missing, skipped, or uncleanly exiting checks as such.

## Ship only with the user’s instruction

When the user explicitly asked to ship, perform only the named external action after the gates above. Verify the resulting remote ref, release, deployment, publication, or announcement. Keep the result separate from source-level evidence. If the user asked only to prepare, stop at a reviewable candidate and list what is needed to ship.

## Report

Include repository and commit, checks and evidence, release/deployment/provider state actually observed, actions performed, and remaining gates. Never call a build or a green test suite a production release.
