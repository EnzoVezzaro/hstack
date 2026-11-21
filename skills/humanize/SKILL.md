---
name: humanize
description: "Use when the user asks to make text sound human, to remove AI writing patterns, or to review prose before publishing. Rewrites the text using the humanizer rules without changing what it says."
---

# Humanize text

This skill extends the **W7 Contenido, productos y docs** workflow.

## HStack V5 role

Layer 4 rewrites with the free model; the owner approves the final text. See [hstack-v5.md](../../docs/hstack-v5.md).

1. Load the `humanizer` skill and follow its rules. Where it is not installed, use the rules in `antislop-copywriting`.
2. Keep every fact, number, name, and link. Do not add claims.
3. Remove the patterns it lists, strongest first: contrast staging, dashes everywhere, forced triads, inflated claims, stock words, and bold labels.
4. Read the result once as the intended reader. Cut any sentence that adds nothing.

## Report

The rewritten text, a short list of the patterns removed, and any claim you could not verify and left unchanged.
