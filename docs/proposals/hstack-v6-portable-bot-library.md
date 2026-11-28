# RFC: HStack V6 Agent Factory — dynamic agent composition and provisioning

Status: proposal only; V5 remains the shipped baseline and this plan changes no V5 behavior. This proposal bundles the [runtime-agnostic actor model](hstack-v6-runtime-agnostic-actors.md), [organization engine](../rfc-v6-organization-engine.md), and [composable workflows](../v6-composable-workflows-rfc.md) for review alongside the Agent Factory. Agentix owns its preconfigured bot catalog and organizational policies (https://github.com/EnzoVezzaro/agentix/pull/9). HSTACK owns the generic mechanism, not that catalog.

## V6 plan at a glance

V6 is a staged proposal, not a released version or an implementation commitment. The workstreams below must be designed and accepted independently; a proposal, manifest, or successful dry-run is not evidence that a runtime agent was provisioned or executed.

| Workstream | Proposed scope | Required boundary |
| --- | --- | --- |
| Portable actors and tasks | Separate stable actor identity from provider sessions; define task envelopes, ownership, dependencies, events, memory references, handoffs, and lifecycle. | Runtime IDs and mutable memory stay outside portable manifests; unsupported capabilities remain explicit. |
| Agent Factory | Compose task-scoped AgentSpecs from explicit task requirements or pinned external profiles; validate skills, model/runtime preferences, permissions, budget, acceptance checks, and lifetime. | Restrictive permission composition; dry-run first; no credentials in specs; no unattended creation where the runtime lacks an authorized interface. |
| Organization bootstrap | Reconcile a versioned stack manifest across global and project roles, using idempotent identities and full-stack or project-scoped initialization. | Never duplicate global roles; never touch unrelated projects; do not create task workers, schedules, or external effects during initialization. |
| Worker pools | Assign bounded worker subtasks under one existing owner; use runtime-native worker interfaces and capability checks. | No top-level `swarm` directive, recursive pool expansion, unbounded concurrency, or automatic launch from a manifest. See the worker-pool section below. |
| Composable workflows | Present a small set of primary end-to-end workflows over existing skills while retaining direct skills and aliases; map and validate every route before any migration. | No skill removal or V5 route change as part of this proposal; workflow composition must not become a menu that stops short of execution. |
| Task operations and escalation | Track proposed through terminal task states, single ownership, evidence, limits, retries, verification, and a bounded escalation path. | A block names the immediate next hop and action; escalation proceeds worker → supervisor → director → chief → CEO, with no sideways or direct jump. |
| Runtime adapters | Start with a testable local adapter and add Orca, Claude Code, Codex, and OpenCode adapters where installed interfaces prove the required capability. | No assumed parity: dispatch, model choice, isolation, observation, and cancellation are capability-gated per runtime. |

### Proposed implementation sequence

1. Freeze the portable AgentSpec, task envelope, capability model, permission composition, and migration boundaries; keep V5 as the compatibility baseline.
2. Build schema validation, dry-run planning, profile pinning/import, policy checks, and a local adapter with deterministic tests.
3. Add one runtime adapter at a time, using supported interfaces only; prove idempotent provisioning, worker dispatch, observation, cancellation, and truthful unsupported states before adding another.
4. Add stack reconciliation and workflow composition only after the portable contracts and adapter gates pass; preserve project isolation and existing direct skills.
5. Run acceptance across fresh initialization, repeated reconciliation, partial failure/resume, capability denial, permission/budget limits, worker cancellation, duplicate dispatch, and V5 compatibility. Publish a capability matrix and evidence for each tested runtime.

No V6 runtime is declared supported until its own acceptance evidence is attached. All exact command names, schema versions, provider models, availability, and migration choices remain proposals until reviewed and tested.

## Two distinct needs

Agentix Bot Library provides versioned, ready-made role profiles, including executive roles, specialists and project directors. HSTACK Agent Factory composes and creates agents on demand from a task specification or an imported external profile, attaches compatible skills, selects an allowed execution backend and manages the lifecycle. The factory supports both ephemeral task agents and persistent actors; no Agentix installation is required. Neither project has a mandatory dependency on the other. Do not embed the Agentix organizational chart or copy its profiles into HSTACK.

## ORCA reference and compatibility

Study ORCA templates, purpose/memory files, agent and computer selection, permissions, skills, automation, and worktree isolation: https://orca.dev/docs/bots , https://orca.dev/docs/bots/import , https://orca.dev/docs/bots/security , https://orca.dev/docs/bots/connectors . Audit exact source, installed version, schema and supported provisioning interfaces before implementing an adapter. Do not write undocumented live state. Report unsupported capabilities explicitly; schedules and external effects are disabled by default.

## Proposed portable contract

A versioned AgentSpec declares objective, optional role/profile reference, project/repo scope, skills, model and harness preferences, allowed capabilities, delegated authority, acceptance checks, budgets, lifetime, parent/owner, memory policy and output contract. An ActorInstance separately binds stable identity, provider references, state and task/run IDs. A task-scoped instance does not outlive the task unless a separately authorized persistence policy applies. A durable definition is not evidence of a running process.

The factory resolves a pinned external profile (optional), combines explicit task requirements with permitted defaults, validates capability compatibility and policy, and produces a dry-run provisioning plan. Permission composition is restrictive: generated instructions and local overrides cannot expand authority. Generated configurations are untrusted until validated. Credentials are references, never copied into profiles, memory seeds or logs. Project-local versioned manifests can reference external profiles or specify a standalone bot; mutable state stays outside Git.

Agentix's proposed Bot Profile Format v1 is tracked in https://github.com/EnzoVezzaro/agentix/pull/9 . HSTACK should import versioned external manifests (`bot.yaml`, relative soul and memory seed files, abilities, automation declarations) into its generic AgentSpec without depending on Agentix-specific roles or native ORCA storage. Validate versions, path confinement, grants, skills, and disabled schedule defaults; preserve mutable state separately. Coordinate upstream issue/PR follow-up with Agentix's CTO and verify released, installed, authorized capability before enabling automated provisioning.

## Illustrative API (not committed)

- composeAgent(taskSpec, optionalProfileRef) -> AgentSpec
- validateSpec(spec, policy, runtimeCapabilities)
- planProvision(spec, runtime) -> plan, unsupportedCapabilities
- provision(plan, scopedGrant) -> instance receipt
- dispatch(instance, task), inspect(instance), cancel(run), release(instance)
- reconcile(instance) -> actual versus desired state
- importProfile(source, pinnedVersion) -> portable profile

Package and CLI names, language, schema format and adapter mapping remain open. An existing standing grant may permit bounded automated provisioning; absent authority, return a proposal rather than creating an agent. Do not launch or spend resources just because a manifest exists.

## Runtime-neutral coordination

Single owner per task; no delegation cycles; bounded grants, budgets and retries; dependency DAG, resource leases, idempotent dispatch, context and worktree isolation, independent verification, cancellation and crash recovery. Prefer the fewest agents necessary; create a supervisor only when complexity justifies it. External organization policies supply role topology, reporting lines, budgets and schedules. HSTACK enforces generic invariants at trusted boundaries, not only in prompts. Agentix supplies its specific hierarchy and daily cadence.

## Worker pools and swarm execution (V6 proposal)

A **worker swarm** is an execution-time pool of task-scoped workers assigned bounded subtasks under one existing task owner. It is not a new persistent actor type, organization role, or runtime-wide mode. The coordinator remains the task owner and is outside the worker pool; a supervisor is optional and must have its own explicit task and authority. Workers do not create sibling workers, nested swarms, or additional supervisors by default.

HSTACK does not introduce a top-level `swarm` directive. A task plan may describe worker assignments and a concurrency limit, but each runtime adapter translates those assignments through that runtime's native worker/subagent interface. Orca, Claude Code, Codex, and OpenCode are separate adapters, not interchangeable backends: each must report whether it can dispatch workers, choose a permitted model, isolate context/workspace, observe completion, and cancel work. Capability absence means `unsupported` and a dry-run/manual plan; it must never be simulated as a successful launch. No adapter or provider support is claimed here as verified merely because a product name appears in a plan.

Each worker assignment must include a parent task ID, one bounded objective, dependencies, file/resource ownership, allowed tools and delegated authority, model/runtime preference, time/token/cost limits, acceptance checks, and a structured result contract. The scheduler enforces the requested concurrency ceiling and provider budgets at a trusted boundary. Dispatch is idempotent; overlapping write scopes require serialization or isolated worktrees. The owner aggregates worker reports, checks that each required result arrived, and obtains independent verification where the task requires it. A worker report alone does not close or verify the parent task. Cancellation, timeout, partial failure, retry exhaustion, and unavailable telemetry remain explicit states; retries cannot create duplicate owners or exceed the original grant.

Illustrative allocation only, based on one requested planning scenario: five Codex workers using GPT-6 Sol/Luna, eight Claude Code workers using Opus 5.5, and ten OpenCode workers using the Hy4 Flash Free model. These counts and model labels are not defaults, availability guarantees, or permission to launch agents. A runtime must confirm model availability and capacity, and an authorized task owner must set the concurrency and spend limits before dispatch.

Acceptance for this proposal: (1) dry-run shows the owner, worker assignments, capability gaps, effective concurrency, and budget without launching anything; (2) each adapter either proves native worker dispatch or returns unsupported without spawning; (3) workers cannot exceed assigned scope or recursively expand the pool; (4) duplicate dispatch, overlapping writes, cancellation races, timeouts, partial results, and budget exhaustion preserve one owner and report truthful states; and (5) parent completion requires all required results plus the configured verification. Orca, Claude Code, Codex, and OpenCode adapter acceptance remains implementation work, not evidence supplied by this RFC.

## Stack bootstrap and reconciliation (V6)

Provide a generic initializer consuming an explicit, versioned stack manifest (projects, external profile references, global roles, project roles, runtime selection, authority and limits). Agentix is an optional manifest/catalog provider; HSTACK remains usable with a standalone manifest and without Agentix. Proposed CLI, not an existing command: `hstack init` for the entire configured stack, `hstack init --project <id>` for a single registered project, and `--dry-run` to preview changes. Exact flags are subject to implementation review.

1. Resolve manifest and project IDs/paths; discover existing registered projects and repositories only within declared scope. Validate profile versions, hierarchy, permissions, runtime capabilities and resource limits.
2. Through the selected adapter, detect and reuse an existing runtime session/instance or open one ORCA instance when supported and authorized; do not spawn duplicate instances. Register missing projects using supported operations only.
3. Reconcile global bots once per organization (Agentix example: CEO, CTO, CFO, CMO, CPO, COO). Then reconcile each selected project's permanent Director and explicitly configured specialist instances, with isolated workspaces, project scopes and stable parent links. Do not replicate global executives per repo.
4. Use durable keys (organization + role/profile + project ID for project roles), persist provider IDs separately, detect ambiguous existing identities, and request explicit adoption or repair when necessary. Preview changes, create only missing authorized resources, preserve existing IDs, memory and user-owned configuration. No destructive reconciliation by default. Resume safely after partial failures.
5. Do not pre-create or start task-scoped supervisors, workers or verifiers during initialization; create on demand through the factory and release after task completion. Respect configured concurrency and budget constraints. Keep schedules, external effects and agent execution disabled until separately authorized.
6. Return a per-project/global reconciliation report: existing, created, skipped, conflicted, unsupported, and actual runtime status. A configured bot is not necessarily running. Unsupported ORCA launch/import/project operations produce a manual plan, not a success claim.

Single-project mode affects only the selected project's desired resources, references existing global roles (or reports missing prerequisites), and leaves unrelated projects untouched. Full-stack mode handles the complete declared project registry. Neither mode may infer permission from a repo manifest.

Acceptance: local adapter and verified ORCA adapter tests for full bootstrap, second-run zero duplicate creation, newly added project, isolated single-project bootstrap, partial failure/resume, preserved IDs/memory, and no task agents or schedules activated during init. Include dry-run and missing-capability checks. The command and ORCA integration remain proposed until separately implemented and tested.

## ORCA provisioning limitation and interim compatibility (2026-11-25)

Upstream references: [ORCA Bots](https://orca.dev/docs/bots), [issue #45374](https://github.com/stablyai/orca/issues/45374), [PR #46958](https://github.com/stablyai/orca/pull/46958). The reviewed upstream flow exposes `orca bot create --offer` from an existing bot context and requires human confirmation. The upstream PR and proposed standing permission ("Can create bots") are development signals, not evidence of a shipped, authorized or locally installed capability. Do not make unattended CLI bot creation a prerequisite for the initial milestone. Verify exact installed version, command help, runtime context and permission semantics before enabling automatic creation.

Interim workflow: resolve desired profiles and projects, inventory the existing runtime, map/adopt existing bots with explicit identity confirmation where needed, generate missing bot configurations, and present an assisted creation/import plan for the user to approve in ORCA. After approval, re-inventory and reconcile actual native IDs; keep pending/denied/unsupported entries distinct from created. Do not write undocumented internal configuration/database files, bypass approval, duplicate bots, copy credentials, activate schedules, or claim success from a proposal alone. Allow partial progress with existing bots and supported project/session operations. Repeated initialization must be idempotent and preserve user memory and settings.

Upgrade path: capability-gate a future official non-interactive provisioning interface when it is released and verified locally; require the applicable explicit or standing scoped grant, audit trail and the same reconciliation checks. Retain the assisted path as fallback. No current local runtime verification is claimed.

HSTACK V6 can proceed immediately with AgentSpec validation, profile composition, dry-run planning, stable identity reconciliation, local adapter and task-scoped execution through supported interfaces. ORCA adapter acceptance must cover existing-bot adoption, assisted creation, partial completion/resume, denied approval, unsupported creation, and zero duplicate creation; test automated provisioning only when capability and grant are confirmed. Distinguish persistent bot creation from execution-agent/session dispatch; do not assume one implies the other.

## Task lifecycle and operational control (V6)

Expose a generic task state machine and policy-driven ownership: proposed, queued, assigned, running, reported, verified, closed, blocked, paused, failed and cancelled. Keep native run status separate from task status. A durable task envelope records owner, scope, dependencies, acceptance criteria, limits, evidence, trace and idempotency keys. A policy adapter defines who can prioritize, dispatch, pause, cancel or reassign. Agentix supplies its specific CEO/COO/Director roles; do not hard-code them into the factory.

Instantiate the fewest necessary task agents, optional supervisors, workers and independent verifiers on demand; release ephemeral agents and leases after recorded terminal state and cleanup. Permanent actor identity and memory survive. Verification failure permits bounded rework or escalation, never automatic success.

Expose observed progress, heartbeats where supported, task age, retry counts, dependency blockers, token/cost/time budgets and worker capacity. Missing/stale telemetry is unknown, not zero. Enforce configurable ceilings and escalation at a trusted boundary; no endless retries, unauthorized spending or silent paid fallback. Support policy-authorized pause, resume, reprioritize, cancel and reassign; use checkpoint/evidence retention, fencing tokens and acknowledged stop/release before a conflicting replacement can run. Unsupported cancellation or pause must be reported explicitly. An authorized executive can intervene without bypassing hard safety/approval gates.

Acceptance: simulate a stalled agent, retry exhaustion, budget exhaustion, priority preemption, cancellation races, reassignment and failed verification across adapters; assert single ownership, no duplicate dispatch, no conflicting writes, accurate evidence and resource cleanup. Exact thresholds and adapter support remain open.

## Implementation and acceptance

1. Audit ORCA's native provisioning and HSTACK V6 actor contract; map supported capabilities.
2. Specify portable AgentSpec and profile interchange, composition precedence, policy and lifecycle; add validation tests.
3. Implement minimal local and ORCA adapters only through supported interfaces.
4. Prove on-demand creation of a novel task-scoped agent without Agentix, and import of a pinned Agentix profile without duplicating it. Verify repo-local manifests and restrictive overrides.
5. Test both adapters for capability failures, idempotency, conflict prevention, budget/permission enforcement, independent verification, cleanup, persistent identity and offline/restart reconciliation.
6. Benchmark against a single-agent baseline with fixed model and budget (success, latency, tokens, cost, duplication, recovery). Preserve V5 compatibility.

This RFC authorizes no implementation, merge, runtime activation, account connections or package release. Exact ORCA compatibility and performance remain unverified.
