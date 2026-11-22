---
name: deploy
description: "Use when the user asks to deploy, given a deployment source such as a repo, branch, tag, or folder."
metadata:
  author: Enzo Vezzaro
  tags: "hstack,layer3"
---

# Deploy from a source

Shared rules (bundled in `references/`): [execution contract](references/skill-contract.md), [V5 roles](references/hstack-v5.md), [model routing](references/model-routing.md). Links to other H Stack skills are **optional companions**, not installed with this skill.

## HStack V5 role

Layer 3 prepares the deploy; the owner approves the target and version. See [hstack-v5.md](references/hstack-v5.md).

**Model tier:** T2 prepares and verifies; never below T2 for production. See [model-routing.md](references/model-routing.md).

1. Read the deployment source the user gave. If none was given, ask for it.
2. Prepare a reviewable deploy candidate: target platform and environment, plus the exact version (commit SHA or tag). The platform is not hardcoded: it can be GitHub releases/pages, Vercel, AWS, Google Cloud, Cloudflare, npm, or a project-specific host. Use the one the project documents. A `deploy` request that already names the target and version authorizes that scope; do not ask for it again. If either is missing, stop with the candidate and ask once.
3. Run `verify-and-fix` checks on that exact version first.
4. Deploy with the project's documented command or pipeline. Do not improvise a new one.
5. Verify the live result: the URL responds, the main path works, and the version shown matches the one deployed.
6. If verification fails, stop and report. Do not run a second deploy without approval.

## Report

Source, target, version, deploy command or pipeline run, live verification result, and the rollback command if one exists.
