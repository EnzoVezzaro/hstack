---
name: deploy
description: "Use when the user asks to deploy, given a deployment source such as a repo, branch, tag, or folder."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer3]
---

# Deploy from a source

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks to deploy, given a deployment source such as a repo, branch, tag, or folder.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/deploy <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 3 prepares the deploy; the owner approves the target and version. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T2 prepares and verifies; never below T2 for production. See [model-routing.md](../../docs/model-routing.md).

1. Read the deployment source the user gave. If none was given, ask for it.
2. Confirm the target platform and environment, plus the exact version (commit SHA or tag). The platform is not hardcoded: it can be GitHub releases/pages, Vercel, AWS, Google Cloud, Cloudflare, npm, or a project-specific host. Use the one the project documents, and deploy only after the user confirms both target and version, since a deploy is outward-facing.
3. Run `verify-and-fix` checks on that exact version first.
4. Deploy with the project's documented command or pipeline. Do not improvise a new one.
5. Verify the live result: the URL responds, the main path works, and the version shown matches the one deployed.
6. If verification fails, stop and report. Do not run a second deploy without approval.

## Report

Source, target, version, deploy command or pipeline run, live verification result, and the rollback command if one exists.
