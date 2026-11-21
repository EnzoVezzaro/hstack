---
name: run-local
description: "Use when the user asks to run the app locally or open localhost to see it. Starts the project, checks the main path, and reports the URL."
---

# Run and test locally

This skill covers the **W6 Correr y probar en local** workflow.

## HStack V5 role

Layer 4 starts the project; Layer 5 (Ego Lite) can take over the browser check. See [hstack-v5.md](../../docs/hstack-v5.md).

**Model tier:** T0. See [model-routing.md](../../docs/model-routing.md).

1. Use the project's documented start command. Do not guess one.
2. Wait until the server answers. Then open the URL in the browser (`ego-browser` or the built-in browser).
3. Check the main path and the console for errors.
4. Take a screenshot when the question is visual.
5. Stop the server only if this run started it.

## Report

URL, what was checked, console errors if any, and the screenshot path if taken.
