# Orca resume scan

Generated 2026-11-22T15:57:48+00:00. Read-only snapshot; nothing was started, stopped or resumed.

Projects: **18**, worktrees: **23**. Groups: working **2**, interrupted **4**, unfinished **10**, complete-or-idle **7**.

`interrupted` means a failure/cancellation outcome or an interrupted flag. `unfinished` means dirty or unmerged changes with no failed agent: review it, do not auto-resume.

Session search index: enabled=True, phase=current. Resume commands from `orca search` are usable only when enabled is true and phase is current.

| Project | Worktree | Branch | Group | Working agents | Candidates | Dirty / ahead |
| --- | --- | --- | --- | ---: | ---: | --- |
| hstack | main | `main` | working | 1 | 2 | 39 / 0 |
| ifm | main | `main` | interrupted | 0 | 1 | 30 / 0 |
| ifm | web-channel-backpressure | `EnzoVezzaro/web-channel-backpressure` | unfinished | 0 | 0 | 12 / 0 |
| ifm | signaling-peer-auth | `EnzoVezzaro/signaling-peer-auth` | interrupted | 0 | 1 | 3 / 0 |
| autoarb | main | `main` | unfinished | 0 | 0 | 20 / 0 |
| ai-auth | main | `main` | complete-or-idle | 0 | 0 | 0 / 0 |
| ai-explainer-skill | main | `main` | unfinished | 0 | 0 | 27 / 0 |
| ai-garage | main | `main` | complete-or-idle | 0 | 0 | 0 / 0 |
| alive | main | `main` | complete-or-idle | 0 | 0 | 0 / 0 |
| awesome-homebrew-games | main | `main` | complete-or-idle | 0 | 0 | 0 / 0 |
| entropic-time-theory | main | `main` | working | 1 | 0 | 1 / 0 |
| faceless-channel-buildai | main | `main` | interrupted | 0 | 2 | 131 / 0 |
| formo | main | `main` | complete-or-idle | 0 | 0 | 0 / 0 |
| ohana | main | `main` | interrupted | 0 | 1 | 14 / 0 |
| oreja | main | `main` | unfinished | 0 | 0 | 1 / 0 |
| sell-ai-companion | main | `main` | unfinished | 0 | 0 | 23 / 0 |
| Underground Engineer NYC | main | `main` | unfinished | 0 | 0 | 2 / 0 |
| ifm | fix-frequency-file-limits | `EnzoVezzaro/fix-frequency-file-limits` | unfinished | 0 | 0 | 5 / 0 |
| ifm | IFM packet replay guard | `EnzoVezzaro/ifm-packet-replay` | unfinished | 0 | 0 | 3 / 0 |
| paw-trading-ai-automation | main | `main` | unfinished | 0 | 0 | 1 / 0 |
| reposell | main | `main` | complete-or-idle | 0 | 0 | 0 / 0 |
| ifm | fix-frequency-crypto | `EnzoVezzaro/fix-frequency-crypto` | unfinished | 0 | 0 | 15 / 0 |
| cannabis-investigation | cannabis-investigation | `-` | complete-or-idle | 0 | 0 | 0 / 0 |

## Candidate sessions

- **hstack / main** — `c9fa1891-3c40-49ee-98c2-1542cbd051ca` (claude), Skill usage report for the last 30 days, outcome=failure, interrupted=False.
  - Prompt: en los skills de orca necesitamos un "token balancer" que revisa periodicamente los limites de las subscripciones en orca y recominenda un model based on performance and token balance left.
  - Last read state: None; Voy a localizar todos los ejemplos sin proyecto en README, docs, skills y en las animaciones.
- **hstack / main** — `104bacf3-3511-433b-8a58-14c15112b7b2` (codex), Create PostHog Analytics Setup Skill, outcome=failure, interrupted=False.
  - Prompt: la seccion de los workers y los comandos de los workers estan mezclados con los comandos de los directores. Y tambien los directores pueden ser opencode, o junto con freebuff en el free mode del stack
  - Last read state: None; El render reveló que el GIF salía estático: el callback del lienzo recibe ancho y alto antes del tiempo de animación, y la escena estaba leyendo el ancho como si fuera el tiempo. Ya encontré la causa y la corrijo; luego comprobaré que las imágenes sí tengan varios fotogramas distintos antes de darlo por terminado.
- **ifm / main** — `c99fed92-9c04-468a-93e5-523bcc63ed6d` (codex), IFM Multi-Model Review and Upgrade, outcome=failure, interrupted=False.
  - Prompt: update the code, remove old implementations, remove legacy code at this point, make sure it all works e2e with all test passing and visually passing tests too. reconcile all and get main clean and upd
  - Last read state: None; I’ve integrated the parallel changes into the clean `main` checkout and am reconciling the remaining migration gaps now. I’m removing obsolete media transport and crypto fallback paths, then I’ll run the full available Rust/SDK/WASM checks and the browser-facing visual flow; I’ll report any environment limit separately from actual failures.
- **ifm / signaling-peer-auth** — `71118b30-d4dc-418d-8fad-cb805e1013f8` (codex), Implement signed signaling registration proof, outcome=failure, interrupted=False.
  - Prompt: You are working inside Orca, a multi-agent IDE. Your task ID is: task_f412f2065fcf === TASK === Implement the first-claim signaling peer ownership proof in /Users/mac/orca/workspaces/ifm/signaling-pee
  - Last read state: None
- **faceless-channel-buildai / main** — `a4945480-6dd0-4e13-b346-c6b194ac9721` (claude), Explainer video: how AI will change coding, outcome=failure, interrupted=False.
  - Prompt: ahora crea un nuevo video para ver como sale
  - Last read state: None; Voy con un video nuevo en el estilo vox, usando el set original de Codex. El tema: **"Vice City vuelve: tres veces en 40 años"**, de GTA Vice City (2002) a Vice City Stories (2006) y GTA 6 (2026), más la inspiración en el Miami Beach Art Deco real. Primero verifico los datos.
- **faceless-channel-buildai / main** — `5f84f22a-bdea-4b5b-87c6-b4b544de6380` (codex), Publish GTA 6 Explainer Videos, outcome=failure, interrupted=False.
  - Prompt: > Publication scope: six unpublished videos currently pass QC and have owner approved disclosure; ten others are already scheduled. One has a QC warning, two lack disclosure classification, and the ne
  - Last read state: None; The first upload, the vertical NOVA y CERO video, is public and verified. YouTube rejected the next upload because its package description is invalid, so the batch stopped before creating that video; the LIVE flag was restored. I’m checking description lengths and will shorten only the affected packages before resuming without duplicating the first upload.
- **ohana / main** — `3d9187e6-2151-434a-8ebd-1604a50e4d14` (opencode2), Director, outcome=cancellation, interrupted=True.
  - Prompt: install the latest version on this computer
  - Last read state: None; Sigo activo como director interino de OHANA para esta tarea. Auditoría completada en la capa que este entorno permite (lectura, búsqueda y edición). Estado honesto: **no hay ejecución ni evidencia visual**, por los bloqueos al final.

## Hallazgos priorizados (con evidencia)

| # | Severidad | Hallazgo | Evidencia |
|---|---|---|---|
| 1 | **Alta** | El spec MCP contradice el código e incumple el invariado 12 (docs e implementación deben coincidir). Decía "MCP no existe" y 6 herramientas; el MVP existe y expone 8 (`mcp/components`, `mcp/component_action` son nuevas). | `docs/specifications/mcp-control-plane.md:5,28,122,136` vs `crates/ohana-node/src/mcp.rs:1,25-32`, `lib.rs:1091,1552`; ADR-015. Referencias de línea también desplazadas (`ControlRequest` está en `lib.rs:1222`, no 961). |
| 2 | **Alta** | Brecha end-to-end conocida: tipos de dominio declarados sin cablear en rutas de producción. `Federation`, `FederationMembership`, `RemoteConnection`, `AuditRecord`: cero uso fuera de sus archivos/tests; `CallerIdentity` y `Policy`: solo en `inference/mod.rs`, no en MCP ni remoto. | `grep` de 38 coincidencias en 6 archivos; `ARCHITECTURE.md:155` ya lo registra como pendiente. Federación/remote no pueden funcionar de extremo a extremo hoy. |
| 3 | Media | `REQ-MCP-001` ("exactamente seis herramientas") quedó normativamente desactualizado; requiere aprobación del operador para cambiarlo. | `mcp.rs:25-32` vs spec `:136`. |
| 4 | Media | Accesibilidad: el selector de agente del panel de contexto no anuncia qué agente está seleccionado; el resto del app usa `aria-pressed` para el mismo patrón. | `RuntimeContextPanels.vue:44` vs `AgentsView.vue:82`, `ResourcesView.vue:40`, `SpaceViewSwitch.vue:42`. |
| 5 | Baja | Contraste límite en indicadores no textuales: `--state-stopped` #8a8d83 sobre shell #f1f0e9 = **2.96:1** (WCAG 1.4.11 pide 3:1); `--state-unknown` #85877e sobre chalk = 3.61:1. Se usan como puntos de estado, no texto. | `style.css:9-10,267`; cálculo WCAG ejecutado. Otros 6 pares medidos pasan (p. ej. foco 4.74:1, blanco/forest 8.01:1). |
| 6 | Baja | `Store::get`/`recent` convierten timestamps corruptos a 0 con `unwrap_or_default()`, silenciando corrupción en el historial de ejecuciones. | `lib.rs:478-479,511-512`. No hay framework de migración (`m1-runtime.md:100`). |

No encontré `panic!` alcanzable en producción; los `unwrap()` están en tests y los `let _ =` de `lib.rs:919-1018` son best-effort de kill/wait documentados.

## Correcciones aplicadas (verificadas en disco)

1. `docs/specifications/mcp-control-plane.md`: estado, non-goal, §8.1, §10 y §12 actualizados con evidencia `Verified 2026-11-20`; se conserva el finding original como historia y se marca el delta 6→8 herramientas como pendiente de aprobación.
2. `apps/ohana-desktop/src/components/RuntimeContextPanels.vue:44`: añadido `:aria-pressed` al botón de selección, igualando el patrón del resto del app.

Sin push, merge ni deploy. Cambios existentes conservados.

## Checks y resultados

- **Sí ejecutados**: búsquedas de cableado de tipos, patrones de error, a11y y foco; lectura de código y docs; cálculo WCAG de 8 pares de tokens; relectura de los 2 archivos editados para confirmar los cambios.
- **No ejecutados** (sin herramienta de shell en esta sesión): `cargo fmt --all -- --check`, `cargo clippy --workspace --all-targets -- -D warnings`, `cargo test --workspace`, `cargo run -p ohana-node -- version|help`, el ejemplo E2E con provider echo (`docs/operations/m1-runtime.md:11-40`), `npm run ci:check`, `acc check`, `node orchestration/selftest.mjs`, Playwright. **No afirmo que pasen.**
- **Flujo E2E**: no llevado a funcionamiento en esta sesión; la verificación queda en el punto de reproducción documentado (comandos anteriores), no en un resultado observado.

## Evidencia visual

**Ninguna producida.** No hay herramienta de navegador/Ego Lite ni app ejecutándose en esta sesión. Según `docs/operations/desktop-task-workflow.md:41-50`, la tarea desktop debe quedar marcada como **bloqueada** con esta razón exacta, no cerrada.

## Bloqueos reales

1. `/Users/mac/.codex/skills/activate-project-director/SKILL.md`: `Permission denied: external_directory`; no hay copia en el repo. No pude seguir su flujo literal.
2. Límite de modelos gratuitos de OpenCode: 3 de 4 supervisores fallaron con `Free usage limit reached`. No los reintenté para respetar tu restricción.
3. Sin shell: imposible compilar, correr tests o iniciar el nodo/app.
4. Sin Ego Lite/navegador: imposible el recheck nativo en escritorio/móvil exigido por el workflow.

**Punto de reanudación:** con shell y Ego Lite disponibles, ejecutar los comandos de `m1-runtime.md`, verificar el panel de contexto y el spec MCP corregido, y someter a aprobación el cambio normativo de REQ-MCP-001 (6→8 tools).

## Next

Review each candidate with `orca agent read`, find a resumable session with `orca search "<distinctive phrase>" --path <worktree> --json`, and present the batch with its model mapping for owner approval. Never resume a `working` agent or this session.
