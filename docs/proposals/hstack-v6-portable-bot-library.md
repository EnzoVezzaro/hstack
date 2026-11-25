# RFC: HStack V6 portable bot library and organization policy

Status: proposal only; complements [the V6 actor RFC](hstack-v6-runtime-agnostic-actors.md). Agentix is a consumer and reference organization, not a hard-coded dependency: https://github.com/EnzoVezzaro/agentix/pull/9 .

## Objective

Ship a reusable, model- and harness-neutral catalog of preconfigured bots and a policy library. Users select a role, bind it to a project/runtime, preview the plan, and explicitly provision it through an adapter. Roles are durable configuration, not proof of a live process. Keep V5 skills independent and unchanged.

## ORCA reference and evidence

Official documentation: https://orca.dev/docs/bots , https://orca.dev/docs/bots/import , https://orca.dev/docs/bots/security , https://orca.dev/docs/bots/connectors . ORCA offers bot templates with a purpose and optional abilities/schedules, a selected computer and agent, persistent Markdown persona/memory (SOUL.md and MEMORY.md per https://github.com/stablyai/orca), connector permissions, separate worker worktrees, and manual approval. Template schedules initially remain off. Treat these as behavior and interoperability requirements, not a stable import API. Inspect the exact installed version, native template implementation, serialization, IDs, skill loading, automation schema and permission semantics before implementing any writer. Use supported CLI/API/import only; never mutate undocumented live state or copy credentials.

## Proposed package contract

A portable profile has version, stable template ID, display name, purpose, role, parent-role constraints, skills, model/harness preferences, permission requirements, resource/budget ceilings, allowed delegation, memory policy, trigger declarations and output/verification contract. A separate instance binds an ID, project, parent instance, runtime adapter and host. Use credential references only. Default grants deny outward/destructive effects; triggers disabled at installation.

Illustrative layout (not ORCA's native file format):

    bot-library/
      schema/bot-profile.schema.json
      profiles/ceo/bot.yaml
      profiles/ceo/SOUL.md
      profiles/ceo/MEMORY.md
      profiles/ceo/skills/
      profiles/cto/...
      organizations/software-house.yaml
      adapters/orca/
      adapters/local/

MEMORY.md in a published profile is a clean seed, never personal or live memory. Mutable memory and native provider IDs belong in local instance state. Provide versioned profiles, validation, manifest provenance, deterministic reconciliation and safe upgrades that preserve user changes. Prefer composition/inheritance with explicit policy precedence and reject cycles. No hidden provider-specific state in the canonical format.

## Initial catalog and hierarchy

Software-house pack: CEO Agent; CTO, CPO, CMO, CFO, COO; Project Director, SEO, Marketing, Distribution, Social Media, Job Hunting & Income, Supervisor, Worker, Verifier. CEO is owner-facing; five heads report to CEO; Directors report to CTO, growth specialists to CMO, income specialist to CFO. Supervisors/workers are task-scoped, verifier independent of author. These are optional profiles; a generic HStack installation may retain an Assistant or use any other topology. Agentix specifically replaces its Assistant. Do not require all profiles to run or exist for simple tasks.

## Coordination invariants

Single task owner and one reporting parent per actor; no circular delegation; minimal agents and scoped context; independent tasks parallelize, conflicting resources serialize; explicit delegation envelope and revocable grants; deterministic state machine, resource leases, idempotency, retry budgets and independent verification. Route disputes to lowest common authority; no agent can expand its grant. Compare against single-agent baseline for correctness, cost/tokens, latency and recovery. Policy enforcement belongs at the trusted execution boundary, not only in SOUL.md.

## Proposed API surface (illustrative)

- validateProfile(profile), resolveProfile(templateId, version)
- planProvision(profile, binding, capabilities) -> reviewed diff and unsupported capabilities
- provision(plan, explicitApproval) -> instance receipt
- inspect(instance), reconcile(instance), pause/cancel(run)
- authorize(actor, action, scope), assign(task), verify(task, evidence)

CLI and package names/language remain design choices. No provisioning command should silently enable schedules, attach accounts, spend money, or expose secrets. Dry-run reports unsupported capability rather than faking success. Adapter must expose actual provider state separately from desired state.

## Daily operations

Optional software-house schedule pack: CEO-led standup, COO status aggregation, daily retrospective, event-driven task intake. Schedules are configurable, off by default and keyed by single durable lease. Agentix's 06:00–06:30 America/New_York cadence belongs to its organization config, not library defaults.

## Implementation plan and acceptance

1. Audit ORCA upstream source and installed version; map profile fields, supported creation/import, permissions, memory, triggers and lifecycle. Record capability gaps and license/provenance if reusing code.
2. Define versioned portable schema and policy tests. Add first CEO/Director/Worker/Verifier profiles and expand catalog after a working path.
3. Implement a local adapter and ORCA adapter using supported interfaces; no ORCA dependency for basic library use.
4. Demonstrate the same profile/task through both adapters, dry-run, approval gating, upgrade without duplicate actors, offline/restart recovery, conflicting task rejection, independent verification and disabled schedules by default.
5. Benchmark single-agent vs supervised execution on identical tasks/models/budgets; include sequential and parallel workloads, token/cost, latency, error propagation and recovery.
6. Link accepted design to V6 actor contract; keep V5 unchanged until separately approved migration.

This RFC creates no runtime, package release, bots, schedules or account connections. Implementation and exact adapter mapping require separate approval and verification.
