---
name: run-local
description: "Use when the user asks to run the app locally or open localhost to see it. Starts the project, checks the main path, and reports the URL. Not for unrelated work."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer4"
---

# Run and test locally

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 4 starts the project; Layer 5 (Ego Lite) can take over the browser check. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](references/model-routing.md).

1. Use the project's documented start command. Do not guess one.
2. Wait until the server answers. Then open the URL in the browser (`ego-browser` or the built-in browser).
3. Check the main path and the console for errors.
4. Take a screenshot when the question is visual.

## Process ownership

Record who owns the process before starting anything.

- A server started by the user or another workflow is **not yours**. Never stop or restart it.
- A server you start for a standalone `/run-local` request is **user-facing**: leave it running when the request finishes so the user can keep looking at it, and report the URL, PID, start command, and exactly how to stop it (for example the PID or the documented stop command). Do not stop it at the end of the request.
- A server started for an **explicitly temporary verification** (the user says "just check and close it", or a check needs a throwaway server) is owned by that check: stop only that exact PID when the check finishes, and report that it was temporary.
- A server you start for a composed flow (`visual-test`, `let-me-watch`, or a watch loop) is started **for the caller**. Keep it running after `run-local` returns, and report the URL, PID, start command, and owner so the caller can use it. The requesting workflow stops it when that workflow is finished, and only if it still owns that PID.
- Never kill by name or pattern. Stop only the exact PID you started, and only when you still own it.

## Acceptance checks

- Standalone `/run-local`: the app is still answering after the request, and the report gives the URL and the exact way to stop it.
- Explicitly temporary verification: the server is stopped after the check and the report says it was temporary.
- `visual-test` calls `run-local`, then drives the app: the server is still answering after `run-local` returns; the visual pass completes before cleanup.
- A pre-existing server: no stop/restart; the report names it as caller-owned.
- A composed flow ends: the owning workflow stops only its recorded PID; unrelated processes keep running.

## Report

URL, PID, start command, process owner (`self` or the calling workflow), what was checked, console errors if any, and the screenshot path if taken. Say whether the server was left running for a caller.
