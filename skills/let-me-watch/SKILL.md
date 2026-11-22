---
name: let-me-watch
description: "Use when the user types /let-me-watch or wants to see the project running: opens the local web app in a browser. Not for unrelated work."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer4]
---

# Let me watch

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user types /let-me-watch or wants to see the project running: opens the local web app in a browser.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/let-me-watch <project>` — name the target project and keep the work bounded.

Put the running project in front of the user and leave it running.

## HStack V5 role

Layer 4 starts what is needed; Layer 5 (Ego Lite, or the app window itself) shows it.

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. **Find how the project runs.** Read the README, `package.json` scripts (`dev`, `start`), a Makefile, `tauri.conf.json`, the Electron entry, `app.json` (Expo), `pubspec.yaml` (Flutter), an `.xcodeproj`, or Android Gradle files. Use the documented command; don't guess one.
2. **Reuse what is already running.** Check `orca ports --json`: workspace rows show the port and, when the dev server printed one, its `advertisedUrl`. If it's up, skip to opening it.
3. **Web app.** Start the dev server in an Orca terminal so it keeps running after this turn: `orca terminal create --worktree active --title "dev" --command "<dev command>" --json`. Wait until the URL answers, then open it for the user in Ego Lite, or with `open "<url>"` in the default browser.
4. **Desktop app** (Electron, Tauri, native Mac). Run the documented dev command in an Orca terminal (for example `npm run tauri dev`), or open an existing build with `open "path/to/App.app"`. Make sure its window comes to the front.
5. **Mobile.**
   - iOS: `xcrun simctl list devices available`, boot one with `xcrun simctl boot "<device>"`, `open -a Simulator`, then the project's run command (for example `npx expo run:ios` or `flutter run -d <id>`).
   - Android: `~/Library/Android/sdk/emulator/emulator -list-avds`, start one with `emulator -avd <name>` in an Orca terminal, then the project's run command (for example `npx expo run:android`, `flutter run`, or `./gradlew installDebug`).
   - If the needed SDK or simulator isn't installed, say which one and stop there.
6. **Leave it running.** Don't stop servers or emulators. Tell the user how to stop them: the terminal handle, or the app's own quit.

## Report

What is running, where (URL, window, or emulator), the command used, and how to stop it.
