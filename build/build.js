const fs = require("fs");
const path = require("path");

const { BUSINESS, NAV, FOOTER_LINKS, PAGES } = require("./data.js");

const ROOT = path.join(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "assets", "images");

// ---- base path ----
// Site is hosted at https://jakelevi89.github.io/On-Site/ (a subpath), so every
// root-relative URL must be prefixed. If this ever moves to a custom domain or
// Cloudflare Pages (served from the root), rebuild with: BASE_PATH= node build/build.js
const BASE = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH : "/On-Site";
// u("/about-us") -> "/On-Site/about-us"; u("/") -> "/On-Site/"
function u(p) {
  return BASE + p;
}

// ---- image manifest ----
// manifest.txt lines: "img_000.png\t<original wix url>"
const manifestPath = path.join(IMAGES_DIR, "manifest.txt");
const manifestLines = fs.readFileSync(manifestPath, "utf8").trim().split("\n");
const IMAGE_FILES = manifestLines.map((l) => l.split("\t")[0]).filter(Boolean);
// img_000.* is always the logo (first image found on homepage crawl)
const LOGO_FILE = IMAGE_FILES.find((f) => f.startsWith("img_000."));

// ---- image pools ----
// image-meta.json ({file: [w, h]}) is generated from the actual files; used to keep
// logos, icons, and tiny thumbnails out of the random photo pools. Regenerate with
// PIL if images change (see README).
const META = JSON.parse(fs.readFileSync(path.join(__dirname, "image-meta.json"), "utf8"));
// Known brand/logo/icon files (identified against the live site) — never usable as photos
const BRAND_FILES = new Set([
  LOGO_FILE,
  "img_003.png", // Hunter Douglas vertical badge
  "img_005.png", // wide partner banner
  "img_006.png", // social icon
  "img_007.png", // social icon
  "img_012.png", // Alta logo
  "img_013.png", // logo
  "img_014.png", // Hunter Douglas horizontal logo
  "img_015.jpg", // window treatments logo
]);
function dims(f) {
  return META[f] || [0, 0];
}
function isPhoto(f) {
  if (BRAND_FILES.has(f)) return false;
  const [w, h] = dims(f);
  const ratio = h ? w / h : 0;
  // Real photography: big enough to display, not logo-shaped
  return w >= 450 && h >= 300 && ratio >= 0.45 && ratio <= 2.6;
}
// Rotating pool of real site photography (sections, galleries)
const PHOTO_POOL = IMAGE_FILES.filter(isPhoto);
// Hero/banner backgrounds need large landscape images or they render blurry/stretched
const HERO_POOL = PHOTO_POOL.filter((f) => {
  const [w, h] = dims(f);
  return w >= 1200 && w / h >= 1.2;
});

function photoFor(seed) {
  if (PHOTO_POOL.length === 0) return null;
  const idx = Math.abs(hashCode(seed)) % PHOTO_POOL.length;
  return u("/assets/images/" + PHOTO_POOL[idx]);
}
function heroFor(seed) {
  if (HERO_POOL.length === 0) return photoFor(seed);
  const idx = Math.abs(hashCode(seed)) % HERO_POOL.length;
  return u("/assets/images/" + HERO_POOL[idx]);
}
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

// Simple, generic-style icon glyphs for the footer social row — a deliberate
// redesign rather than matching the live Wix site's plain text-link list (per Jake,
// 2026-08-06: "don't match it identically, make an improved design").
const ICONS = {
  facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c-2.7 0-3.1 0-4.1.1-1 .1-1.7.2-2.3.5-.6.3-1.2.6-1.7 1.2-.6.5-.9 1.1-1.2 1.7-.2.6-.4 1.4-.5 2.3C2.1 8.9 2 9.3 2 12s0 3.1.1 4.1c.1 1 .2 1.7.5 2.3.3.6.6 1.2 1.2 1.7.5.6 1.1.9 1.7 1.2.6.2 1.4.4 2.3.5C8.9 21.9 9.3 22 12 22s3.1 0 4.1-.1c1-.1 1.7-.2 2.3-.5.6-.3 1.2-.6 1.7-1.2.6-.5.9-1.1 1.2-1.7.2-.6.4-1.4.5-2.3.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c-.1-1-.2-1.7-.5-2.3a4.6 4.6 0 0 0-1.2-1.7A4.6 4.6 0 0 0 18.4 2.6c-.6-.2-1.4-.4-2.3-.5C15.1 2 14.7 2 12 2Zm0 1.8c2.6 0 3 0 4 .1.9 0 1.4.2 1.8.3.4.2.7.4 1 .7.3.3.5.6.7 1 .2.4.3.9.3 1.8.1 1 .1 1.4.1 4s0 3-.1 4c0 .9-.2 1.4-.3 1.8-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.4.2-.9.3-1.8.3-1 .1-1.4.1-4 .1s-3 0-4-.1c-.9 0-1.4-.2-1.8-.3-.4-.2-.7-.4-1-.7-.3-.3-.5-.6-.7-1-.2-.4-.3-.9-.3-1.8-.1-1-.1-1.4-.1-4s0-3 .1-4c0-.9.2-1.4.3-1.8.2-.4.4-.7.7-1 .3-.3.6-.5 1-.7.4-.2.9-.3 1.8-.3 1-.1 1.4-.1 4-.1Zm0 3a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4Zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8Zm5.4-8.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"/></svg>`,
  houzz: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 2 9h3v11h5v-6h4v6h5V9h3L12 2Z"/></svg>`,
  yelp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 2.4 6.5L21 9l-5 4.3L17.5 20 12 16.3 6.5 20 8 13.3 3 9l6.6-.5L12 2Z"/></svg>`,
};

function esc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderNavItem(item, activeLabel) {
  const isActive = item.label === activeLabel;
  if (item.children) {
    return `<li class="nav-item has-dropdown${isActive ? " active" : ""}">
      <a href="${u(item.href)}">${esc(item.label)}</a>
      <ul class="dropdown">
        ${item.children.map((c) => `<li><a href="${u(c.href)}">${esc(c.label)}</a></li>`).join("\n        ")}
      </ul>
    </li>`;
  }
  return `<li class="nav-item${isActive ? " active" : ""}"><a href="${u(item.href)}">${esc(item.label)}</a></li>`;
}

function renderHeader(activeLabel) {
  return `<header class="site-header">
    <div class="header-inner">
      <a class="brand" href="${u("/")}">
        <img src="${u("/assets/images/" + LOGO_FILE)}" alt="${esc(BUSINESS.name)}" width="180" height="64">
      </a>
      <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-nav">
        <ul class="nav-list">
          ${NAV.map((i) => renderNavItem(i, activeLabel)).join("\n          ")}
        </ul>
      </nav>
      <div class="header-cta">
        <a class="btn btn-dark" href="${u("/contact-us")}">Contact</a>
        <a class="phone" href="${BUSINESS.phoneHref}">${BUSINESS.phone}</a>
      </div>
    </div>
  </header>`;
}

function renderFooter() {
  return `<footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="${u("/assets/images/" + LOGO_FILE)}" alt="${esc(BUSINESS.name)}" width="150" height="53">
        <p>${esc(BUSINESS.serviceAreaShort)}</p>
        <p><a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a> &nbsp;|&nbsp; <a href="${BUSINESS.phoneHref}">${BUSINESS.phone}</a></p>
      </div>
      <nav class="footer-links">
        <ul>
          ${FOOTER_LINKS.map((l) => `<li><a href="${u(l.href)}">${esc(l.label)}</a></li>`).join("\n          ")}
        </ul>
      </nav>
      <div class="footer-social">
        <a class="social-icon" href="${BUSINESS.social.facebook}" aria-label="Facebook" target="_blank" rel="noopener">${ICONS.facebook}</a>
        <a class="social-icon" href="${BUSINESS.social.instagram}" aria-label="Instagram" target="_blank" rel="noopener">${ICONS.instagram}</a>
        <a class="social-icon" href="${BUSINESS.social.houzz}" aria-label="Houzz" target="_blank" rel="noopener">${ICONS.houzz}</a>
        <a class="social-icon" href="${BUSINESS.social.yelp}" aria-label="Yelp" target="_blank" rel="noopener">${ICONS.yelp}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear ? "2026" : ""} ${esc(BUSINESS.name)}. All rights reserved.</p>
    </div>
  </footer>`;
}

function renderSection(section, pageSeed, idx) {
  switch (section.type) {
    case "text": {
      const img = idx % 2 === 0 ? photoFor(pageSeed + idx) : null;
      return `<section class="section${img ? " section-with-image" : ""}">
        ${img ? `<div class="section-image"><img src="${img}" alt="" loading="lazy"></div>` : ""}
        <div class="section-body">
          ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
          ${section.body.map((p) => `<p>${esc(p)}</p>`).join("\n          ")}
        </div>
      </section>`;
    }
    case "textVideo": {
      // Same layout as "text" but with a real <video> instead of a photo — used where
      // the live site has an actual Wix Video Box component instead of a static image
      // (e.g. the homepage's "Window Treatment Specialists" section).
      const poster = section.poster ? u("/assets/images/" + section.poster) : "";
      return `<section class="section section-with-image">
        <div class="section-image section-video">
          <video autoplay muted loop playsinline preload="metadata"${poster ? ` poster="${poster}"` : ""}>
            <source src="${u("/assets/videos/" + section.videoFile)}" type="video/mp4">
          </video>
        </div>
        <div class="section-body">
          ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
          ${section.body.map((p) => `<p>${esc(p)}</p>`).join("\n          ")}
        </div>
      </section>`;
    }
    case "carousel": {
      // Rotating image card (autoplay + arrows + dots) — replicates the live site's
      // homepage Wix gallery. Logic lives in assets/js/main.js; degrades to the
      // first slide if JS is disabled.
      return `<section class="section">
        ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
        ${
          section.cta
            ? `<a class="btn-pill" href="${u(section.cta.href)}">${esc(section.cta.label)} <span class="arrow">&#8594;</span></a>`
            : ""
        }
        <div class="carousel" data-carousel>
          <div class="carousel-track">
            ${section.images
              .map(
                (img, i) =>
                  `<div class="carousel-slide${i === 0 ? " active" : ""}"><img src="${u("/assets/images/" + img.file)}" alt="${esc(img.alt)}"${i === 0 ? "" : ' loading="lazy"'}></div>`
              )
              .join("\n            ")}
          </div>
          <button class="carousel-arrow carousel-prev" aria-label="Previous image">&#10094;</button>
          <button class="carousel-arrow carousel-next" aria-label="Next image">&#10095;</button>
          <div class="carousel-dots">
            ${section.images
              .map((img, i) => `<button class="carousel-dot${i === 0 ? " active" : ""}" aria-label="Go to image ${i + 1}"></button>`)
              .join("\n            ")}
          </div>
        </div>
      </section>`;
    }
    case "brandbar": {
      return `<section class="section brand-bar">
        <div class="brand-bar-inner">
          ${section.items
            .map((item) => {
              const img = `<img src="${u("/assets/images/" + item.file)}" alt="${esc(item.alt)}" loading="lazy">`;
              return item.href ? `<a href="${u(item.href)}">${img}</a>` : img;
            })
            .join("\n          ")}
        </div>
      </section>`;
    }
    case "checklist": {
      return `<section class="section">
        ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
        ${section.intro ? `<p>${esc(section.intro)}</p>` : ""}
        <ul class="checklist">
          ${section.items.map((i) => `<li>${esc(i)}</li>`).join("\n          ")}
        </ul>
      </section>`;
    }
    case "linkgrid": {
      return `<section class="section">
        ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
        ${section.intro ? `<p>${esc(section.intro)}</p>` : ""}
        <div class="link-grid">
          ${section.items.map((i) => `<a class="link-card" href="${u(i.href)}">${esc(i.label)}</a>`).join("\n          ")}
        </div>
      </section>`;
    }
    case "pins": {
      return `<section class="section">
        ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
        <div class="pin-grid">
          ${section.items.map((i) => `<span class="pin">📍 ${esc(i)}</span>`).join("\n          ")}
        </div>
      </section>`;
    }
    case "cta": {
      return `<section class="section cta-band">
        <h2>${esc(section.heading)}</h2>
        ${section.body.map((p) => `<p>${esc(p)}</p>`).join("\n        ")}
        <a class="btn btn-accent" href="${u("/contact-us")}">Get a Free Consultation</a>
      </section>`;
    }
    case "gallery": {
      const imgs = PHOTO_POOL.slice(0, section.count || 21);
      return `<section class="section">
        <div class="gallery-grid">
          ${imgs.map((f) => `<a href="${u("/assets/images/" + f)}" class="gallery-item"><img src="${u("/assets/images/" + f)}" alt="Completed project photo" loading="lazy"></a>`).join("\n          ")}
        </div>
      </section>`;
    }
    case "bloglist": {
      return `<section class="section">
        <div class="blog-list">
          ${section.items
            .map(
              (p) => `<a class="blog-card" href="${u(p.href)}">
            <h3>${esc(p.title)}</h3>
            <p class="blog-date">${esc(p.date)}</p>
            <p>${esc(p.excerpt)}</p>
          </a>`
            )
            .join("\n          ")}
        </div>
      </section>`;
    }
    case "contactForm": {
      return `<section class="section contact-section">
        <div class="contact-info">
          ${section.body.map((p) => `<p class="lead">${esc(p)}</p>`).join("")}
          <p><strong>Phone:</strong> <a href="${BUSINESS.phoneHref}">${BUSINESS.phone}</a></p>
          <p><strong>Email:</strong> <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></p>
          <p><strong>Service Areas:</strong> ${esc(BUSINESS.serviceAreaShort)}</p>
        </div>
        <form class="contact-form" name="contact" method="POST" data-static-form>
          <label>Name<input type="text" name="name" required></label>
          <label>Email<input type="email" name="email" required></label>
          <label>Phone<input type="tel" name="phone"></label>
          <label>Where did you hear about us?<input type="text" name="referral"></label>
          <label>Message<textarea name="message" rows="4"></textarea></label>
          <button type="submit" class="btn btn-accent">Send</button>
          <p class="form-note">This form needs to be connected to an email service (e.g. Formspree) before it will actually deliver messages — see the README.</p>
        </form>
      </section>`;
    }
    case "quickForm": {
      // "Cleaning Quick Form" — the smaller First/Last/Email lead form embedded on the
      // live Cleaning page (distinct from the full Contact Us form; see
      // wix-forms-notification-fix.md — page-of-origin is a useful lead signal).
      return `<section class="section contact-section quick-quote-section">
        <div class="contact-info">
          ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
          ${section.intro ? `<p class="lead">${esc(section.intro)}</p>` : ""}
        </div>
        <form class="contact-form" name="cleaning-quick-form" method="POST" data-static-form>
          <label>First Name<input type="text" name="firstName" required></label>
          <label>Last Name<input type="text" name="lastName" required></label>
          <label>Email<input type="email" name="email" required></label>
          <button type="submit" class="btn btn-accent">Send</button>
          <p class="form-note">This form needs to be connected to an email service (e.g. Formspree) before it will actually deliver messages — see the README.</p>
        </form>
      </section>`;
    }
    default:
      return "";
  }
}

function renderPage(page) {
  const seed = page.path;
  const heroImg = page.home ? heroFor(seed + "-hero") : heroFor(seed + "-h1");
  const bodyClass = page.home ? "page-home" : "page-inner";

  // Rotating hero banner (live site's SlideShowContainer). Slide 1 is inlined so
  // the page renders identically with JS off; rotation lives in main.js.
  const heroBlock = page.heroSlides
    ? `<section class="hero hero-home hero-slideshow" data-hero-slideshow>
        ${page.heroSlides
          .map(
            (s, i) =>
              `<div class="hero-slide${i === 0 ? " active" : ""}" role="img" aria-label="${esc(s.alt)}" style="background-image:url('${u("/assets/images/" + s.file)}')"></div>`
          )
          .join("\n        ")}
        <div class="hero-inner">
          <h1>${esc(page.h1)}</h1>
          ${page.h1sub ? `<p class="hero-sub">${esc(page.h1sub)}</p>` : ""}
          <a class="btn btn-dark" href="${u("/custom-window-treatments-orange-county")}">Learn More</a>
        </div>
        <div class="hero-dots">
          ${page.heroSlides
            .map((s, i) => `<button class="hero-dot${i === 0 ? " active" : ""}" aria-label="Go to slide ${i + 1}"></button>`)
            .join("\n          ")}
        </div>
      </section>`
    : page.home
    ? `<section class="hero hero-home" style="background-image:url('${heroImg}')">
        <div class="hero-inner">
          <h1>${esc(page.h1)}</h1>
          ${page.h1sub ? `<p class="hero-sub">${esc(page.h1sub)}</p>` : ""}
          <a class="btn btn-dark" href="${u("/custom-window-treatments-orange-county")}">Learn More</a>
        </div>
      </section>`
    : `<section class="page-banner" style="background-image:url('${heroImg}')">
        <div class="page-banner-inner">
          <h1>${esc(page.h1)}</h1>
          ${page.postMeta ? `<p class="post-meta">${esc(page.postMeta.date)} &middot; ${esc(page.postMeta.readTime)}</p>` : ""}
          <a class="phone-pill" href="${BUSINESS.phoneHref}">${BUSINESS.phone}</a>
        </div>
      </section>`;

  const sectionsHtml = (page.sections || []).map((s, i) => renderSection(s, seed, i)).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="https://www.on-sitespecialists.com${page.path}">
<link rel="icon" href="${u("/assets/images/" + LOGO_FILE)}">
<link rel="stylesheet" href="${u("/assets/css/style.css")}">
</head>
<body class="${bodyClass}">
${renderHeader(page.nav)}
<main>
${heroBlock}
${sectionsHtml}
</main>
${renderFooter()}
<script src="${u("/assets/js/main.js")}"></script>
</body>
</html>
`;
}

function outPathFor(pagePath) {
  if (pagePath === "/") return path.join(ROOT, "index.html");
  return path.join(ROOT, pagePath.replace(/^\//, ""), "index.html");
}

let count = 0;
for (const page of PAGES) {
  const html = renderPage(page);
  const outPath = outPathFor(page.path);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  count++;
}

console.log(`Built ${count} pages.`);

// ---- sitemap.xml + robots.txt ----
// Always declares the real production domain (on-sitespecialists.com), independent of
// BASE_PATH/GH Pages preview hosting — this is what search engines should index once
// DNS points here, not the current jakelevi89.github.io preview.
const PRODUCTION_ORIGIN = "https://www.on-sitespecialists.com";
const today = "2026-08-06"; // bump this when regenerating after real content changes
const sitemapUrls = PAGES.map(
  (p) => `  <url>
    <loc>${PRODUCTION_ORIGIN}${p.path === "/" ? "/" : p.path + "/"}</loc>
    <lastmod>${today}</lastmod>
  </url>`
).join("\n");
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemapXml);

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${PRODUCTION_ORIGIN}/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT, "robots.txt"), robotsTxt);

console.log(`Wrote sitemap.xml (${PAGES.length} URLs) and robots.txt.`);
