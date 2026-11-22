---
name: cleanup-chats
description: "Use when the user types /cleanup-chats or wants to clean up Codex or ChatGPT conversations: merge the loose ends of finished threads into one carry-over brief per project, then archive as many threads as possible. Archives instead of deleting, and never touches a thread an active automation still uses."
---

# Clean up chats

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

"Let's clean up, merge what you can, and close as much as possible", applied to Codex threads and ChatGPT chats.

## HStack V5 role

Layer 1 (assistant) owns the conversations; Layer 4 does the sweep; the owner approves the archive list.

**Model tier:** T0 to inventory and archive; T1 to write the carry-over briefs. See [model-routing.md](../../docs/model-routing.md).

1. **Inventory Codex threads, read-only:**
   - the thread list in `~/.codex/session_index.jsonl` (id, name, last update);
   - live sessions with `codex agents`;
   - active schedules in `~/.codex/automations/*/automation.toml`. A thread named in `target_thread_id` of a non-paused automation is off-limits.
2. **Sort threads:**
   - **keep:** updated recently, used by an active automation, or a live session;
   - **archive:** finished work, test probes, duplicates, and threads whose work already landed;
   - **merge then archive:** finished threads that still hold open items or decisions.
3. **Merge what can be merged.** For each project, write one carry-over brief with open items, decisions, and links, taken from the threads in the "merge then archive" group. Save it where the next session will find it: the project's ACC memory (`acc memory add`) when the repo has `.acc/`, or a dated note in the repo. Do not invent items; quote or summarize what the threads say.
4. **Show the plan:** counts per group and the list of threads to archive. Archive only after the owner says yes.
5. **Archive Codex threads** with `codex archive <id>`. It can be undone with `codex unarchive <id>`. Use `codex delete` only when the owner asks for a permanent delete of a named thread.
6. **ChatGPT chats live in the cloud.** Use Ego Lite on chatgpt.com, or computer use on the ChatGPT app, to list recent chats and archive finished ones from each chat's menu. Use "Archive all chats" in settings only when the owner asks to archive everything. Never delete chats unless asked. Put carry-over briefs into the matching ChatGPT project when there is one.

## Report

Threads and chats archived, kept with reasons, carry-over briefs written with their paths, and anything skipped.
