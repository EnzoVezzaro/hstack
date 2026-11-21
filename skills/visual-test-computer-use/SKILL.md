---
name: visual-test-computer-use
description: "Use when the user asks to test or operate a native desktop app (a Mac app, an Electron or Tauri build, the ChatGPT or Claude desktop app), or a window that a browser tool cannot reach. Drives the app through computer use, follows the main flows, and reports what a person would see."
---

# Visual testing with computer use

This skill extends the **W2 Verificar y arreglar** workflow.

## HStack V5 role

Layer 5 (computer use) operates the desktop app; Layer 3 decides what counts as a failure. Ego Lite covers websites; this skill covers everything outside the browser. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 drives the app; T2 judges unclear failures. See [model-routing.md](../../docs/model-routing.md).

1. Prefer a programmatic path first: a CLI, an API, logs, or the app's own test runner. Use computer use only for what needs the real GUI.
2. Pick the tool that is available: `orca-computer-use` (`orca computer`) inside Orca, Codex Computer Use from Codex, or computer use in the Claude desktop app. Check which one is running before starting.
3. Install or relaunch the exact build under test. Close older copies of the app first so you do not test the wrong version.
4. Follow each main flow as a person would: open, click, type, use menus and dialogs. Read the accessibility tree where the tool offers it.
5. Take a screenshot at each failure and at the final state. Repeat a failing flow once to rule out flakiness.
6. Do not enter passwords, payment details, or change system settings unless the user asked for that step.

## Report

App and build tested, flows tested with pass or fail, screenshots of failures, and the exact steps to reproduce each one. Hand failures to `verify-and-fix`.
