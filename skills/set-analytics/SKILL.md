---
name: set-analytics
description: "Use when the user types /set-analytics or asks to add analytics, product analytics, session replay, or PostHog to a product. Installs PostHog by default (another provider if the user names one): SDK and init for the detected stack, user identification, a short event plan, a reverse proxy, consent and privacy settings, then verifies that real events arrive."
---

# Set analytics (PostHog by default)

Add analytics to the product so the numbers are real, private where they should be, and verified end to end.

## HStack V5 role

Layer 4 installs and wires the SDK; Layer 3 decides the event plan and the privacy settings; the owner provides the project key and approves anything that goes public.

**Model tier:** T1 for the install; T2 for the event plan and consent decisions. See [model-routing.md](../../docs/model-routing.md).

## Settings

Read an optional `## analytics` block in `AGENTS.md`. Defaults in brackets:

- `provider`: [posthog]. For another provider, follow its official install guide with the same steps below;
- `region`: `us` or `eu` [ask; EU users usually want `eu`];
- `host`: PostHog Cloud or a self-hosted URL [cloud];
- `features`: product analytics, web analytics, session replay, feature flags, error tracking, surveys [product and web analytics];
- `consent`: `required` or `not-required` [required when the product has EU users].

## Steps

1. **Detect the stack.** Next.js (and its version), React with Vite, Remix, SvelteKit, Astro, Nuxt or Vue, plain HTML, React Native or Expo, Flutter, native iOS or Android, and any backend (Node, Python, Go). Check whether PostHog is already initialized somewhere; never add a second init.
2. **Get the project key** from the owner: the project API key (`phc_…`) is meant for client code; a personal API key (`phx_…`) is a secret for servers and CI only. Put the values in the environment (for example `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`), and only the variable names in `.env.example`. Never commit a personal key.
3. **Install.** Prefer the official wizard when it supports the stack: `npx @posthog/wizard@latest`, run with the owner present because it signs in through the browser. Otherwise install by hand:
   - **Next.js 15.3+:** `npm install posthog-js`, then call `posthog.init(...)` in `instrumentation-client.ts` at the app root (beside `src/app` in `src/` projects), with `api_host` from the environment and the `defaults` date from PostHog's current Next.js guide. Older Next.js ignores that file, so use a provider component there instead;
   - **React or Vite:** init once at startup and wrap the app in `PostHogProvider` from `posthog-js/react`;
   - **Plain HTML:** the snippet from PostHog's docs in `<head>`;
   - **React Native or Expo:** `posthog-react-native` with its provider;
   - **Backend:** `posthog-node` or the Python `posthog` package for server-side events; flush or shut down the client on exit.
4. **Identify users.** Call `posthog.identify(<user id>)` after sign-in and `posthog.reset()` on sign-out. Send only the traits the privacy policy allows; no passwords, tokens, or payment data in any property.
5. **Plan the events,** five to ten to start: the activation path and the actions that matter (for example `user_signed_up`, `project_created`, `checkout_completed`). Pick one naming convention and keep it. Add `posthog.capture(...)` calls only for those; let autocapture handle clicks and page views.
6. **Add a reverse proxy** so ad blockers don't drop events. For Next.js, add `rewrites()` and `skipTrailingSlashRedirect` in `next.config.js`: `/<path>/static/*` goes to `us-assets.i.posthog.com` (or `eu-assets`), everything else to `us.i.posthog.com` (or `eu.i.posthog.com`). Point `api_host` at the proxy path and set `ui_host` to `https://us.posthog.com` (or `https://eu.posthog.com`). Use a path that doesn't say "analytics" or "posthog". Other hosts have their own proxy guides in PostHog's docs.
7. **Respect consent and privacy.** When consent is required, start with `opt_out_capturing_by_default: true` (or memory persistence) and call `posthog.opt_in_capturing()` from the consent banner. Keep session replay input masking on. Add PostHog to the privacy policy.
8. **Verify with real events.** Run the app (`run-local`), sign in, and trigger each planned event. Confirm they arrive in PostHog's live events view, or in the browser's network tab as successful requests through the proxy. A 401 in production usually means a region mismatch between the key and the host. If the PostHog MCP is connected, use it to confirm the events instead of the dashboard.
9. Commit on a branch and hand it to `publish-git`. Production keys go into the hosting provider's environment settings, set by the owner.

## Report

Stack and files changed, how it was installed (wizard or manual), the event plan, the proxy path, the consent setup, which events were seen arriving, and anything the owner still needs to set (keys, policy text).
