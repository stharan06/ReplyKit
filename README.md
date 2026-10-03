# ReplyKit

**Thoughtful customer review replies, written in your business's voice.** Paste a review, choose its star rating and tone, and get three drafts you can review and copy in seconds.

ReplyKit is a mobile-first Next.js MVP for independent restaurants, clinics, salons, and gyms. It uses manual paste-in review text: no Google connection and no automatic posting.

## What is included

- Three reply drafts in warm, formal, or short tones, with a specific detail from the review.
- Extra-careful language for one- and two-star reviews.
- A saved business voice: name, category, signature, phrases to use or avoid, a style example, and a contact method.
- Email magic-link sign-in, private reply history, and copy buttons.
- Supabase row-level security and a 30-generations-per-user daily limit.
- Server-side LLM calls; provider keys never reach the browser.

## Run locally

Requirements: Node.js 20.9 or newer and npm, pnpm, or another Node package manager.

1. Create a Supabase project and run [`supabase/migrations/0001_replykit.sql`](supabase/migrations/0001_replykit.sql) in its SQL editor.
2. In Supabase Auth settings, enable email sign-in and add `http://localhost:3000/auth/callback` to the redirect URL allowlist.
3. Copy `.env.example` to `.env.local`, then fill in the Supabase project URL, anon key, and LLM provider key.
4. Install and run:

   ```sh
   npm install
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000), sign in with your email, save your brand voice, and generate a reply.

The LLM endpoint uses the OpenAI-compatible Chat Completions request format by default. Set `LLM_API_URL` and `LLM_MODEL` to use another compatible provider. Keep all LLM credentials in server-only environment variables.

## Environment variables

| Variable | Used by | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server | Safe to expose only with the included RLS policies enabled. |
| `LLM_API_KEY` | Server route only | Never add a `NEXT_PUBLIC_` prefix. |
| `LLM_API_URL` | Server route only | Defaults to OpenAI-compatible Chat Completions. |
| `LLM_MODEL` | Server route only | Defaults to `gpt-4o-mini`. |

Never commit `.env.local`, service-role keys, or provider secrets. The service-role key is not needed by this MVP.

## Deploy to Vercel

Import this public repository into Vercel with the default Next.js settings. Add the environment variables above to Preview and Production, set the Supabase auth redirect URL to your deployed domain, then deploy. Pushes to the default branch will trigger Vercel deployments after the project is connected.

## Data and safety

Review text is customer data. The application does not log it to the console or send it to analytics. It is sent to the configured LLM provider to draft replies and saved in the signed-in business's Supabase history. Every table is protected by RLS. Review the drafts before posting; ReplyKit does not publish replies on your behalf.

The 30-reply cap is an MVP guardrail, not a billing system. A new UTC day starts the next count window.

## Proposed launch pricing

Pricing is shown on `/pricing`, but the prices are a proposal for beta feedback: subscriptions, payment collection, and monthly plan enforcement are not implemented. Beta access is free; the current API limit is 30 generations per user per day.

| Plan | Proposed price | Planned monthly reply sets |
| --- | ---: | ---: |
| Free | ₹0 | 30 |
| Solo | ₹199/month | 300 |
| Busy | ₹499/month | 900 |

The initial target is a single-location independent business, so the proposal keeps one business voice and the same core workflow on every plan. Only reply volume changes; team and multi-location tiers should wait until those features exist. As a market reference, [UpBlick lists a ₹199/month starter plan](https://www.upblick.com/pricing) with Google review management, AI replies, and WhatsApp workflows, while [Birdeye requests a quote](https://birdeye.com/pricing/). Those products have broader feature sets, so these are price anchors rather than a direct feature comparison. Validate the limits and willingness to pay with business owners before enabling billing.

## Product scope

ReplyKit currently covers the paste → draft → review → copy workflow. Google review syncing, auto-posting, multiple locations, team access, billing, additional languages, and mobile apps are intentionally out of scope until real owners ask for them.

## Launch checklist

- [ ] Add a short demo GIF and product screenshots after capturing the running app.
- [ ] Deploy to Vercel and add the live URL to the repository description.
- [ ] Test account isolation with two separate Supabase users.
- [ ] Ask three business owners to generate at least five replies each without help.

## What I learned

The prompt needs to insist on one concrete detail from the review; otherwise a friendly tone alone still sounds generic. The database policies also have to follow each reply's parent business so one owner can never browse another owner's reviews.
