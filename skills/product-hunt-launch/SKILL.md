---
name: product-hunt-launch
description: "Use when the user asks to prepare or publish a product on Product Hunt. Prepares the listing, assets, and first comment, and posts only after explicit approval."
---

# Product Hunt launch

This skill extends the **W7 Contenido, productos y docs** workflow.

## HStack V5 role

Layer 3 drafts the listing; the owner approves before anything is posted. See [hstack-v5.md](../../docs/hstack-v5.md).

1. Read the product's README, landing page, and current status. Note what is real today and what is planned.
2. Draft the tagline (under 60 characters), description, first comment, maker intro, and gallery list. Apply `antislop-copywriting` and `humanize` to the drafts.
3. Check the assets: logo, thumbnail, screenshots at the required sizes. Create missing ones with `motion-graphic` or `ui-design` only if asked.
4. Verify every link and claim. Remove any claim that cannot be shown.
5. Show the full draft to the user. Post or schedule only after explicit approval, since it is public.

## Report

The draft listing, the asset checklist with gaps, the claims that were verified, and what still needs the user's decision.
