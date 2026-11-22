---
name: motion-graphic
description: "Use when the user asks for a motion graphic, animated explainer, title card, or short video made with code. Builds the composition with the HyperFrames skills and renders it."
---

# Motion graphics

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

## HStack V5 role

Layer 4 builds the composition; Layer 1 confirms the message and format with the owner. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T1 builds; T2 checks the message. See [model-routing.md](../../docs/model-routing.md).

1. Define the message, duration, aspect ratio, and the output file. Ask once if any is missing.
2. Load `hyperframes` for the workflow, then `hyperframes-core` for the composition contract and `hyperframes-animation` for motion.
3. Use `hyperframes-registry` before building a named effect by hand.
4. Add audio only if the user asks, using `media-use` and `hyperframes-audio`.
5. Preview, check the frames at key moments, then render.

## Report

Output file path, duration, aspect ratio, render command used, and the frames checked.
