---
name: "420"
description: "Use when the user types /420 or says it's time for a new sesh: starts their music (Apple Music or YouTube in the browser), opens the ChatGPT desktop app with Oreja so the music makes room whenever ChatGPT talks, and starts a fresh coding session with the project open and the first task lined up."
---

# 420: new sesh

Music on, ChatGPT open, Oreja listening, project up, first task picked. Then get out of the way.

## HStack V5 role

Layer 1 (assistant) sets up the session; Layer 2 (Orca) opens the workspace.

**Model tier:** T0. Opening apps and reading state needs no paid model. See [model-routing.md](../../docs/model-routing.md).

## Settings

Read an optional `## 420` block in `AGENTS.md`:

- `music`: `apple-music: <playlist name>` or `youtube: <url>` [ask once, then suggest saving the answer here];
- `browser`: `ego-lite` or `default` [ego-lite];
- `oreja`: `on` or `off` [on];
- `project`: the repo or Orca workspace to start in [the most recently active one].

## Steps

1. **Music.**
   - Apple Music: `open -a Music`, then `osascript -e 'tell application "Music" to play playlist "<name>"'`. With no playlist set, `osascript -e 'tell application "Music" to play'` resumes whatever played last.
   - YouTube: open the saved URL in Ego Lite (load the `ego-browser` skill) or with `open "<url>"` in the default browser. With nothing saved, open https://music.youtube.com and ask which playlist to keep as the default.
   - Leave the volume where it is.
2. **ChatGPT.** `open -a ChatGPT`.
3. **Oreja.** [Oreja](https://github.com/EnzoVezzaro/oreja) pauses or lowers the music whenever ChatGPT (or another app you pick) is talking, and brings it back after.
   - Start it after the music and ChatGPT, because Oreja never opens Music on its own: `open -a Oreja`, then confirm it is running with `pgrep -x Oreja`.
   - Its playback target should match the music source: the Apple Music target for Apple Music, or the Browser target (experimental) for YouTube in Ego Lite, Safari, Chrome, Edge, Brave, or Arc. ChatGPT is its default source. Both are set in Oreja's own settings; if they don't match, tell the user which one to change instead of guessing.
   - The first launch asks for audio capture and automation permissions. Let the user approve them.
   - If Oreja isn't installed, point to the latest release (https://github.com/EnzoVezzaro/oreja/releases/latest). It needs macOS 14.2 or newer. Skip this step when `oreja: off`.
4. **New sesh.**
   - Read live state: `orca worktree ps --json`, plus the latest `wrap-day` notes or `stoner` log if there are any.
   - Pick the project and the first task: unfinished work first (`resume-work`), otherwise the top of today's plan. Ask once if two candidates look equally likely.
   - Open the workspace: `orca worktree activate --worktree <selector> --json`.
   - Note the start in a session log (for example `~/.hstack/sessions/<date>.md`): time, project, first task.
   - Kick off the first task with `/hstack <task>`.
5. If the user wants to see the app while they work, finish with `let-me-watch`.

## Report

What's playing, which apps opened, whether Oreja is running and which target it uses, the project and first task, and where the session log is.
