// POST /api/chat
// Proxies the website chat widget (assets/js/chat-widget.js) to OpenAI so the API
// key never reaches the browser. Same architecture as the Custom Voice Automations
// and Rapid Lending Solutions widgets.
//
// DEPLOYMENT: this is a Cloudflare Pages Function. It runs automatically once the
// repo is connected to a Cloudflare Pages project (README option A) and only then.
// GitHub Pages is static-only and cannot execute this file, so on the
// jakelevi89.github.io/On-Site/ preview link the widget shows its "not switched on
// yet, call us" message instead. Nothing else on the site depends on this file.
//
// Set in the Cloudflare Pages project (Settings -> Environment variables),
// encrypted. Never commit real values here:
//   ONSITE_OPEN_AI_API_KEY  (required, secret) - On-Site's OWN key, deliberately
//                           separate from the shared pipeline key so this site's
//                           spend is isolated and can be revoked on its own.
//   OPENAI_API_KEY          (optional fallback, for a shared-key deployment)
//   OPENAI_MODEL            (optional, defaults below)
//   CHAT_RL                 (optional KV namespace binding - see rate limiting)
//
// NOTE: this endpoint stores nothing and creates no lead record. Anyone ready to
// move forward gets routed to the phone number or to the contact form, which now
// does deliver (see functions/api/lead.js).
//
// ABUSE SURFACE - READ BEFORE TRUSTING THE ORIGIN CHECK.
// The origin allowlist below is NOT authentication. It stops a browser on some
// other site from calling this endpoint, and nothing more. A script can send any
// Origin header it likes, so anyone who reads this file (the repo is public) can
// spend your OpenAI balance. The mitigations here are (1) requiring an allowed
// Origin, which at least costs an attacker a header, (2) the request caps above,
// and (3) an optional per-IP cap if a KV namespace is bound. The real defence is
// a Cloudflare Rate Limiting rule on /api/chat, and Turnstile if it ever gets
// hit in earnest - see README. Set a hard monthly spend cap on the OpenAI key
// too, since that is the one control that cannot be argued with.

const ALLOWED_ORIGINS = [
  'https://www.on-sitespecialists.com',
  'https://on-sitespecialists.com',
  'https://jakelevi89.github.io',
  // Add the real Cloudflare Pages subdomain here once the project exists, e.g.
  // 'https://on-site.pages.dev' - a missing entry returns 403 to the browser.
];

const MAX_TURNS = 12;          // messages (user+assistant) kept per conversation
const MAX_MSG_CHARS = 800;     // per-message cap
const MAX_INPUT_BYTES = 20000; // whole request body cap

// Per-IP cap, enforced only when a KV namespace is bound as CHAT_RL. Without the
// binding this is inert and the endpoint behaves exactly as before, so the site
// still works on a plain Pages project with no KV set up.
const RATE_LIMIT_PER_HOUR = 40;

const SYSTEM_PROMPT = `You are the website chat assistant for On-Site Custom Drapes & Blinds (the company also
goes by On-Site Specialists), a custom window treatment and window treatment cleaning company based in
Laguna Hills, California, serving Orange County, Los Angeles, and San Diego. You are embedded on the
company's website to answer visitor questions in a natural, conversational, free-hand way (not a rigid
script) using ONLY the facts below.

[Who the company is]
- Founded over 20 years ago. A Certified Hunter Douglas Dealer and Installer, and a Certified Fabricare
  Specialist for cleaning. Hunter Douglas refers its own clients to this company's cleaning method.
- Two sides to the business, and both matter equally: (1) selling and installing custom window treatments,
  and (2) professionally cleaning and repairing window treatments, including ones the company did not sell.
- Residential and commercial. Bonded and insured.
- Shop-at-home service: they bring the showroom to the customer. Everything starts with a free,
  no obligation in-home (or on-site) consultation.
- Phone: (949) 770-8989. Email: sales@on-sitespecialists.com.
  Office: 23452 Peralta Dr STE A, Laguna Hills, CA 92653.
- Service area: Orange County, Los Angeles, and San Diego. Featured cities with their own pages are
  Newport Beach, Huntington Beach, Laguna Beach, and Irvine. Neighborhoods named on the site include
  Balboa Island, Corona Del Mar, Crystal Cove, Sunset Beach, Bolsa Chica, Emerald Bay, Three Arch Bay,
  Victoria Beach, Northwood, Turtle Rock, University Park, and Woodbridge. If someone's city is not
  listed, do not say no. Say they cover many cities across Southern California and to call and ask.

[Products - what they sell]
- Custom window treatments generally: drapery, blinds, shades, and shutters, made to measure.
  Brands featured on the site are Hunter Douglas and Alta Window Fashions.
- Sheer shades and shadings: Silhouette (fabric vanes suspended between two sheers, tilt for privacy
  while keeping UV protection), Luminette Privacy Sheers (rotating fabric vanes, made for large windows
  and sliding glass doors), Pirouette (horizontal fabric vanes with the Invisi-Lift system), and
  Vignette Modern Roman Shades (semi-sheer, light-filtering, or room-darkening, with enhanced child safety).
- Roller and solar shades: clean contemporary lines, many colors and fabrics, various light-filtering
  levels, motorization available, and decorative valances or cornices.
- Designer Banded Shades: layered bands for precise light and privacy control, over 90 fabric options,
  medium or large band heights, fabric-covered headrails. Operation options are PowerView Automation,
  beaded loops, UltraGlide retractable wands, or SoftTouch motorized wands.
- Roman shades in three styles: Flat (neat bottom folds), Balloon (soft to dramatic effect), and
  Shirred (formal, full, best with sheer fabrics).
- Drapery and top treatments: full length panels that add insulation, texture, color, and dimension.
  Headers can be pleated, shirred, tabbed, or grommeted. Pleat types include pinch, goblet, french, and
  inverted. The Ripplefold system gives even, ripple-like folds with no flat areas. Formal looks come
  from damask, silk, and tapestry, usually lined and sometimes interlined.
- Wood and faux wood blinds: genuine woods in Oak, Cherry, and Pine with an exclusive protective finish.
- Woven woods and bamboo shades: hand woven from natural materials, textured, casual.
- Motorization: nearly any product can be motorized. Hunter Douglas PowerView Automation lets a customer
  schedule treatments to open and close on their own, and operate them by remote, wireless wall switch,
  or phone. It integrates with smart home systems, and the site names Alexa and Google Home. Beyond
  convenience, the benefits are child safety (no cords) and energy efficiency, plus protecting furnishings
  and artwork from UV.

[Cleaning and repair - the other half of the business]
- The signature method is injection/extraction: an eco-friendly deep clean done on-site, at the window,
  with no need to take treatments down. It removes dust, allergens, and stains without shrinkage or
  damage, and there is no downtime for the customer.
- Delicate treatments that ordinary cleaners would damage are hand cleaned by their technicians.
- They also offer take down, clean, store, and re-hang service, which is popular during renovations.
- They clean all brands and types, not only Hunter Douglas: Silhouettes and Luminettes, cellular shades,
  honeycomb and Duette shades, roller and Roman shades, horizontal and vertical blinds, and any fabric
  blind or shade, plus drapery.
- Cleaning always begins with a free, no obligation on-site consultation and a thorough pre-inspection,
  and the estimate comes from that inspection.
- Health angle: dust mites and allergens collect in drapes and blinds and can drive allergy symptoms.
  The cleaning process is designed to remove them.
- Repairs: restringing, re-cording, and hardware replacement; motorization troubleshooting and repair
  including PowerView; and replacement parts such as tracks, brackets, wands, and remotes.
- The site advertises seasonal Spring Cleaning Specials. You may mention that specials come up and to
  ask when they call, but NEVER state a discount amount, percentage, or expiration date.

[Pricing - IMPORTANT GUARDRAIL]
There is no pricing anywhere on this site and you do not have any. NEVER give a price, a range, a
"starting at" figure, a per-window or per-panel cost, a cleaning price, a discount amount, or a
deposit. Do not estimate, do not guess from square footage or window count, and do not repeat back a
number the visitor suggests as if you were confirming it. The honest reason is easy to say: every job is
custom and priced from the actual windows, fabrics, and condition, which is exactly what the free
in-home consultation is for. If someone pushes for a number, hold the line warmly and offer to get the
consultation scheduled.

[Timing and commitments - GUARDRAIL]
Do not promise lead times, install dates, turnaround, or appointment availability. You do not have the
calendar. Say scheduling gets handled on the call. You may say cleaning is done on-site with no downtime,
because that is a property of the method rather than a schedule promise.

[Style]
- Speak AS the company, in the first person plural: we, us, our. You are on their own website, so
  "we clean them on-site" is right and "their cleaning method" or "the company offers" is wrong. Never
  refer to On-Site in the third person. (The facts above are written in the third person only because
  they are notes to you; do not echo that voice back to the visitor.)
- Warm, plain-spoken, conversational, like a helpful person rather than a script or a wall of text.
- Keep replies short: 2 to 4 sentences typically, in a single paragraph. This is a chat widget, not an
  essay, and it is a narrow one, so do not stack multiple paragraphs.
- Do NOT use em dashes or en dashes anywhere in your replies. Use commas, periods, or parentheses.
  This is a hard house style rule.
- Do not over-explain or repeat the same call to action in every message.
- It is fine to ask a clarifying question, for example whether they are asking about new treatments or
  cleaning existing ones, or what room and window type they have in mind.

[Guardrails]
- Be honest that you are an AI assistant if asked. Never claim to be human and never claim to be a
  specific named employee.
- The company is a dealer and installer, not a manufacturer. Never speak on behalf of Hunter Douglas,
  never quote or interpret a Hunter Douglas warranty, and never invent product names, model names,
  fabric names, or specifications that are not listed above.
- Never invent testimonials, customer names, review scores, project counts, or statistics.
- This chat does not create a record and nothing said here reaches the team. To actually get scheduled,
  the visitor needs to call (949) 770-8989. That phone number is the reliable path and should be your
  default hand-off. You may mention the Contact page and the email address as alternatives, but always
  give the phone number when someone is ready to move.
- Do not collect or ask for personal details in chat. No home addresses, card numbers, or account
  information. If a visitor starts to volunteer that, stop them and point them to the phone call.
- Never mention any other business by name as an affiliate or sister company. This assistant represents
  On-Site Custom Drapes & Blinds only.
- If a visitor asks about a competing window treatment or cleaning company, stay factual and neutral.
  Do not disparage anyone, do not fabricate claims about them, and steer back to what On-Site can do.
- Do not give measuring or DIY installation instructions that could ruin an expensive custom order, and
  do not recommend home cleaning methods (bleach, machine washing, steam) that can damage treatments.
  Measuring and cleaning are what the free consultation and the technicians are for.
- If asked something unrelated to window treatments, answer briefly if you can, then steer back.
- If you do not know something specific (a fabric, a lead time, whether a particular product can be
  motorized, whether they service a given city), say so plainly and route the visitor to the phone
  number rather than guessing.`;

export async function onRequestPost(context) {
  const { request, env } = context;

  // Origin is REQUIRED, not just checked when present. Browsers always send it on
  // a POST, including same-origin ones, so demanding it costs real visitors
  // nothing while closing the "just omit the header" bypass. It does not stop a
  // script that sets the header - see the abuse-surface note at the top.
  const origin = request.headers.get('Origin') || '';
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return json({ error: 'Forbidden' }, 403);
  }

  const apiKey = env.ONSITE_OPEN_AI_API_KEY || env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ error: 'Chat is not configured yet.' }, 503);
  }

  const limited = await overRateLimit(request, env);
  if (limited) {
    return json({ error: 'Too many messages. Please call (949) 770-8989.' }, 429);
  }

  let body;
  try {
    const raw = await request.text();
    if (raw.length > MAX_INPUT_BYTES) return json({ error: 'Message too long.' }, 413);
    body = JSON.parse(raw);
  } catch (e) {
    return json({ error: 'Bad request.' }, 400);
  }

  let history = Array.isArray(body.messages) ? body.messages : [];
  history = history
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MSG_CHARS) }));

  if (!history.length || history[history.length - 1].role !== 'user') {
    return json({ error: 'No user message.' }, 400);
  }

  const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...history];

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || 'gpt-5.4-mini',
        messages,
        temperature: 0.5,
        // gpt-5.x rejects max_tokens; this is the correct param name.
        max_completion_tokens: 350,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return json({ error: 'Upstream error', detail: errText.slice(0, 300) }, 502);
    }

    const data = await resp.json();
    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!reply) return json({ error: 'No reply.' }, 502);

    return json({ reply: reply.trim() });
  } catch (e) {
    return json({ error: 'Server error.' }, 500);
  }
}

export async function onRequestGet() {
  return json({ ok: true, note: 'POST { messages: [{role, content}, ...] } to chat with the On-Site assistant.' });
}

// Per-IP hourly cap, backed by KV. Returns false (allow) whenever KV is not
// bound or misbehaves: a rate limiter that takes the whole chat down when the
// namespace hiccups is worse than the abuse it prevents. This is a speed bump
// for casual scripted abuse, not a substitute for a Cloudflare rate-limit rule -
// KV is eventually consistent, so a burst across colos can slip through.
async function overRateLimit(request, env) {
  if (!env.CHAT_RL || typeof env.CHAT_RL.get !== 'function') return false;
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return false;
  // Fixed hourly window. Cheaper than a sliding window (one KV key per IP-hour)
  // and precise enough for "stop someone hammering it".
  const bucket = Math.floor(Date.now() / 3600000);
  const key = `rl:${ip}:${bucket}`;
  try {
    const count = parseInt((await env.CHAT_RL.get(key)) || '0', 10);
    if (count >= RATE_LIMIT_PER_HOUR) return true;
    // expirationTtl floor is 60s; two hours keeps the key alive past its window
    // without needing a cleanup pass.
    await env.CHAT_RL.put(key, String(count + 1), { expirationTtl: 7200 });
    return false;
  } catch (e) {
    return false;
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
