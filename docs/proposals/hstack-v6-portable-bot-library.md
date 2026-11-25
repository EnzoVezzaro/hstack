# RFC: HStack V6 Agent Factory — dynamic agent composition and provisioning

Status: proposal only; complements [the V6 actor RFC](hstack-v6-runtime-agnostic-actors.md). Agentix owns its preconfigured bot catalog and organizational policies (https://github.com/EnzoVezzaro/agentix/pull/9). HSTACK owns the generic mechanism, not that catalog. V5 remains unchanged.

## Two distinct needs

Agentix Bot Library provides versioned, ready-made role profiles, including executive roles, specialists and project directors. HSTACK Agent Factory composes and creates agents on demand from a task specification or an imported external profile, attaches compatible skills, selects an allowed execution backend and manages the lifecycle. The factory supports both ephemeral task agents and persistent actors; no Agentix installation is required. Neither project has a mandatory dependency on the other. Do not embed the Agentix organizational chart or copy its profiles into HSTACK.

## ORCA reference and compatibility

Study ORCA templates, purpose/memory files, agent and computer selection, permissions, skills, automation, and worktree isolation: https://orca.dev/docs/bots , https://orca.dev/docs/bots/import , https://orca.dev/docs/bots/security , https://orca.dev/docs/bots/connectors . Audit exact source, installed version, schema and supported provisioning interfaces before implementing an adapter. Do not write undocumented live state. Report unsupported capabilities explicitly; schedules and external effects are disabled by default.

## Proposed portable contract

A versioned AgentSpec declares objective, optional role/profile reference, project/repo scope, skills, model and harness preferences, allowed capabilities, delegated authority, acceptance checks, budgets, lifetime, parent/owner, memory policy and output contract. An ActorInstance separately binds stable identity, provider references, state and task/run IDs. A task-scoped instance does not outlive the task unless a separately authorized persistence policy applies. A durable definition is not evidence of a running process.

The factory resolves a pinned external profile (optional), combines explicit task requirements with permitted defaults, validates capability compatibility and policy, and produces a dry-run provisioning plan. Permission composition is restrictive: generated instructions and local overrides cannot expand authority. Generated configurations are untrusted until validated. Credentials are references, never copied into profiles, memory seeds or logs. Project-local versioned manifests can reference external profiles or specify a standalone bot; mutable state stays outside Git.

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

## Implementation and acceptance

1. Audit ORCA's native provisioning and HSTACK V6 actor contract; map supported capabilities.
2. Specify portable AgentSpec and profile interchange, composition precedence, policy and lifecycle; add validation tests.
3. Implement minimal local and ORCA adapters only through supported interfaces.
4. Prove on-demand creation of a novel task-scoped agent without Agentix, and import of a pinned Agentix profile without duplicating it. Verify repo-local manifests and restrictive overrides.
5. Test both adapters for capability failures, idempotency, conflict prevention, budget/permission enforcement, independent verification, cleanup, persistent identity and offline/restart reconciliation.
6. Benchmark against a single-agent baseline with fixed model and budget (success, latency, tokens, cost, duplication, recovery). Preserve V5 compatibility.

This RFC authorizes no implementation, merge, runtime activation, account connections or package release. Exact ORCA compatibility and performance remain unverified.
