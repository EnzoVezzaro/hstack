---
name: general-tasks
description: "Use when the request does not clearly fit one workflow. Classifies the work, splits it into ordered steps, and hands each step to the matching skill."
---

# General and mixed tasks

This skill covers the **W12 Otros / general** workflow.

## HStack V5 role

Layer 1 classifies the request and hands each step to the matching skill. See [hstack-v5.md](../../docs/hstack-v5.md).

1. Classify the request into one of: implement-feature, verify-and-fix, coordinate-agents, research-explain, publish-git, run-local, docs-content, setup-install, cleanup-refactor, ui-design, security-backend.
2. If it covers several, split it into ordered steps. Each step has one owner.
3. Route each step to its skill. Keep the order where one step depends on another.
4. If nothing fits, ask one question before doing anything.

## Report

The classification, the ordered steps, and the skill used for each.
