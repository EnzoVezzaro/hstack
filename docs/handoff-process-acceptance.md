# Handoff and process acceptance scenarios (V5)

Documented acceptance scenarios for natural-language skills. No runtime harness, agent, or process was exercised to produce them: runtime behavior is **NOT RUN**. Verify in a connected consumer project.

| # | Request | Expected | Boundary |
| --- | --- | --- | --- |
| 1 | "prepare a handoff brief" | Brief saved, state **prepared** or **NOT SENT** | No message sent; no receiving session claimed |
| 2 | "hand this to the existing worker" with a verified live session | One message to that session, receipt observed, state **delivered** | Original ownership stops; no duplicate dispatch |
| 3 | No live Orca or no verified receiver | **NOT SENT** with exact destination requirements | No invented agent response |
| 4 | `/run-local <project>` (user-facing run) | App left running, URL and how to stop it reported | Do not stop it at the end of the request |
| 5 | `/run-local` for an explicitly temporary verification | Server started, checked, then stopped by its owner | Report that it was temporary |
| 6 | `visual-test` calls `run-local` | Server stays up through the visual pass | Stop only the exact owned PID when the workflow finishes |
| 7 | Pre-existing server used by another process | Not stopped or restarted | Report as caller-owned |

State labels come from [handoff](../skills/handoff/SKILL.md); process ownership comes from [run-local](../skills/run-local/SKILL.md) and [visual-test](../skills/visual-test/SKILL.md).
