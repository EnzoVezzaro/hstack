---
name: haf
description: "Use when the user types /haf or wants unusual UI or design inspiration from the web: Awwwards, Dribbble, Pinterest, Codrops, and other places where experimental interfaces live. Collects references with links and screenshots, explains what makes each one work and how it is built, and proposes directions. Does not copy anyone's work."
---

# HAF: hunt for weird UI inspiration

**Execution contract:** Follow the [HStack skill execution contract](../../docs/skill-contract.md). Resolve the actual project or artifact, check available tools and live state, preserve unrelated work, and distinguish observed verification from reported claims.

Goes looking for interfaces that are stranger and better than the usual, and comes back with references you can actually use.

## HStack V5 role

Layer 5 (Ego Lite) browses and takes screenshots; Layer 4 collects and annotates; Layer 3 turns the references into design directions.

**Model tier:** T0 collects; T2 writes the directions. See [model-routing.md](../../docs/model-routing.md).

1. Agree the brief: what is being designed, the mood, and anything off-limits (brand colors, accessibility needs, performance budget).
2. Search the sources that fit. Use `ego-browser` to open pages and take screenshots; use web search to find specific pieces.
   - [Awwwards](https://www.awwwards.com) for award-winning sites and interactions;
   - [Codrops](https://tympanus.net/codrops) for experimental effects with tutorials and source code;
   - [Dribbble](https://dribbble.com) and [Behance](https://www.behance.net) for visual concepts;
   - [Pinterest](https://www.pinterest.com) for moodboards and visual direction;
   - [CodePen](https://codepen.io) for working effects you can read;
   - [Godly](https://godly.website) and [Mobbin](https://mobbin.com) for real product UI patterns.
3. Collect eight to fifteen references. For each: the link, a screenshot, what makes it interesting (layout, type, motion, color, interaction), and how it is likely built (CSS, canvas, WebGL, a library). Prefer references with source or a tutorial.
4. Group them into two or three directions that fit the brief. Note what each direction costs in effort and performance, and any accessibility risk (motion, contrast).
5. Save the moodboard as a markdown file with links and screenshots in the repo (for example `docs/inspiration/<topic>.md`).
6. Use the references for ideas and techniques. Do not copy layouts, assets, or code without checking the license.
7. Hand the chosen direction to `ui-design`, or to `motion-graphic` for animation.

## Report

The brief, the references with links and notes, the directions with their trade-offs, and where the moodboard was saved.
