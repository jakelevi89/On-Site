# On-Site Custom Drapes & Blinds — website

A full static clone of [on-sitespecialists.com](https://www.on-sitespecialists.com/), rebuilt as
plain HTML/CSS/JS so it can be hosted for free instead of paying Wix ($17/mo) and GoDaddy
(~$349/yr renewal).

All 42 pages from the live site are here — every product page, every service-area page for
Newport Beach / Huntington Beach / Laguna Beach / Irvine, the blog, and all core pages — with the
same URLs as the original site (e.g. `/hunter-douglas-shades-blinds/sheer-shades`).

## How this is built

- `build/data.js` — all page content (titles, headings, body copy) pulled from the live site.
- `build/build.js` — a small Node script that renders `data.js` into 42 static `index.html`
  files using a shared header/nav/footer template.
- `assets/css/style.css` — all styling (brand colors sampled from the live site: red `#F31B20`,
  charcoal `#2E3838`).
- `assets/js/main.js` — mobile menu toggle + contact form handling.
- `assets/images/` — 129 real photos/graphics downloaded from the live site's Wix media CDN, so
  the site doesn't depend on Wix once you cancel it. `manifest.txt` maps each file back to its
  original URL.

**The generated `index.html` files are already committed** — you do not need Node.js or to run
anything to host this site. If you ever edit `build/data.js` and want to regenerate the HTML,
run:

```
node build/build.js
```

(requires Node.js — only needed if you want to edit page content through the data file rather
than editing the HTML directly)

## Hosting this for free

### Option A — Cloudflare Pages (recommended, keeps this repo private)

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) and sign up / log in (free).
2. **Create a project → Connect to Git** → authorize Cloudflare to access your GitHub account →
   select the `On-Site` repo.
3. Build settings: **Framework preset: None**, **Build command: (leave blank)**, **Build output
   directory: `/`**.
4. Deploy. Cloudflare gives you a free `*.pages.dev` URL immediately — that's your developer
   preview link to review before switching off Wix/GoDaddy.
5. When you're ready to go live, add your real domain under the project's **Custom domains** tab
   and update your domain's DNS to point at Cloudflare (free, and replaces GoDaddy hosting
   entirely — you'd only need GoDaddy for domain registration, or you can transfer the domain to
   Cloudflare Registrar too, which sells domains at cost with no markup).

### Option B — Make the repo public + GitHub Pages

If you'd rather keep everything inside GitHub: make this repository public (Settings → General →
Danger Zone → Change visibility), then go to **Settings → Pages** and set the source to the
`main` branch, root folder. GitHub gives you a free `<you>.github.io/On-Site/` URL. This only
works on GitHub's free plan if the repo is public — there's nothing sensitive in here (it's all
public marketing content), so this is a reasonable option if privacy of the source isn't a
concern.

### Option C — Netlify

Same idea as Cloudflare Pages: netlify.com → **Add new site → Import an existing project** →
connect GitHub → pick this repo → build command blank, publish directory `/`.

## Current deployment (as of 2026-08-12)

Option A is the one that actually happened. State of play:

| Thing | Value |
|---|---|
| Cloudflare Pages project | `on-site` |
| Staging URL | https://on-site.pages.dev |
| Production branch | `main` (build command blank, output = repo root) |
| Cloudflare zone | `on-sitespecialists.com` — **pending**, not yet active |
| Cloudflare nameservers | `apollo.ns.cloudflare.com`, `maleah.ns.cloudflare.com` |
| Registrar / current DNS host | GoDaddy (registrar) → nameservers still point at Wix (`ns12`/`ns13.wixdns.net`) |

The pages are built for the **domain root**, not the `/On-Site/` GitHub Pages subpath. Rebuild
with `BASE_PATH= node build/build.js` — a plain `node build/build.js` re-adds the `/On-Site`
prefix and will break every link and asset on the real domain.

**Custom domains cannot be attached until the zone is active**, i.e. not until the nameservers
are actually switched at GoDaddy. That step happens right after the cutover, not before it.

### Environment variables — NONE are set yet

Nothing in the Pages project's Settings → Environment variables. Until they are set:

| Variable | Used by | Symptom while unset |
|---|---|---|
| `RESEND_API_KEY` | `/api/lead` | Forms return 503; visitor is shown the phone number. **Leads are not delivered.** |
| `ONSITE_OPEN_AI_API_KEY` | `/api/chat` | Chat widget returns 503 "not configured". |

### Sender domain for the forms

`on-sitespecialists.com` cannot be verified in Resend before the cutover — verification needs
DKIM records on whatever nameservers are authoritative, and that is still Wix. The pre-cutover
plan is to verify a subdomain of an already-Cloudflare-managed domain
(`leads.rapidlendingsolutions.net`) and point `LEAD_FROM` at it, keeping `LEAD_TO` as
`sales@on-sitespecialists.com`. Switch `LEAD_FROM` to the real domain once it is live.

## Contact forms

There are **two** forms and they are deliberately kept separate — which one a lead used is a real
intent signal (Cleaning quick form = an existing-treatments cleaning job; Contact Us = usually a
new-treatments quote). Do not merge them.

| Form | Page | Fields | `formType` |
|---|---|---|---|
| Contact Us | `/contact-us` | Name, Email, Phone, Referral, Message | `contact` |
| Cleaning Quick Form | `/hunter-douglas-blind-cleaning` | First Name, Last Name, Email | `cleaning-quick` |

Both POST to **`/api/lead`** (`functions/api/lead.js`), a Cloudflare Pages Function that emails the
submission to `sales@on-sitespecialists.com` (ImprovMX forwards that to the Gmail inbox) via
[Resend](https://resend.com). The subject line names the form, so the two stay sortable.

The `<form>` has a real `action`/`method`, so it still works with JavaScript off — the Function
replies with a plain thank-you page. With JS on, `assets/js/main.js` upgrades it to a `fetch` and
shows an inline status message instead of navigating away. Spam is filtered by an off-screen
honeypot field (`company`) plus required-field and email validation.

### Environment variables (Cloudflare Pages → Settings → Environment variables, encrypted)

| Variable | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | **yes** | From resend.com. Free tier is 3,000 emails/month. Without it the endpoint returns 503 and the visitor is shown the phone number. |
| `LEAD_TO` | no | Defaults to `sales@on-sitespecialists.com`. |
| `LEAD_FROM` | no | Defaults to `On-Site Website <website@on-sitespecialists.com>`. **The domain here must be verified in Resend before anything sends.** |

**Sending-domain caveat while DNS still points at GoDaddy:** verifying `on-sitespecialists.com` in
Resend means adding DKIM/SPF records to whichever nameservers are authoritative. Until the
nameserver cutover, that would mean editing DNS at GoDaddy. To test before cutover, set `LEAD_FROM`
to an address on a domain already verified in Resend, then switch it back after go-live.

If the send ever fails, the visitor is told to call — the phone number and email stay prominent on
the site so nobody is ever left with a dead end.

## AI chat widget

The floating chat bubble in the bottom-right is an AI assistant trained on this site's own
content — products, the Hunter Douglas line, the injection/extraction cleaning method, repairs,
and the service areas. It replaces the Wix chat widget the original site used, and it's built on
the same architecture as the Custom Voice Automations and Rapid Lending Solutions site chatbots.

- `assets/js/chat-widget.js` — the widget. Injects its own markup, so pages only need the one
  script tag `build.js` already emits. Conversation history lives in the visitor's `sessionStorage`
  and nowhere else.
- `assets/css/style.css` — styling, under "AI chat widget" (On-Site's red/charcoal palette).
- `functions/api/chat.js` — the server-side piece. Holds the system prompt and proxies to OpenAI so
  the API key never reaches the browser.

**It only answers once the site is on Cloudflare Pages** (option A above). Pages Functions
auto-deploy with a normal git push — no separate deploy step — but GitHub Pages is static-only and
cannot run `functions/`, so on the `jakelevi89.github.io/On-Site/` preview link the widget opens and
looks right but replies "the assistant isn't switched on for this preview link yet" and gives the
phone number. To switch it on:

1. Deploy to Cloudflare Pages.
2. In the Pages project → **Settings → Environment variables**, add `ONSITE_OPEN_AI_API_KEY` as an
   **encrypted** variable — On-Site's own OpenAI key, kept separate from other projects' keys so this
   site's spend is isolated and can be revoked on its own. (Optional: `OPENAI_MODEL` to override the
   default model; `OPENAI_API_KEY` still works as a fallback for a shared-key setup.) Never commit
   the key — `.gitignore` covers `.env` and `.dev.vars`, which is where one would otherwise land.
3. Add the project's real domain to `ALLOWED_ORIGINS` at the top of `functions/api/chat.js` —
   including the `*.pages.dev` subdomain if you're testing there, or the browser gets a 403.

### Protecting the endpoint from abuse

**The origin allowlist is not authentication.** It stops a browser on another site from calling
`/api/chat`, and nothing else. A script can send any `Origin` header it likes, and this repo is
public, so anyone who reads `functions/api/chat.js` can point a loop at the endpoint and spend the
OpenAI balance. What's in the code already: the `Origin` header is *required* (so the "just omit it"
bypass is closed), request size, turn count, and reply length are capped, and an optional per-IP
hourly cap runs if you bind a KV namespace as `CHAT_RL` (inert without it, and it fails open if KV
errors rather than taking chat down).

Before this sees real traffic, add at least one of these — none of them live in the repo:

1. **A Cloudflare Rate Limiting rule on `/api/chat`** — the cheapest real defence, and it runs at the
   edge before the function bills you anything.
2. **A hard monthly spend cap on the OpenAI key** — the one control that cannot be argued with. Do
   this regardless of the others.
3. **Cloudflare Turnstile** if it's ever actually targeted — that's the only option here that
   distinguishes a real visitor from a script.

What the assistant will **not** do, by design: quote any price, ballpark, or discount amount (there's
no pricing on the site — every job is quoted from the actual windows); promise appointment times or
lead times; interpret Hunter Douglas warranty terms; or give DIY cleaning/measuring advice that could
ruin a custom order. Every one of those routes to (949) 770-8989 instead. The chat creates no lead
record — the phone number is the path that actually reaches the team.

To preview it locally with working replies, point `window.ONSITE_CHAT_ENDPOINT` at a host that runs
the function, or run the site behind any small dev server that serves `functions/api/chat.js` at
`/api/chat`.

## What's NOT automated yet

- DNS / domain cutover from GoDaddy — do this only after you've reviewed the preview link.
- The contact form backend (see above).
- The chat widget's `OPENAI_API_KEY` / Cloudflare Pages deploy (see above).
