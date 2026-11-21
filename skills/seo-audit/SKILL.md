---
name: seo-audit
description: "Use when the user asks for a technical SEO audit, meta tag or structured data review, sitemap or robots check, or Core Web Vitals review. Reports issues ranked by impact with fixes."
---

# SEO audit

This skill extends the **W7 Contenido, productos y docs** workflow.

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
