# RFC: HStack V6 — Runtime-agnostic actors and persistent automation

> **Status: PROPOSAL / DISCUSSION ONLY — NOT ACCEPTED, NOT IMPLEMENTED.**
>
> **Target: HStack V6 (future major version).** V5 remains the shipped architecture and its existing Orca-oriented behavior is unchanged. This RFC does not authorize an implementation, migration, release, or deployment.

## Why this proposal exists

Orca's emerging Bots model raises a useful architectural question: should HStack support named persistent agents, bot-to-bot coordination, retained memory, integrations, and triggers without requiring Orca? **Yes, as a V6 design goal, subject to validation.** Orca should remain a first-class, potentially default adapter, but not define HStack's portable data contracts.

V5 consists primarily of portable Agent Skills and operational guidance. Its [execution contract](skill-contract.md) currently states that Layer 2 is Orca and that Orca owns the live sessions, worktrees and routing. That is appropriate for V5, but it makes a vendor-specific product the conceptual orchestrator. V6 should distinguish **HStack's logical actors, tasks, policy and desired state** from **provider-owned execution state**.

Reference starting points (check release/API support during implementation):
- Orca Bots documentation: https://orca.dev/docs/bots
- Orca connectors: https://orca.dev/docs/bots/connectors
- Orca security: https://orca.dev/docs/bots/security
- Agent Skills: https://agentskills.io
- Current HStack contracts: [skill-contract.md](skill-contract.md), [hstack-v5.md](hstack-v5.md)

**Research caveat:** Browser/UI feature availability does *not* prove a stable public CLI, SDK, webhook, or API exists. A future spike must establish the actual discoverable Orca operations; unsupported operations stay explicitly unsupported.

## Goals

1. Make Layer 2 a **runtime-neutral orchestration capability**, with Orca as one adapter rather than a dependency of the specification.
2. Represent persistent and ephemeral agents with a portable **Actor** identity and a runtime binding; do not confuse a bot identity, a chat/session, and a live process.
3. Preserve project/repo/worktree boundaries, bounded task ownership, independent verification, and explicit human approval gates from V5.
4. Support durable task handoff, structured events, scheduled work, restart recovery, and optional memory without promising 24/7 execution.
5. Keep existing `/hstack`, `/relay-room`, `/coordinate-agents`, `/horizon`, `/benchmark`, etc. stable or offer an explicit, documented migration.
6. Prove vendor independence with a **no-Orca** end-to-end acceptance path, not merely unit-tested interfaces.
7. Make runtime features capability-negotiated, optional, observable and fail-closed.

## Non-goals

- Shipping V6 or changing V5's current behavior as part of this RFC.
- Cloning the Orca Bots UI, assuming an Orca API exists, or coupling HStack to Orca's @mention format.
- Turning all Agent Skills into daemon services.
- Mandating a particular model, provider, memory database, cloud host, identity wallet, MCP server or message bus.
- Granting autonomous agents permission to merge, deploy, publish, delete, purchase, or contact external parties by default.
- Treating a persisted actor record as proof that an agent process is alive.

## Logical architecture

```text
                 HStack Skills / CLI / Assistant
                              |
                   HStack V6 Core (optional)
            actor registry | tasks | events | policy
             memory refs   | scheduler | evidence
                              |
                    RuntimeAdapter API
             +----------------+----------------+
             |                |                |
           Orca             Local        Other providers
       bots/sessions     processes/CLI   capability-dependent
             |                |                |
        execution         execution          execution
```

Skills remain ordinary `SKILL.md` documents, independently installable in supported harnesses. HStack's **optional runtime** provides durable coordination when requested. The absence of the runtime must not make basic skills unusable.

### Minimal proposed types (illustrative, not committed API)

```ts
type ActorKind = "persistent" | "ephemeral";
type Role = "assistant" | "director" | "supervisor" | "worker";

interface Actor {
  id: string;                 // HStack portable ID, not provider session ID
  name: string;
  kind: ActorKind;
  role: Role;
  projectScopes: string[];
  runtimeRef?: { adapter: string; providerActorId?: string };
  capabilityRequirements: string[];
  memoryRef?: string;         // pointer; not secret or raw transcript
  policyRef: string;
}

interface Task {
  id: string;
  project: string;
  repo?: string;
  baselineRevision?: string;
  worktreeRef?: string;
  ownerActorId?: string;
  objective: string;
  acceptance: string[];
  permittedResources: string[];
  requiresApprovalFor: string[];
  idempotencyKey: string;
}

type TaskState =
  | "proposed" | "queued" | "assigned" | "running"
  | "blocked" | "reported" | "verified"
  | "cancelled" | "failed";

interface RuntimeAdapter {
  discover(): Promise<Capabilities>;
  listActors(): Promise<RuntimeActor[]>;
  dispatch(task: Task): Promise<{ runId: string; state: TaskState }>;
  inspect(runId: string): Promise<RuntimeRun>;
  cancel(runId: string): Promise<void>;
  // Optional: event stream, schedules, memory sync, actor provisioning
}
```

The actual contracts need versioning, serialization rules, explicit error classes, and a well-defined compatibility policy. Not every provider supports every operation; never simulate success when a capability is absent.

## Proposed feature boundaries

| Concern | Portable HStack responsibility | Provider/adapter responsibility |
| --- | --- | --- |
| Identity | Stable actor ID, role, purpose, policy reference | Native bot/session IDs, runtime credentials |
| Lifecycle | Desired state, assignments, reconciliation record | Start/stop/reconnect when supported |
| Coordination | Structured task envelope, receipt, state, one owner | Transport: native messages, CLI, MCP or other |
| Memory | Permissioned memory references, provenance, retention | Optional provider memory operations |
| Events | Normalized event envelopes, dedupe, durable cursor | Native hooks, polling, webhooks if supported |
| Schedules | One canonical job definition and active lease | Scheduler implementation and execution receipts |
| Tools | Declared capabilities, least-privilege allowlists | Tool discovery and invocation |
| Worktrees | Repo/revision/resource ownership invariants | Provider worktree or isolated local environment |
| Evidence | Tests/logs/diffs at reported revision, independent reviewer | Collect raw receipts, links and artifacts |
| Approval | Human-scoped authority, auditable hard gates | Enforce operations where possible; deny otherwise |

### Collaboration / handoffs

Do not canonize Orca groups or `@mentions` as the core protocol. Define handoff envelopes with `taskId`, `sender`, `receiver`, `project`, `scope`, `traceId`, `idempotencyKey`, `ackState`, and evidence links. Provider adapters map the envelopes into their own transports. Acknowledged delivery is **not** accepted work; accepted work is **not** verified completion.

### Persistence / host availability

A persistent actor means durable *identity and state*, not an immortal process. Define statuses such as `configured`, `reachable`, `running`, `offline`, `stale`, and `unknown` separately from task state. On restart, reconcile against live provider state and replay only operations safe under idempotency policy. Never auto-respawn duplicate owners for the same bounded task.

### Scheduling and event security

Normalize webhook, timer, CI, issue and message triggers; include source, timestamp, authenticated sender when available, event ID, target scope and replay prevention. Use a single schedule owner/lease to avoid duplicate execution across Orca and local backends. Distinguish event-triggered proposals from authorized actions.

External connectors and bot chats are untrusted inputs; prompt content must not bypass tool permissions. Require explicit owner approval for outward-facing or destructive effects. Enforcement must happen at a trusted execution boundary, **not solely in an agent prompt**. Secrets are never copied into memory/logs/task envelopes.

## HStack V5 → V6 impact map (planning only)

| Current area | V6 proposal |
| --- | --- |
| `docs/skill-contract.md` | New versioned V6 contract; leave V5 normative until cutover |
| `/hstack` | Route using runtime capability discovery, with offline/no-runtime behavior |
| `/relay-room` | Generic handoff to a verified receiver; Orca-specific messaging lives in adapter |
| `/coordinate-agents` | Actor/task registry and bounded ownership independent of provider |
| `/horizon` | Schedule abstraction and durable progress, provider-backed execution |
| `/resume-work`, `/resume-all` | Reconcile logical tasks with actual provider sessions after restart |
| `/setup-hstack` | Explicit adapter detection, capabilities, tier selection |
| `/benchmark` | Add interop, offline, event, restart, idempotency and security benchmarks |
| `/token-balancer` | Provider-neutral quota observations, never assume a quota API |
| `AGENTS.md`, ACC, ProAgents, ACE | Optional mappings; keep independent ownership and existing instructions |

Do not rename or remove routes based solely on this RFC. Provide a per-skill migration plan, compatibility table and deprecation window before implementation.

## Recommended staged plan (each phase requires separate approval)

**Phase 0: Evidence / design review.** Inspect official Orca bot commands and APIs, authentication, permissions, bot lifecycle, worktree semantics, scheduling, and restart behavior. Audit HStack's 62 routes for actual Orca assumptions; publish a gap table. Document alternative runtimes, including a basic local implementation.

**Phase 1: Contract RFC.** Define portable JSON Schemas and TypeScript types, adapter capability negotiation, errors, task lifecycle, policy checks and source-of-truth rules. Review identity conflicts, re-entrancy, concurrent updates, retries and portability.

**Phase 2: Minimal reference runtime.** Build actor registry, deterministic queue, durable event journal, explicit policy gate and local adapter. Test without Orca, with one worker and one director. Do not introduce external infrastructure as a requirement.

**Phase 3: Orca adapter spike.** Map *verified* public Orca capabilities. Unsupported features return structured `unsupported` rather than fake success. Test native bot, chat, schedule and worktree operations only when exposed by the installed version.

**Phase 4: Controlled interoperability.** Run matched tasks in local vs Orca configurations, fixed model/budget/context; test persistent identity, handoff, timeout/retry, offline host, replay, duplicate dispatch, authorization, cross-repo scope, and human approval behavior.

**Phase 5: Opt-in migration.** Version the contract, document V5 compatibility, add an experimental feature flag, provide rollback instructions and only then consider V6 release.

## Acceptance criteria for any eventual V6 implementation

- Same portable task and Skill succeed through both an Orca adapter and a **completely Orca-free** adapter without changing the Skill.
- Persistent identity survives a process restart, while status accurately reports offline execution.
- Duplicate event delivery, scheduler resumption and dispatch retries do not create duplicate active ownership.
- A multi-repo request never writes into the wrong repo/worktree; verification names the exact revision.
- Unsupported adapter capability produces an explicit error and an **unsent/unexecuted** status.
- Missing or invalid approval blocks merge, deployment, publication, destructive action, purchases and external messages.
- Agent-generated reports never count as independent verification; reported and observed results remain distinguishable.
- Benchmarks record task success, cost, tokens, latency, reproducibility, and failure/recovery across a controlled matrix.
- V5 remains usable and its existing skills keep working throughout an opt-in migration.

## Open design questions

1. Should HStack own a minimal on-disk actor registry, or expose an interface with multiple backends from day one?
2. Which memory fields are portable, and how do we avoid leaking secrets or silently merging conflicting history?
3. How should actor identity map across multiple simultaneous Orca/other-provider runtimes?
4. Should schedules be HStack-owned, provider-owned with a lease, or both under a clearly elected owner?
5. Which adapter capabilities can be guaranteed universally versus optional?
6. What versioning strategy allows V5 Skill-only users to avoid installing runtime dependencies?
7. What independent benchmark evidence is sufficient to justify adopting the new runtime as default?

## Decision requested

**Review and discuss as a V6 proposal. Do not implement, change V5 defaults, open persistent bot processes, consume paid quotas, or start migration until a separate implementation scope is explicitly approved.**
