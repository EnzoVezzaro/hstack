# RFC: HStack V6 Agent Factory — dynamic agent composition and provisioning

Status: proposal only; complements [the V6 actor RFC](hstack-v6-runtime-agnostic-actors.md). Agentix owns its preconfigured bot catalog and organizational policies (https://github.com/EnzoVezzaro/agentix/pull/9). HSTACK owns the generic mechanism, not that catalog. V5 remains unchanged.

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
