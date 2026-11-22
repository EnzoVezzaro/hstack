---
name: seo-audit
description: "Use when the user asks for a technical SEO audit, meta tag or structured data review, sitemap or robots check. Not for unrelated work."
metadata:
  author: Enzo Vezzaro
  tags: [hstack, layer3]
---

# SEO audit

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## Purpose

Use when the user asks for a technical SEO audit, meta tag or structured data review, sitemap or robots check.

## Prerequisites

Resolve the named `<project>` to the real repository and worktree, read its `AGENTS.md` and current changes, and confirm the tools this workflow needs are available before acting.

## Limitations

A skill is a procedure, not proof that an agent, model, subscription, Orca session or browser tool is live. Do not report a check that was not run.

## Troubleshooting

If a tool, session or required state is unavailable, stop that action and record the exact blocker. Validate the result on the reported revision; treat errors, failed checks and unverified reports as failures, never as passes.


**Example:** `/seo-audit <project>` — name the target project and keep the work bounded.

## HStack V5 role

Layer 3 ranks the issues; Layer 4 applies the agreed fixes. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0 collects; T2 ranks. See [model-routing.md](../../docs/model-routing.md).

1. Crawl or read the pages in scope: titles, meta descriptions, canonical tags, headings, and internal links.
2. Check robots.txt, the sitemap, structured data validity, and indexability.
3. Check Core Web Vitals on the main pages when a measurement is available. Say when it is not.
4. Rank the issues by impact on search visibility and by effort to fix.
5. Fix only what the user asks for. Keep content changes in line with `humanize`.

## Report

Issues ranked by impact, each with page, evidence, and the fix. List what was not measured.
