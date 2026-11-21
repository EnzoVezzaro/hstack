---
name: horizon-loop
description: "Use when the user types /horizon-loop or wants a task repeated for a long time until a threshold or goal is reached: a metric to hit, a score to raise, a backlog to empty. Runs measure, change one thing, verify, log, and stops on the goal, on a stall, or on the budget."
---

# Horizon loop: repeat until the goal

## HStack V5 role

Layer 4 workers run the iterations; Layer 3 sets the goal and steps in on a stall.

**Model tier:** iterations at T0 or T1. After two iterations with no progress, escalate one tier for the next iteration, then hand back down. See [model-routing.md](../../docs/model-routing.md).

1. Agree the metric, the threshold, and how to measure it with one command or check. A goal you cannot measure cannot be looped.
2. Agree the limits: maximum iterations, maximum time or budget, and the stall rule (for example, no gain in three iterations).
3. Measure the baseline and write it to the loop log (for example `.hstack/loops/<id>.md`).
4. Each iteration:
   1. read the log;
   2. change one thing;
   3. measure with the same command;
   4. keep the change only if the metric improved and nothing else broke; otherwise revert it;
   5. append the change, the measurement, and the decision to the log.
5. Stop when the threshold is reached, a limit is hit, or the stall rule fires. Do not lower the threshold to finish.
6. For loops that outlive a session, run each iteration from a schedule set up with `horizon`, or with Claude Code `/loop`.

## Report

Baseline, final value, threshold, iterations run, why it stopped, and the changes kept.
