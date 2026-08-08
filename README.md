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

## Contact form

The contact form on `/contact-us` is currently a static HTML form with no backend — submitting it
just shows a reminder message. Wix handled form emails automatically; a static site needs a small
free service wired in instead. The easiest options:

- [Formspree](https://formspree.io) (free tier: 50 submissions/month) — sign up, get a form
  endpoint URL, and change the `<form>` tag's `action` attribute in
  `hunter-douglas-blind-cleaning`... err, in `contact-us/index.html` (or in `build/data.js`'s
  `contactForm` section renderer in `build.js`) to point at it.
- Netlify Forms (free, built in, if you host on Netlify) — just add `netlify` as a form attribute.
- Cloudflare Pages Forms via a small Worker (a bit more setup, but free and keeps everything in
  Cloudflare).

Until this is connected, keep the real phone number and email prominent on the site (they already
are) so customers can still reach you directly.

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
2. In the Pages project → **Settings → Environment variables**, add `OPENAI_API_KEY` as an
   **encrypted** variable. (Optional: `OPENAI_MODEL` to override the default.) Never commit the key.
3. Add the project's real domain to `ALLOWED_ORIGINS` at the top of `functions/api/chat.js` —
   including the `*.pages.dev` subdomain if you're testing there, or the browser gets a 403.

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
