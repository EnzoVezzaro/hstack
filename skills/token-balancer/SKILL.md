---
name: token-balancer
description: "Use when the user asks /token-balancer, wants a periodic view of Orca subscription or model limits, or needs a model recommendation based on remaining allowance and observed task performance across projects."
---

# Token balancer

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

Keep work moving across the user's Orca projects by matching each next task to a model that has enough remaining allowance and evidence of doing that kind of work well. This skill observes and recommends; it does not change Orca assignments, provider settings, or subscriptions.

## HStack V5 role

Layer 1 summarizes the recommendation; Layer 2 (Orca) provides live project, agent, and usage state when available. Each recommendation is scoped to a named `<project>` and task. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 collects and formats observations; use T1 to compare ambiguous or conflicting evidence. See [model-routing.md](../../docs/model-routing.md).

## One-time review

1. Resolve the project set from the user's request or an explicit `## token-balancer` block in `AGENTS.md`. If neither makes the scope clear, ask which Orca projects to include. Do not assume the currently open repo is the whole portfolio.
2. Read the installed Orca CLI guide for this runtime (`orca skills get orca-cli`) before using Orca commands. Use documented read-only commands and documented usage/quota surfaces only. If the current Orca version exposes no subscription balance or reset data, say so; never infer a quota from plan names, model labels, or token counts in chat.
3. For each named project, collect available model assignments, task state, recent observed outcomes, and remaining allowance / reset time by provider. Record the source and observation time. Treat unavailable or stale values as unknown.
4. Recommend a model per next task using this order:
   - enough confirmed remaining allowance to finish the bounded task;
   - evidence from comparable completed work in that project or the user's cross-project history;
   - lowest cost / tier that meets the task's quality and risk needs under [model-routing.md](../../docs/model-routing.md).
5. State confidence and evidence. Do not compare unlike metrics (requests, tokens, time, or opaque plan units) as if they were interchangeable. When performance data is sparse, label the recommendation provisional.
6. Keep the owner in control: do not start, stop, or reassign agents; change models; spend paid/API credits; or alter subscription settings. Present the recommendation for the owner or project director to apply.

## Periodic review

For repeated checks, use [horizon](../horizon/SKILL.md) to draft a fresh-run monitor with a user-chosen cadence and end date. The run prompt must name the project set, read-only quota sources, report destination, and the same no-reassignment rule above. Activate a schedule only after the owner confirms the concrete cadence, end date, prompt, and scheduler. On each run, refresh live values rather than carrying old balances forward, and report only material changes or a model recommendation that changed.

## Report

For each `<project>`: observation time; subscription/provider and quota source; remaining balance and reset time (or `unknown`); next task; recommended model and fallback; performance evidence; confidence; and any owner action needed. End with the next scheduled check, if one was explicitly activated.
