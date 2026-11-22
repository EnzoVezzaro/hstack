---
name: handoff
description: "Use when the user asks to pass a task, branch, or chat to another agent. Writes a self-contained brief so the next agent can continue without the original context."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer2"
---

# Hand off to another agent

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 2 (Orca) routes the brief; Layer 3 defines the definition of done. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T0 writes the brief from the record; T2 reviews it when the next agent works on something risky. See [model-routing.md](references/model-routing.md).

0. If the repo has `.acc/`, pull focused context with `acc-context` first.
1. Summarize the goal, the current state, and what is verified versus claimed.
2. List the files, branch, worktree, and commands the next agent needs.
3. State the exact next step and the definition of done.
4. Name what must not be changed and what needs the user's decision.
5. **Discover the receiver.** If Orca is in scope, confirm its connection and inspect the actual commands (`orca agent list --json`, `orca worktree ps --json`, and the help of the message/dispatch command). Pick one existing, verified receiving session or worker. Never name a session from a document or old title, and never open a duplicate when the same task is already assigned.
6. **Deliver only when handoff was requested.** Use the supported Orca message/dispatch mechanism to send the brief to that verified receiver and record the delivery receipt. A saved brief with no receipt is **prepared / NOT SENT**, never "sent to <session>". If Orca is unavailable, output the brief as **NOT SENT** with the destination requirements and stop.
7. **Close the ownership loop.** On a confirmed delivery, hand over ownership of the named task and stop working it yourself; on `accepted`, the receiver owns it; on `completed`, attach the receiver's evidence. A delivery receipt alone is not acceptance or completion.

## Handover states

Use exactly these labels in the report: **prepared** (brief saved, no delivery attempted), **NOT SENT** (delivery unavailable or blocked), **delivered** (receipt observed), **accepted** (receiver confirmed the task), **completed** (receiver reported evidence you can inspect). Never skip from prepared to accepted.

## Acceptance checks

- Request "prepare a handoff brief" → state **prepared** or **NOT SENT**; no message is sent and no receiving session is claimed.
- Request "hand this to the existing worker" with a verified live session → one message to that session plus its receipt; state **delivered**; original ownership stopped.
- No live Orca or no verified receiver → **NOT SENT** with exact destination requirements; no invented agent response.
- Same task already assigned → no duplicate dispatch; report the existing owner.

## Report

The brief and its location, the handover state, the verified receiver session (only when delivered), the observed receipt, and anything still waiting on the owner.
