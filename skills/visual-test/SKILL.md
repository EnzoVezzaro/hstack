---
name: visual-test
description: "Use when a running web app or native desktop app needs a person-style visual pass. Drives a website in Ego Lite or a native window through computer use, follows the main flows, screenshots."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer5]
---

# Visual test · browser or desktop

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when a running web app or native desktop app needs a person-style visual pass.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/visual-test <project>` — name the target project and keep the work bounded.

One pass over the real screen, on the platform the app actually runs on. Choose the mode before you start: a browser mode for websites and a desktop mode for native windows. The two modes are not interchangeable, and neither one proves anything from a source diff.

## HStack V5 role

Layer 5 (Ego Lite or computer use) operates the app; Layer 3 decides what counts as a failure. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 drives the app; T2 judges unclear failures. See [model-routing.md](../../docs/model-routing.md).

## Choose the mode

- **Browser (Ego Lite):** the target is a website or web app. Load the `ego-browser` skill.
- **Desktop (computer use):** the target is a native Mac app, an Electron or Tauri build, the ChatGPT or Claude desktop app, or any window a browser tool cannot reach.

If the target could be reached through a CLI, an API, logs, or the app's own test runner, do that first. Use a real screen only for what those cannot show.

## Mode: browser (Ego Lite)

1. Start from a running app. If none is running, use `run-local` first.
2. Load the `ego-browser` skill and open the app in Ego Lite. Use the user's logged-in sessions only when the task needs them.
3. Follow each main flow as a user would: click, type, navigate. Note every step that fails or looks wrong.
4. Take a screenshot at each failure and at the final state.
5. Repeat the failing flow once to confirm it is not flaky.

## Mode: desktop (computer use)

1. Pick the tool that is available: `orca-computer-use` (`orca computer`) inside Orca, Codex Computer Use from Codex, or computer use in the Claude desktop app. Check which one is running before starting.
2. Install or relaunch the exact build under test. Close older copies of the app first so you do not test the wrong version.
3. Follow each main flow as a person would: open, click, type, use menus and dialogs. Read the accessibility tree where the tool offers it.
4. Take a screenshot at each failure and at the final state. Repeat a failing flow once to rule out flakiness.
5. Do not enter passwords, payment details, or change system settings unless the user asked for that step.

## Report

Flows tested, pass or fail per flow, screenshots of failures, exact steps to reproduce each one, and the mode and platform used. Do not fix code here; hand failures to `verify-and-fix`.
