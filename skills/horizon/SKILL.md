---
name: horizon
description: "Use when the user types /horizon or asks for a long-horizon task that must keep running over days or weeks on a schedule (normally a Codex scheduled automation). Writes a self-contained run prompt, a cadence, an end date, and a progress log, then sets up the schedule after the user confirms."
---

# Horizon: long tasks on a schedule

For work that outlives one session: a monitor, a crew review, a weekly report, a slow migration. Different from `plan-horizon`, which only writes a plan.

## HStack V5 role

Layer 1 (assistant) designs the schedule with the owner; Layer 2 (Orca) or Codex runs it; each run does one bounded step on a worker.

**Model tier:** runs at T0 or T1; a T2 review every few runs, or when a run reports something material. See [model-routing.md](../../docs/model-routing.md).

1. Agree four things with the user: the goal, the done condition, the cadence, and the end date. No end date, no schedule.
2. Break the goal into run-sized steps with `break-it-down` if it is not already one repeatable step.
3. Write the run prompt so a fresh agent with no memory can act on it:
   - the one project or repo it works on, and what it must not touch or mix in;
   - where the progress log lives (for example `.hstack/horizon/<id>.md` in the repo) and that each run reads it first and appends to it last;
   - one bounded step per run;
   - "stay quiet when nothing material changed";
   - no pushing, merging, publishing, deploying, buying, or deleting without the owner;
   - the report format for a run that does have news.
4. Choose the scheduler that is available:
   - **Codex automation** (default): `kind = "heartbeat"`, the prompt, an RFC 5545 `rrule` with `UNTIL` for the end date, and a target thread. Create it through Codex so it is bound to a thread; if you write `~/.codex/automations/<id>/automation.toml` directly, leave `status = "PAUSED"`.
   - **Claude Code**: `/schedule` for cloud runs, or `/loop` while a session stays open.
   - **Orca**: an Orca automation through `orca-cli`.
5. Show the user the prompt, cadence, end date, and scheduler. Activate only after they confirm.

## Report

Schedule id, scheduler, cadence, end date, the run prompt, and where the progress log lives.
