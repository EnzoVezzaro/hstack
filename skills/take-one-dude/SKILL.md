---
name: take-one-dude
description: "Use when the user types /take-one-dude or wants one agent to take ownership of a named project task, move quickly, choose whether to iterate or use more effort, and prove the result with concrete probes."
---

# Take One Dude

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

One agent takes the task from prompt to evidence. Bring the speed and useful capabilities of H Stack to a single clear outcome, without skipping the probe that proves it.

The skill is portable across agents. “Superpowers” means focused routing, appropriate effort, and evidence; it does not grant extra tools, permissions, or access.

## HStack V5 role

Layer 1 chooses the execution path; the agent uses the relevant H Stack skills and model-routing rules. Keep work scoped to the named project or explicitly listed projects. See [hstack-v5.md](../../docs/hstack-v5.md) and [model-routing.md](../../docs/model-routing.md).

**Model tier:** Start at the lowest tier that can complete and verify the task. Increase effort or escalate one tier when uncertainty, risk, scope, or a failed probe warrants it. Hand routine execution back down after the hard decision is made.

## Run the task

1. **Resolve the target.** Identify the exact `<project>` and active repo/worktree. For a multi-repo request, name every project and keep each project's changes and probes distinct. If the target is not clear from the request or active context, ask before inspecting or editing.
2. **Turn the prompt into a finish line.** State the requested outcome in one sentence. Pick the cheapest decisive probe that can show it is done: an existing test or command, a live app flow, a browser or device interaction, a provider response, or another observable result. Prefer the user's acceptance condition when provided.
3. **Choose the fastest fit.** Read the project's instructions and current state, then load only the H Stack skill or skills needed. Work directly when the task is bounded. Parallelize independent reads or steps when it saves time and does not create overlapping ownership. Do not spend time planning work that can safely start now.
4. **Choose iteration or effort deliberately.**
   - Use one focused pass for a bounded task with a clear probe.
   - Use a loop only when progress can be measured against a fixed goal. Set a reasonable iteration/time/budget limit and a stall condition before repeating; keep each iteration small and rerun the same probe.
   - Use a higher reasoning/effort setting if the current agent supports it, or escalate one H Stack tier when the task is ambiguous, cross-cutting, high-risk, or the same probe fails twice. If effort controls or a higher tier are unavailable, say so and continue with the best available approach.
   - Once the plan or difficult decision is settled, return routine execution to the lowest capable tier.
5. **Probe the result.** Run the selected probe after the change and inspect its actual output. Add a broader check only when the change's reach or risk calls for it. Fix confirmed failures and repeat the probe. Do not count a code edit, a worker's claim, a successful build, or a screenshot of the wrong state as proof of the requested outcome.
6. **Stop honestly.** Stop when the acceptance condition passes, a preset loop limit/stall condition is reached, or an external dependency or missing capability blocks the probe. Never weaken the finish line just to report success. Do not push, merge, deploy, publish, spend money, or delete data unless the user authorized that action.

## Report

Give the project(s), requested outcome, concise changes, and the probes actually run with their observed results. Mark the finish line **proved**, **partly proved**, or **blocked**. Include remaining failures, unavailable evidence, and the next smallest action. Keep it short when the task was short.
