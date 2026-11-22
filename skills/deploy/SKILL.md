---
name: deploy
description: "Use when the user asks to deploy, given a deployment source such as a repo, branch, tag, or folder. Confirms the target and the version before deploying, then verifies the live result."
---

# Deploy from a source

This skill extends the **W5 Publicar y git** workflow.

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
