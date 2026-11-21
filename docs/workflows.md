# Workflows

For the V5 roles and the economics behind these skills, see [hstack-v5.md](hstack-v5.md).

Twelve core workflows from the activity analysis of Claude Code, Codex, OpenCode, and Freebuff prompts, plus the commands added for work the analysis did not cover. Counts and flows are approximate; they come from keyword classification.

## Core workflows

| Skill | Command | Workflow |
|---|---|---|
| `implement-feature` | `/implement-feature` | W1 Implementar funcionalidad |
| `verify-and-fix` | `/verify-and-fix` | W2 Verificar y arreglar |
| `coordinate-agents` | `/coordinate-agents` | W3 Coordinar agentes |
| `research-explain` | `/research-explain` | W4 Investigar y explicar |
| `publish-git` | `/publish-git` | W5 Publicar y git |
| `run-local` | `/run-local` | W6 Correr y probar en local |
| `docs-content` | `/docs-content` | W7 Contenido, productos y docs |
| `setup-install` | `/setup-install` | W8 Instalar y configurar |
| `cleanup-refactor` | `/cleanup-refactor` | W9 Limpieza y refactor |
| `ui-design` | `/ui-design` | W10 Diseño UI / landing |
| `security-backend` | `/security-backend` | W11 Seguridad, datos y backend |
| `general-tasks` | `/general-tasks` | W12 Otros / general |

## Added commands

| Skill | Command | Extends |
|---|---|---|
| `visual-test-ego-lite` | `/visual-test-ego-lite` | W2 Verificar y arreglar |
| `visual-test-computer-use` | `/visual-test-computer-use` | W2 Verificar y arreglar |
| `product-hunt-launch` | `/product-hunt-launch` | W7 Contenido, productos y docs |
| `fix-ci` | `/fix-ci` | W5 Publicar y git |
| `deploy` | `/deploy` | W5 Publicar y git |
| `antislop-review` | `/antislop-review` | W10 Diseño UI / landing |
| `motion-graphic` | `/motion-graphic` | W10 Diseño UI / landing |
| `seo-audit` | `/seo-audit` | W7 Contenido, productos y docs |
| `humanize` | `/humanize` | W7 Contenido, productos y docs |
| `write-readme-opensource` | `/write-readme-opensource` | W7 Contenido, productos y docs |
| `cleanup-worktrees-branches` | `/cleanup-worktrees-branches` | W5 Publicar y git |
| `cleanup-disk-space` | `/cleanup-disk-space` | W9 Limpieza y refactor |
| `resume-work` | `/resume-work` | W3 Coordinar agentes |
| `handoff` | `/handoff` | W3 Coordinar agentes |

## Routing

- Not sure which one applies? Use `general-tasks`. It classifies the work and hands each step to the right skill.
- `coordinate-agents` coordinates; it hands verification to `verify-and-fix` and publishing to `publish-git`.
- Nothing is committed, merged, published, deployed, or deleted outside the code unless the owner asks.

## Make them yours

These are starting points. Put personal settings, such as which agents to coordinate or which deploy targets exist, in `CLAUDE.md` or `AGENTS.md`, so you can update the skills without losing them.
