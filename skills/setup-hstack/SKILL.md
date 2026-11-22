---
name: setup-hstack
description: "Use when the user types /setup-hstack, installs HStack for the first time, or asks which models or agents HStack should use per tier. Detects the agents and models available on this machine and writes an 'hstack models' tier map to AGENTS.md after the user confirms."
---

# Set up HStack models

This skill configures the tiers in [model-routing.md](../../docs/model-routing.md).

## HStack V5 role

Layer 1 (assistant) detects and proposes; the owner approves the map. Runs at T0: it reads config files and does not need a paid model.

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. Detect what is installed and configured. Read only; never print keys or tokens.
   - Codex: `model` and `model_reasoning_effort` in `~/.codex/config.toml`.
   - Claude Code: `model` in `~/.claude/settings.json`.
   - OpenCode: `model` and providers in `~/.config/opencode/opencode.json`, and the models most used in `~/.local/share/opencode/opencode.db`.
   - Freebuff: `freebuffModel` in `~/.config/manicode/settings.json`.
   - Orca, Ego Lite, and computer use: check that each is installed.
   - If an agent reports a suspended or locked account (Freebuff did once), leave it out of the map and say so.
2. Propose a map for T0 to T3, using the defaults in `model-routing.md` as a starting point. Mark any tier with no available model.
3. Ask about a monthly budget and any model the user never wants used.
4. After the user confirms, write the map under a `## hstack models` heading in the project's `AGENTS.md`, or in `~/.claude/AGENTS.md` for every project. Replace an existing block; do not duplicate it.

## Report

The detected agents and models, the map that was written, the file it went to, and any tier left empty.
