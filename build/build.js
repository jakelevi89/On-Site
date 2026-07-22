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
// Remaining images (skip logo) used as a rotating pool of real site photography
const PHOTO_POOL = IMAGE_FILES.filter((f) => f !== LOGO_FILE);

function photoFor(seed) {
  if (PHOTO_POOL.length === 0) return null;
  const idx = Math.abs(hashCode(seed)) % PHOTO_POOL.length;
  return u("/assets/images/" + PHOTO_POOL[idx]);
}
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

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
        <a href="${BUSINESS.social.facebook}" aria-label="Facebook" target="_blank" rel="noopener">Facebook</a>
        <a href="${BUSINESS.social.instagram}" aria-label="Instagram" target="_blank" rel="noopener">Instagram</a>
        <a href="${BUSINESS.social.houzz}" aria-label="Houzz" target="_blank" rel="noopener">Houzz</a>
        <a href="${BUSINESS.social.yelp}" aria-label="Yelp" target="_blank" rel="noopener">Yelp</a>
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
    default:
      return "";
  }
}

function renderPage(page) {
  const seed = page.path;
  const heroImg = page.home ? photoFor(seed + "-hero") : photoFor(seed + "-h1");
  const bodyClass = page.home ? "page-home" : "page-inner";

  const heroBlock = page.home
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
