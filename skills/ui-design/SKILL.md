---
name: ui-design
description: "Use when the user asks to design or adjust a UI, landing page, styles, or logo. Inspects the real screen at desktop and phone widths before and after changes."
---

# Design UI and landing

This skill covers the **W10 Diseño UI / landing** workflow.

## HStack V5 role

Layer 3 sets the direction; Layer 4 implements; Layer 5 checks the real screen. See [hstack-v5.md](../../docs/hstack-v5.md).

1. Inspect the actual screen at desktop and phone widths with `interface-check`.
2. Use the project's existing tokens and components. Do not invent new ones.
3. Check contrast, focus states, and responsive layout.
4. Make logos or images only when asked.
5. Apply the `antislop-ui` rules, then confirm the result with a fresh screenshot.

## Report

Before and after screenshots, the issues found, what was changed, and what still looks off.
