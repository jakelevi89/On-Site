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
// Square icon-only crop of the logo mark, for the browser-tab favicon. LOGO_FILE
// itself is a wide lockup (icon + wordmark + tagline, ~2.66:1) since the header/
// footer crop it larger for legibility (2026-08-08 fix pass) — using that wide
// image directly as a favicon squashes it into the square tab-icon slot and it
// renders visibly stretched. This file is NOT in manifest.txt, so it's invisible
// to IMAGE_FILES/PHOTO_POOL and can never leak into a photo gallery.
const FAVICON_FILE = "favicon-icon.png";

// ---- image pools ----
// image-meta.json ({file: [w, h]}) is generated from the actual files; used to keep
// logos, icons, and tiny thumbnails out of the random photo pools. Regenerate with
// PIL if images change (see README).
const META = JSON.parse(fs.readFileSync(path.join(__dirname, "image-meta.json"), "utf8"));
// Known brand/logo/icon files (identified against the live site) — never usable as photos.
// Getting this list wrong is visible: anything omitted here that isn't photography
// leaks into PHOTO_POOL and can land in a body slot or the Our Work gallery (that is
// exactly how the black Houzz badge ended up mid-page on the Blind Cleaning page and
// how the logo-on-white OG card became the Cleaning banner — 2026-08-08 fix pass).
const BRAND_FILES = new Set([
  LOGO_FILE,
  "img_003.png", // Hunter Douglas vertical badge
  "img_005.png", // wide partner banner
  "img_006.png", // social icon
  "img_007.png", // social icon
  "img_012.png", // Alta Window Fashions logo
  "img_013.png", // Accent Awning Company logo
  "img_014.png", // Hunter Douglas horizontal logo
  "img_015.jpg", // Fabricut logo
  "img_016.jpg", // Houzz badge (black square) — NOT a photo
  "img_017.jpg", // Yelp badge — NOT a photo
  "img_018.jpg", // On-Site logo on white (the site's OG/share card) — NOT a photo
  "img_129.jpg", // Orion Ornamental Iron logo
  "img_130.png", // Kirsch logo
  "img_131.png", // Sunbrella logo
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
  // Houzz: the real wordmark's "h" monogram — two offset parallelograms with the
  // notched centre. The old generic house glyph and star were placeholders that read
  // as "home" and "favourite", not as Houzz and Yelp (2026-08-08 fix pass).
  // Houzz "h" monogram: two offset vertical parallelograms, each with a triangular
  // bite out of its inner edge. Traced off the real mark (assets/images/img_016.jpg)
  // rather than drawn from memory — the previous glyph here was a generic house
  // outline, which read as "home", not as Houzz.
  houzz: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.9 0 11.9 8.5 5.3 12.3 11.9 16.4 5.1 20.3 5.1 4.2Z M19 4.2 19 20.3 12.1 24 12.1 16.4 18.5 12.3 12.1 8.7Z"/></svg>`,
  // Yelp: the burst mark — the tall left flame plus the four right-hand rays.
  yelp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 11.4 4.9 8.6c-.5-.2-.7-.8-.5-1.4.1-.2.2-.4.4-.5C6 5.4 8 4.4 10 4c.7-.1 1.3.3 1.4 1v.2l.2 6c0 .5-.3.9-.8 1a1 1 0 0 1-.2 0Zm.3 2.9c.2-.4 0-1-.4-1.2h-.2l-5 2.2c-.6.2-.8.9-.6 1.4l.3.4c1.1 1.2 2.5 2.2 4 2.8.6.2 1.3-.1 1.5-.7v-.3l.4-4.6Zm2.6-.4c-.4-.3-1-.2-1.3.2v.2l-1.7 4.3c-.2.6.1 1.3.7 1.5h.4c1.7.1 3.4-.2 4.9-.9.6-.3.8-1 .5-1.5l-.2-.2-3.3-3.6Zm1.4-2.5c-.4.1-.7.6-.6 1 0 .2.1.4.3.5l3.4 3.1c.4.4 1.1.4 1.5 0l.2-.3c.9-1.4 1.4-3 1.5-4.7 0-.6-.5-1.2-1.1-1.2h-.3l-4.9 1.6Zm-.4-2.5c.2.4.7.6 1.2.5l.2-.1 3.9-3.2c.5-.4.5-1.1.1-1.6l-.3-.2A9.7 9.7 0 0 0 15.4 3c-.6-.1-1.2.4-1.3 1v.3l.4 4.6Z"/></svg>`,
};

function esc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Body copy in data.js is plain text, escaped like everything else — EXCEPT for one
// markdown-style form: [anchor text](/internal/path). rich() escapes first and only
// then turns that bracket form into a real <a>, so nothing an author types can inject
// markup; only this one deliberate syntax produces a tag.
//
// This exists for the sitewide in-paragraph internal linking pass (2026-08-08): the
// live Wix site embeds links inside sentences on nearly every page, and those inline
// anchors are the internal-linking signal that the bottom "Check out our..." blocks
// alone don't provide. Root-relative hrefs get the BASE_PATH prefix; anything else
// (tel:, mailto:, https:) is passed through untouched.
function rich(s) {
  return esc(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_m, label, href) {
    const url = href.startsWith("/") ? u(href) : href;
    return `<a href="${url}">${label}</a>`;
  });
}

// Sections that are just a heading plus a list render an empty box when the list is
// empty — a heading with visible nothing under it. Three service-area detail pages hit
// this (they have no "Our Selection of..." items). Drop the whole section instead.
function isEmptySection(section) {
  if (["checklist", "linkgrid", "pins", "cardlinks", "bloglist"].includes(section.type)) {
    return !section.items || section.items.length === 0;
  }
  return false;
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
        <img src="${u("/assets/images/" + LOGO_FILE)}" alt="${esc(BUSINESS.name)}" width="359" height="135">
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
        <img src="${u("/assets/images/" + LOGO_FILE)}" alt="${esc(BUSINESS.name)}" width="359" height="135">
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
      // Image resolution, in order: an explicit `image` on the section, then the
      // alternating auto-photo, then none. `noImage: true` forces text-only.
      // The two-column grid class is only applied when an image is actually going to
      // be rendered — a section with no image collapses to single-column full-width
      // text rather than reserving an empty half-width column beside the copy.
      let img = null;
      if (!section.noImage) {
        if (section.image) img = u("/assets/images/" + section.image);
        else if (idx % 2 === 0) img = photoFor(pageSeed + idx);
      }
      return `<section class="section${img ? " section-with-image" : ""}">
        ${img ? `<div class="section-image"><img src="${img}" alt="${esc(section.imageAlt || "")}" loading="lazy"></div>` : ""}
        <div class="section-body">
          ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
          ${section.body.map((p) => `<p>${rich(p)}</p>`).join("\n          ")}
        </div>
        ${
          section.buttonCta
            ? `<p class="section-cta-standalone"><a class="btn btn-dark" href="${u(section.buttonCta.href)}">${esc(section.buttonCta.label)}</a></p>`
            : ""
        }
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
          ${section.body.map((p) => `<p>${rich(p)}</p>`).join("\n          ")}
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
        ${section.galleryLabel ? `<p class="carousel-label">${esc(section.galleryLabel)}</p>` : ""}
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
      // Manufacturer logo strip. The live site rotates through the brands in groups
      // (Alta / Accent Awning / Hunter Douglas / Fabricut, then Orion / Kirsch /
      // Sunbrella), so `groups` is an array of arrays and each group is one slide.
      // Group 1 is inlined active so the strip still shows real logos with JS off;
      // rotation lives in assets/js/main.js.
      const groups = section.groups || [section.items];
      const renderLogo = (item) => {
        const img = `<img src="${u("/assets/images/" + item.file)}" alt="${esc(item.alt)}" loading="lazy">`;
        return item.href ? `<a href="${u(item.href)}">${img}</a>` : img;
      };
      if (groups.length < 2) {
        return `<section class="section brand-bar">
        <div class="brand-bar-inner">
          ${groups[0].map(renderLogo).join("\n          ")}
        </div>
      </section>`;
      }
      return `<section class="section brand-bar">
        <div class="brand-bar-rotator" data-brand-bar>
          ${groups
            .map(
              (g, i) =>
                `<div class="brand-bar-inner brand-bar-slide${i === 0 ? " active" : ""}">
            ${g.map(renderLogo).join("\n            ")}
          </div>`
            )
            .join("\n          ")}
        </div>
        <div class="brand-bar-dots">
          ${groups
            .map((g, i) => `<button class="brand-bar-dot${i === 0 ? " active" : ""}" aria-label="Show brand group ${i + 1}"></button>`)
            .join("\n          ")}
        </div>
      </section>`;
    }
    case "cardlinks": {
      // Large clickable photo cards — the live site's landing-card pattern (e.g. the
      // Blind Cleaning / Drapery Cleaning pair directly under the Cleaning banner).
      return `<section class="section">
        ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
        ${section.intro ? `<p>${rich(section.intro)}</p>` : ""}
        <div class="card-links">
          ${section.items
            .map(
              (i) => `<a class="photo-card" href="${u(i.href)}">
            <img src="${u("/assets/images/" + i.file)}" alt="${esc(i.alt || i.label)}" loading="lazy">
            <span class="photo-card-label">${esc(i.label)}</span>
            ${i.blurb ? `<span class="photo-card-blurb">${esc(i.blurb)}</span>` : ""}
          </a>`
            )
            .join("\n          ")}
        </div>
      </section>`;
    }
    case "checklist": {
      return `<section class="section">
        ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
        ${section.intro ? `<p>${rich(section.intro)}</p>` : ""}
        <ul class="checklist">
          ${section.items.map((i) => `<li>${rich(i)}</li>`).join("\n          ")}
        </ul>
      </section>`;
    }
    case "linkgrid": {
      // Items carrying a `file` render as photo cards (the live Service Areas page's
      // city cards); items without one stay as the plain text cards used by every
      // bottom cross-link block.
      const anyPhotos = section.items.some((i) => i.file);
      return `<section class="section">
        ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
        ${section.intro ? `<p>${rich(section.intro)}</p>` : ""}
        <div class="${anyPhotos ? "card-links" : "link-grid"}">
          ${section.items
            .map((i) =>
              i.file
                ? `<a class="photo-card" href="${u(i.href)}">
            <img src="${u("/assets/images/" + i.file)}" alt="${esc(i.alt || i.label)}" loading="lazy">
            <span class="photo-card-label">${esc(i.label)}</span>
          </a>`
                : `<a class="link-card" href="${u(i.href)}">${esc(i.label)}</a>`
            )
            .join("\n          ")}
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
        ${section.body.map((p) => `<p>${rich(p)}</p>`).join("\n        ")}
        <a class="btn btn-accent" href="${u("/contact-us")}">Get a Free Consultation</a>
      </section>`;
    }
    case "gallery": {
      // An explicit `images` list is the real gallery (Our Work mirrors the live site's
      // 21 project photos, in the live order). The PHOTO_POOL fallback is a slice of
      // whatever happens to be in the pool, so it can pull in the wrong kind of image —
      // prefer an explicit list for any gallery that is meant to be curated.
      const imgs = section.images || PHOTO_POOL.slice(0, section.count || 21);
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
      // DEV NOTE (source only — never render this to visitors): these forms have no
      // backend yet and must be wired to Formspree/Netlify Forms before launch. See
      // README "Contact form". The old visible "this form needs to be connected..."
      // placeholder line was removed 2026-08-06 — it was showing to real site visitors.
      return `<section class="section contact-section">
        <div class="contact-info">
          ${section.body.map((p) => `<p class="lead">${rich(p)}</p>`).join("")}
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
          ${section.intro ? `<p class="lead">${rich(section.intro)}</p>` : ""}
        </div>
        <form class="contact-form" name="cleaning-quick-form" method="POST" data-static-form>
          <label>First Name<input type="text" name="firstName" required></label>
          <label>Last Name<input type="text" name="lastName" required></label>
          <label>Email<input type="email" name="email" required></label>
          <button type="submit" class="btn btn-accent">Send</button>
        </form>
      </section>`;
    }
    default:
      return "";
  }
}

function renderPage(page) {
  const seed = page.path;
  // `heroImage` pins a page's banner to a specific file. Without it the banner is
  // whatever HERO_POOL happens to hash to, which is fine for most pages but produced
  // the logo-on-grey Cleaning banner — pin the banner wherever the choice matters.
  const heroImg = page.heroImage
    ? u("/assets/images/" + page.heroImage)
    : page.home
    ? heroFor(seed + "-hero")
    : heroFor(seed + "-h1");
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

  // Index BEFORE filtering so dropping an empty section doesn't shuffle the
  // even/odd photo alternation of every section after it.
  const sectionsHtml = (page.sections || [])
    .map((s, i) => (isEmptySection(s) ? "" : renderSection(s, seed, i)))
    .filter(Boolean)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="https://www.on-sitespecialists.com${page.path}">
<link rel="icon" href="${u("/assets/images/" + FAVICON_FILE)}" sizes="192x192">
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
<!-- AI chat widget. Injects its own markup; talks to the /api/chat function
     (functions/api/chat.js), which only runs on Cloudflare Pages. On the static
     GitHub Pages preview it degrades to a "call us" message. To point it at a
     different host, define window.ONSITE_CHAT_ENDPOINT before this script. -->
<script src="${u("/assets/js/chat-widget.js")}" defer></script>
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
const today = "2026-08-08"; // bump this when regenerating after real content changes
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
