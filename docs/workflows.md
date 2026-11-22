# Workflows

For the V5 roles and the economics behind these skills, see [hstack-v5.md](hstack-v5.md).

Twelve core workflows from the activity analysis of Claude Code, Codex, OpenCode, and Freebuff prompts, plus the commands added for work the analysis did not cover. Counts and flows are approximate; they come from keyword classification. The W1–W12 labels are historical taxonomy, not active instructions inside skills.

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
| `hstack` | `/hstack` | W12 Otros / general (entry point and router) |

## Added commands

| Skill | Command | Extends |
|---|---|---|
| `a-new-day` | `/a-new-day` | Daily operations |
| `blocker-radar` | `/any-blockers` | Daily operations |
| `plan-horizon` | `/plan-day`, `/plan-week`, `/plan-month` | Daily operations |
| `wrap-day` | `/wrap-day` | Daily operations |
| `relay-room` | `/relay-room` | W3 Coordinar agentes |
| `patch-patrol` | `/patch-patrol` | W2 Verificar y arreglar |
| `interface-check` | `/interface-check` | W2 Verificar y arreglar |
| `save-point` | `/save-point` | W2 Verificar y arreglar |
| `skill-workbench` | `/skill-workbench` | W12 Otros / general |
| `visual-test` | `/visual-test` | W2 Verificar y arreglar |
| `product-hunt-launch` | `/product-hunt-launch` | W7 Contenido, productos y docs |
| `set-analytics` | `/set-analytics` | W11 Seguridad, datos y backend |
| `fix-ci` | `/fix-ci` | W5 Publicar y git |
| `deploy` | `/deploy` | W5 Publicar y git |
| `antislop-review` | `/antislop-review` | W10 Diseño UI / landing |
| `motion-graphic` | `/motion-graphic` | W10 Diseño UI / landing |
| `seo-audit` | `/seo-audit` | W7 Contenido, productos y docs |
| `humanize` | `/humanize` | W7 Contenido, productos y docs |
| `write-readme-opensource` | `/write-readme-opensource` | W7 Contenido, productos y docs |
| `cleanup-worktrees-branches` | `/cleanup-worktrees-branches` | W5 Publicar y git |
| `cleanup-disk-space` | `/cleanup-disk-space` | W9 Limpieza y refactor |
| `reconcile-branches` | `/reconcile-branches` | W5 Publicar y git |
| `cleanup-orca` | `/cleanup-orca` | W9 Limpieza y refactor |
| `cleanup-chats` | `/cleanup-chats` | W9 Limpieza y refactor |
| `resume-work` | `/resume-work` | W3 Coordinar agentes |
| `handoff` | `/handoff` | W3 Coordinar agentes |
| `stoner` | `/stoner` | Long-horizon loops (W3 + W2 + W5) |
| `break-it-down` | `/break-it-down` | W3 Coordinar agentes |
| `horizon` | `/horizon` | Long-horizon scheduling |
| `horizon-loop` | `/horizon-loop` | Long-horizon loops |
| `horizon-loop-test` | `/horizon-loop-test` | W2 Verificar y arreglar |
| `horizon-loop-ego-lite` | `/horizon-loop-ego-lite` | W2 Verificar y arreglar |
| `release` | `/release` | W5 Publicar y git |
| `check-github` | `/check-github` | W4 Investigar y explicar |
| `420` | `/420` | W6 Correr y probar en local (session start) |
| `let-me-watch` | `/let-me-watch` | W6 Correr y probar en local |
| `get-stoned` | `/get-stoned` | W4 Investigar y explicar |
| `haf` | `/haf` | W10 Diseño UI / landing |
| `puff-puff-pass` | `/puff-puff-pass` | W1 Implementar funcionalidad |
| `pineapple-express` | `/pineapple-express` | W3 Coordinar agentes |
| `setup-hstack` | `/setup-hstack` | Model routing |
| `acc-context` | `/acc-context` | W4 Investigar y explicar |
| `protect-repo` | `/protect-repo` | W5 Publicar y git |
| `reposell-release` | `/reposell-release` | W5 Publicar y git |
| `proagent-equip` | `/proagent-equip` | W3 Coordinar agentes |
| `ace-workspace` | `/ace-workspace` | W3 Coordinar agentes |
| `token-balancer` | `/token-balancer` | Model routing and recurring quota review |
| `take-one-dude` | `/take-one-dude <project>` | Fast task ownership with a measured finish and concrete probes |
| `benchmark` | `/benchmark` | Skill quality, harness loading and routing checks; see [benchmark.md](benchmark.md) |
| `resume-all` | `/resume-all` | Portfolio-wide Orca resume with same-capability model mapping |

## Routing: canonical procedures and small overrides

The router [`/hstack`](../skills/hstack/SKILL.md) classifies work and names one skill. It is a front door, not a step inside every workflow; skills do not route back to it mid-task. Public slash commands stay unchanged.

| Job family | Canonical procedure | Explicit override |
|---|---|---|
| Build a feature | `implement-feature`: acceptance check first, smallest change, then `verify-and-fix` | `take-one-dude` adds one owner and concrete finish probes but uses the same build/verify procedure. `puff-puff-pass` adds a tier rule: cheap builder, different stronger reviewer. Neither invents a second build method |
| Something is broken | `verify-and-fix`: reproduce root cause, fix, rerun the exact path | `save-point` when the contract is "it worked in an older version"; `fix-ci` when the failing check is CI |
| Review a change | `patch-patrol` for an independent diff review | `antislop-review` for generic writing/style patterns; `interface-check` for screen layout and accessibility; `visual-test` for real browser or desktop flows. These inspect different artifacts and do not replace each other |
| Change or design UI | `ui-design` for design work; `interface-check` for a screen-level pass; `visual-test` for real interaction | `haf` is inspiration research only; it does not design, implement, or verify |
| Coordinate agents | `relay-room` for one live Orca project; `coordinate-agents` for several workers | `stoner` is a standing long-horizon loop over many repos, not a one-off coordination call |
| Ship | `publish-git` prepares and commits; `deploy`, `release`, and `product-hunt-launch` handle their named targets | Authorization is scoped per action; see the shared [execution contract](skill-contract.md) |

Handoffs are one-way: a skill may hand verification to `verify-and-fix`, review to `patch-patrol`, or preparation to `publish-git`, and then stops owning that step. Avoid chains that hand a task back to the skill that produced it; that is circular routing and unbounded recursive handoff.

## Authorization

Readiness is a technical gate, never an authority grant. `commit` ends at a local commit; `push`, PR, `merge`, `deploy`, `release`, and deletion each need their own scope of authorization. A standing rule in the consumer project's `AGENTS.md` (for example `stoner`'s scoped PR-branch push) is authorization already supplied and must not be asked for again. See [skill-contract.md](skill-contract.md#5-authority-and-safety-gates).

## Make them yours

These are starting points. Put personal settings, such as which agents to coordinate or which deploy targets exist, in `CLAUDE.md` or `AGENTS.md`, so you can update the skills without losing them.
