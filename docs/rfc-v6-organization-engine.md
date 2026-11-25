# RFC: HSTACK v6 — Organization Engine

Status: draft proposal, 2026-11-25. No runtime implementation or activation. This proposes a new v6 direction relative to draft #9 (portable actors and adapters); reconcile that RFC explicitly before merging. V5 and its 62 reusable model-agnostic skills remain supported.

## Product vision

HSTACK evolves from a multi-repo skill collection into a CLI engine that turns a natural-language description of a business into an operational organization inside ORCA. ORCA is the runtime and source of truth; HSTACK is the organization designer, bootstrapper and skill library. Agentix is the reference governance architecture (https://github.com/EnzoVezzaro/agentix/pull/11), not a mandatory runtime dependency. No parallel orchestrator, task database, scheduler or daemon. Other runtime adapters are deferred, not promised.

## User experience (proposed commands, not shipped)

- `hstack init`: interactive interview: what organization do you want to create? Gather mission, products/services, existing or new projects, repositories, constraints, available models/tools and owner approval preferences. Ask only necessary questions.
- `hstack plan`: generate an inspectable organization blueprint, role profiles, project graph, repository creation/adoption plan, skills, model routing, permissions, schedules, review gates and cost assumptions. Show a dry-run diff and missing capabilities.
- `hstack apply`: after explicit owner approval, reconcile approved resources through verified native ORCA interfaces. Never create remote repositories, spend money or activate schedules without applicable authorization.
- `hstack status`, `hstack doctor`, `hstack reconcile`: inspect actual native state, capability gaps, drift and recovery; no fabricated status. Destructive changes require separate approval.

Example: "I'm starting a software agency that builds SaaS products and provides consulting." Generate relevant product and client projects, proposed repositories, executive departments, specialist roles and operating workflows, rather than a fixed generic company. Support greenfield and existing ORCA installations.

## Architecture

```mermaid
flowchart TD
 H[Human owner] --> CLI[HSTACK v6 CLI]
 CLI --> B[Organization blueprint and approval]
 B --> O[ORCA native provisioning]
 subgraph R[ORCA runtime]
 C[CEO Agent] --> X[Chiefs: CTO CPO CMO CFO COO]
 C --> D[Project Directors]
 X -. coordinate .-> D
 X --> SP[Department specialists]
 D --> S[Supervisors]
 S --> W[Workers]
 T[Native tasks and decision gates]
 A[Native automations]
 M[Independent bot memory and SOUL]
 G[Runtime Guardian]
 Q[Independent L1 L2 L3 review]
 P[Projects and repositories]
 end
 O --> C
 O --> P
 A --> T
 W --> T
 T --> Q
 T -. events .-> G
 C --- M
 D --- P
 H --> C
```

## Governance and execution

Human retains final authority over CEO, external commitments, merges, deployments, deletions and new spending. CEO and each Chief jointly agree on departmental decisions, initiatives, resources and schedules case by case; no fixed budgets. Agents may communicate directly but assignment follows role grants. CEO directs the organization; each project has a Director, only Directors create Supervisors, only Supervisors create Workers. Default global four-active-worker cap; free worker models, no silent paid fallback. Every task has independent L1 review, L2/L3 as risk requires, human assigns CEO review. Each bot has stable identity, distinct SOUL, memory, skills, model policy and explicit permissions. Specialists are generated for actual business needs; do not proliferate permanent agents without approval. ACC mandatory for project Directors; ProAgents optional. HSTACK skills remain portable and are selected by role and need, not indiscriminately loaded.

Use native persistent tasks, dependency graphs, dispatch attempts, decision gates, evidence and review; reconcile before creating tasks. Native completion is not organizational acceptance. Guardian is event-driven, observe-only initially, with authorized intervention and learning provenance. Default schedules: CEO morning/evening; CTO and CFO every four hours; CPO daily; CMO every six hours; COO hourly; Directors every two hours. Configurable, disabled until approved, with timezone, deduplication and budget checks. Chief and CEO agree on changes.

## Engine implementation

1. Discover installed ORCA version, projects, bots, skills, models, connectors and documented capabilities. Audit native automations, event triggers, prechecks, memory upkeep, worktrees, checkpoints, status hooks, remote hosts, artifacts and browser/computer-use. Record evidence and gaps; experimental orchestration requires local validation.
2. Define a versioned declarative blueprint schema (organization, roles, projects, repos, skills, policies, grants, schedules, review, dependencies). Validate references, uniqueness and constraints. Keep secrets outside blueprints.
3. Build interactive requirements capture and blueprint generation with human-readable preview; treat generated output as untrusted until schema and policy checks pass.
4. Implement native ORCA provisioning adapter using verified APIs only. Adopt existing identities explicitly, preserve memory, idempotently reconcile resources, record native IDs, resume partial failures and provide rollback plan. If native capability missing, block or guide assisted setup, never simulate success.
5. Bootstrap CEO, Chiefs, projects and Directors, then approved specialists and operational policies. Dynamic Supervisors/Workers created only as needed. Provision schedules disabled first; validate and activate separately with owner approval.
6. Integrate existing HSTACK skill contracts and model routing; document V5 migration, backward compatibility and CLI packaging choices. Do not remove existing skills or change current behavior in this RFC.

## Acceptance

- Two materially different businesses produce appropriate, distinct organizations; greenfield and adoption flows work.
- Dry run causes no external changes; repeated apply creates no duplicates; restart resumes partial provisioning; existing identities and memory survive.
- Unsupported APIs, unavailable models, missing grants, invalid blueprints and failed provisioning are surfaced accurately.
- Test governance, unauthorized delegation, fifth concurrent Worker rejection, free-only worker routing, independent review, scheduler overlap and Guardian event coverage.
- Verify actual ORCA state and end-to-end task evidence, including non-code tasks; measure cost and latency against V5 baseline.
- No automatic remote repository creation, external publication, paid commitment, destructive action or production activation without applicable human approval.

## Open decisions

CLI language/package distribution, exact native API availability, organization isolation across multiple companies, blueprint persistence format, and whether portable runtime adapters from #9 return later. Resolve with evidence and owner approval. This RFC is a proposal, not a release or proof of working runtime.

## Prompt-first autonomous engine — owner refinement

The primary UX is one guided session, not a sequence of mandatory manual commands. Launch HSTACK, select an installed supported agent harness (e.g. Codex, Claude Code or OpenCode), select the target ORCA application/host/workspace, then describe the desired organization in natural language. The selected harness drives the entire workflow: discover capabilities, select or compose templates, generate and validate the blueprint, present one consolidated approval plan, and automatically provision and verify all authorized resources. Ask follow-up questions only for essential missing information. Existing CLI subcommands remain optional expert/recovery entry points. No manual bot-by-bot setup when native APIs support automation; explicitly report unsupported steps. Approval boundaries remain intact.

Generate the entire organization: mission, business model, departments, CEO and Chiefs, project Directors, specialist profiles, independent SOUL/memory, role grants, model routing, HSTACK skills, projects and repositories, ACC-compliant project initialization, operating procedures, tasks, schedules, review gates, Guardian and relevant integrations. Establish actual native IDs and verify end-to-end operation. The harness is the design/provisioning agent, not a replacement for ORCA as runtime. Discover harness authentication and supported capabilities without exposing credentials. Verify target identity and scope before writes; never accidentally provision into another organization.

### Initial template catalog: 50 organization archetypes

Templates are composable, versioned blueprints with role/project defaults, skills, operating workflows, risk/approval policies and optional integrations; adapt to the prompt rather than blindly cloning. Initial catalog:

1. SaaS
2. Open-source project
3. Charity/nonprofit
4. Physical retail business
5. Software agency
6. IT consulting
7. AI product studio
8. Developer tools
9. API platform
10. Cybersecurity consultancy
11. Managed IT services
12. Data analytics consultancy
13. E-commerce
14. Marketplace
15. Affiliate publishing
16. Subscription commerce
17. Digital products
18. Wholesale distribution
19. Manufacturing
20. Consumer goods brand
21. Restaurant
22. Catering
23. Hospitality
24. Local services
25. Repair shop
26. Logistics
27. Real estate services
28. Property management
29. Marketing agency
30. SEO agency
31. Creative studio
32. Media publication
33. Content creator business
34. Podcast network
35. Game studio
36. Education platform
37. Training consultancy
38. Research lab
39. Community organization
40. Membership association
41. Foundation
42. Social enterprise
43. Event production
44. Recruitment agency
45. Professional services
46. Accounting practice support
47. Financial research organization
48. Healthcare administration support
49. Agriculture business
50. Hardware/robotics startup

Regulated templates require appropriate human oversight and jurisdiction-specific review; do not claim legal compliance or autonomous professional authority. ACC compliance refers to the approved project knowledge contract, not regulatory certification. Template catalog is an initial proposed taxonomy; test all 50 schemas and representative end-to-end deployments across SaaS, OSS, charity and physical business. Include custom/hybrid organizations and template extension. No activation, external commitments or new spend without applicable owner authorization.
