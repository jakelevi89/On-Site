// POST /api/lead
// Delivers BOTH website forms to the shop's inbox:
//
//   formType=contact         /contact-us  - Name, Email, Phone, Referral, Message
//   formType=cleaning-quick  /hunter-douglas-blind-cleaning - First, Last, Email
//
// The two forms deliberately stay SEPARATE lead types, not one merged form. Which
// form someone filled in is a real intent signal (a Cleaning quick-form lead is an
// existing-treatments cleaning job; a Contact Us lead is usually a new-treatments
// quote), and the subject line carries that through so it stays sortable in the
// inbox. See wix-forms-notification-fix.md. Do not collapse these into one shape.
//
// DEPLOYMENT: Cloudflare Pages Function - runs only once the repo is deployed to a
// Cloudflare Pages project. GitHub Pages is static-only and cannot execute this, so
// on the jakelevi89.github.io/On-Site/ preview the form falls back to the "please
// call us" message (see assets/js/main.js).
//
// Set in the Cloudflare Pages project (Settings -> Environment variables), encrypted.
// Never commit real values here:
//   RESEND_API_KEY  (REQUIRED, secret) - https://resend.com, free tier is 3,000
//                   emails/month which is far above this site's volume.
//   LEAD_TO         (optional) - defaults to sales@on-sitespecialists.com, which
//                   ImprovMX forwards to onsitespecialists@gmail.com.
//   LEAD_FROM       (optional) - defaults to website@on-sitespecialists.com. This
//                   address's DOMAIN must be verified in Resend before anything
//                   sends. Until on-sitespecialists.com's nameservers move to
//                   Cloudflare, that verification would mean adding records at
//                   GoDaddy - so pre-cutover, point this at a domain already
//                   verified in Resend instead and switch it back after go-live.
//
// WHY RESEND AND NOT MAILCHANNELS: MailChannels ended its free Cloudflare Workers
// tier in 2024 and now needs a paid account, so the old "free from a Worker" recipe
// no longer applies. Resend is the cheapest path that still sends from our own
// domain rather than a third party's branded form host.

// Origin allowlist. NOTE this is deliberately more forgiving than /api/chat's: that
// endpoint spends money per request so a false negative is cheap, whereas here a
// false negative is a LOST LEAD, which is the whole failure this endpoint exists to
// prevent. So a request with NO Origin header is allowed through (some privacy
// extensions and non-JS form posts strip it) and only a present-but-wrong Origin is
// rejected. Spam is handled by the honeypot + field validation below instead.
const ALLOWED_ORIGINS = [
  'https://www.on-sitespecialists.com',
  'https://on-sitespecialists.com',
  'https://jakelevi89.github.io',
  // Cloudflare Pages project subdomain + its per-deployment preview URLs are
  // matched by the *.pages.dev suffix rule in originAllowed().
];

const MAX_BODY_BYTES = 16000;
const MAX_FIELD = 5000;

const FORMS = {
  contact: {
    label: 'Contact Us',
    page: '/contact-us',
    required: ['name', 'email'],
    fields: [
      ['name', 'Name'],
      ['email', 'Email'],
      ['phone', 'Phone'],
      ['referral', 'Where did you hear about us?'],
      ['message', 'Message'],
    ],
  },
  'cleaning-quick': {
    label: 'Cleaning Quick Form',
    page: '/hunter-douglas-blind-cleaning',
    required: ['firstName', 'lastName', 'email'],
    fields: [
      ['firstName', 'First Name'],
      ['lastName', 'Last Name'],
      ['email', 'Email'],
    ],
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function originAllowed(origin) {
  if (!origin) return true; // see note above - never drop a lead over a missing header
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const host = new URL(origin).hostname;
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.pages.dev');
  } catch {
    return false;
  }
}

function clean(v) {
  return typeof v === 'string' ? v.trim().slice(0, MAX_FIELD) : '';
}

// Deliberately loose: this only catches typos and obvious junk. Anything stricter
// starts rejecting real addresses, and a bad address costs far less than a lost lead.
function looksLikeEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Minimal HTML page for the no-JavaScript fallback path, where the browser navigates
// to this endpoint instead of fetching it and would otherwise be shown raw JSON.
function htmlPage(title, message, ok) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<style>body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;margin:0;
display:flex;min-height:100vh;align-items:center;justify-content:center;background:#f7f5f3;color:#2E3838}
.card{max-width:34rem;padding:2.5rem;background:#fff;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.08);text-align:center}
h1{margin:0 0 .75rem;font-size:1.5rem;color:${ok ? '#2E3838' : '#F31B20'}}
p{margin:0 0 1.25rem;line-height:1.6}
a{color:#F31B20;font-weight:600}</style></head>
<body><div class="card"><h1>${esc(title)}</h1><p>${esc(message)}</p>
<p><a href="/">Back to On-Site Custom Drapes &amp; Blinds</a></p></div></body></html>`,
    { status: ok ? 200 : 502, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  );
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!originAllowed(request.headers.get('Origin') || '')) {
    return json({ ok: false, error: 'Forbidden' }, 403);
  }

  const contentType = request.headers.get('Content-Type') || '';
  // A urlencoded/multipart body means the browser NAVIGATED here from a plain form
  // submit (JavaScript off or main.js failed to load), so the reply has to be a page
  // a human can read rather than JSON.
  const isBrowserPost = !contentType.includes('application/json');

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return isBrowserPost
      ? htmlPage('That message was too long', 'Please shorten your message and try again, or call us at (949) 770-8989.', false)
      : json({ ok: false, error: 'Payload too large' }, 413);
  }

  let data = {};
  try {
    if (isBrowserPost) {
      for (const [k, v] of new URLSearchParams(raw)) data[k] = v;
    } else {
      data = JSON.parse(raw || '{}');
    }
  } catch {
    return json({ ok: false, error: 'Malformed request' }, 400);
  }

  // Honeypot: a hidden field real people never see and never fill. Bots fill every
  // input they find. Silently report success so the bot does not learn to retry.
  if (clean(data.company)) return isBrowserPost ? htmlPage('Thank you', 'Your message has been sent.', true) : json({ ok: true });

  const form = FORMS[clean(data.formType)] || FORMS.contact;

  const values = {};
  for (const [key] of form.fields) values[key] = clean(data[key]);

  const missing = form.required.filter((k) => !values[k]);
  if (missing.length || !looksLikeEmail(values.email)) {
    const msg = missing.length ? 'Please fill in every required field.' : 'That email address does not look right.';
    return isBrowserPost ? htmlPage('Please check the form', msg, false) : json({ ok: false, error: msg }, 400);
  }

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration, not visitor error. Say so plainly and give them the phone.
    console.error('lead: RESEND_API_KEY is not set - lead NOT delivered', { formType: form.label });
    return isBrowserPost
      ? htmlPage("We couldn't send that", 'Our form is temporarily unavailable. Please call us at (949) 770-8989 and we will take care of you right away.', false)
      : json({ ok: false, error: 'Email service is not configured.' }, 503);
  }

  const to = env.LEAD_TO || 'sales@on-sitespecialists.com';
  const from = env.LEAD_FROM || 'On-Site Website <website@on-sitespecialists.com>';

  const who = form.label === 'Cleaning Quick Form' ? `${values.firstName} ${values.lastName}`.trim() : values.name;
  const subject = `${form.label} - ${who || values.email}`;

  const lines = form.fields
    .filter(([key]) => values[key])
    .map(([key, label]) => `${label}: ${values[key]}`);
  lines.push('', `Submitted from: ${form.page}`, `Received: ${new Date().toUTCString()}`);
  const text = lines.join('\n');

  const html =
    `<h2 style="margin:0 0 1rem">${esc(form.label)}</h2><table cellpadding="6" style="border-collapse:collapse;font-family:system-ui,sans-serif">` +
    form.fields
      .filter(([key]) => values[key])
      .map(
        ([key, label]) =>
          `<tr><td style="border:1px solid #e7e3df;background:#faf9f7"><strong>${esc(label)}</strong></td><td style="border:1px solid #e7e3df">${esc(values[key]).replace(/\n/g, '<br>')}</td></tr>`
      )
      .join('') +
    `</table><p style="color:#6b6b6b;font-size:.9rem">Submitted from ${esc(form.page)} &middot; ${esc(new Date().toUTCString())}</p>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html,
        // So hitting Reply in the inbox answers the customer, not the website.
        reply_to: values.email,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('lead: Resend rejected the send', res.status, detail.slice(0, 500));
      return isBrowserPost
        ? htmlPage("We couldn't send that", 'Something went wrong sending your message. Please call us at (949) 770-8989 and we will take care of you right away.', false)
        : json({ ok: false, error: 'Could not send your message.' }, 502);
    }
  } catch (err) {
    console.error('lead: send threw', err && err.message);
    return isBrowserPost
      ? htmlPage("We couldn't send that", 'Something went wrong sending your message. Please call us at (949) 770-8989 and we will take care of you right away.', false)
      : json({ ok: false, error: 'Could not send your message.' }, 502);
  }

  return isBrowserPost
    ? htmlPage('Thank you', "Thanks for reaching out - we've got your message and will be in touch shortly.", true)
    : json({ ok: true });
}

export async function onRequestGet() {
  return json({ ok: true, note: 'POST a website form here. formType: "contact" | "cleaning-quick".' });
}
