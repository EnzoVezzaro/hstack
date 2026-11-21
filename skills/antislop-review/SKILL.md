---
name: antislop-review
description: "Use when the user asks to check a UI, copy, or code for generic AI-generated patterns. Applies the antislop rules that match the artifact and reports the specific fixes."
---

# Antislop review

This skill extends the **W10 Diseño UI / landing** workflow.

## HStack V5 role

Layer 4 applies the rules; Layer 3 decides on the requested exceptions. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. Load the `antislop` core rules. Then load the matching part: `antislop-ui` for interfaces, `antislop-copywriting` for text, `antislop-code` for code comments, `antislop-human` for accessibility, `antislop-layoutmobile` for responsive layouts.
2. Scan the artifact against those rules. Note each hit with its location.
3. Keep anything the user asked for explicitly, even if it matches a pattern. The user's words win.
4. Fix the hits that are not requested. Keep the change set small.
5. Recheck the changed parts.

## Report

Each hit with location and rule, what was fixed, and what was kept on purpose.
