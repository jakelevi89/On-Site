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
  // Houzz and Yelp are the OFFICIAL brand marks (Simple Icons, MIT-licensed path
  // data), not hand-traced approximations. Two earlier attempts shipped here and both
  // were rejected on sight: first a generic house outline + a star (read as "home" and
  // "favourite"), then a hand-traced monogram + burst (still read as generic glyphs).
  // Do not redraw these from memory — if a mark ever needs replacing, take the path
  // from the real logo, the same way these were.
  houzz: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.27 0V24H9.32V16.44H14.68V24H22.73V10.37L6.61 5.75V0H1.27Z"/></svg>`,
  // Yelp burst. The official path ends with a small (R) glyph, trimmed here because at
  // a ~20px button size it renders as an illegible speck of noise beside the mark.
  yelp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7.6885 15.1415-3.6715.8483c-.3769.0871-.755.183-1.1452.155-.2611-.0188-.5122-.0414-.7606-.213a1.179 1.179 0 0 1-.331-.3594c-.3486-.5519-.3656-1.3661-.3697-2.0004a6.2874 6.2874 0 0 1 .3314-2.0642 1.857 1.857 0 0 1 .1073-.2474 2.3426 2.3426 0 0 1 .1255-.2165 2.4572 2.4572 0 0 1 .1563-.1975 1.1736 1.1736 0 0 1 .399-.2831 1.082 1.082 0 0 1 .4592-.0837c.2355.0016.5139.052.91.1734.0555.0191.1237.0382.1856.0572.3277.1013.7048.2404 1.1499.3987.6863.2404 1.3663.487 2.0463.7397l1.2117.4423c.2217.0807.4363.18.6412.297.174.0984.3273.2298.4512.387a1.217 1.217 0 0 1 .192.4309 1.2205 1.2205 0 0 1-.872 1.4522c-.0468.0151-.0852.0239-.1085.0293l-1.105.2553-.0031-.001zM18.8208 7.565a1.8506 1.8506 0 0 0-.2042-.1754 2.4082 2.4082 0 0 0-.2077-.1394 2.3607 2.3607 0 0 0-.2269-.109 1.1705 1.1705 0 0 0-.482-.0796 1.0862 1.0862 0 0 0-.4498.1263c-.2107.1048-.4388.2732-.742.5551-.042.0417-.0947.0886-.142.133-.2502.2351-.5286.5252-.8599.863a114.6363 114.6363 0 0 0-1.5166 1.5629l-.8962.9293a4.1897 4.1897 0 0 0-.4466.5483 1.541 1.541 0 0 0-.2364.5459 1.2199 1.2199 0 0 0 .0107.4518l.0046.02a1.218 1.218 0 0 0 1.4184.923 1.162 1.162 0 0 0 .1105-.0213l4.7781-1.104c.3766-.087.7587-.1667 1.097-.3631.2269-.1316.4428-.262.5909-.5252a1.1793 1.1793 0 0 0 .1405-.4683c.0733-.6512-.2668-1.3908-.5403-1.963a6.2792 6.2792 0 0 0-1.2001-1.7103zM8.9703.0754a8.6724 8.6724 0 0 0-.83.1564c-.2754.066-.548.1383-.8146.2236-.868.2844-2.0884.8063-2.295 1.8065-.1165.5655.1595 1.1439.3737 1.66.2595.6254.614 1.1889.9373 1.7777.8543 1.5545 1.7245 3.0993 2.5922 4.6457.259.4617.5416 1.0464 1.043 1.2856a1.058 1.058 0 0 0 .1013.0383c.2248.0851.4699.1016.7041.0471a4.3015 4.3015 0 0 0 .0418-.0097 1.2136 1.2136 0 0 0 .5658-.3397 1.1033 1.1033 0 0 0 .079-.0822c.3463-.435.3454-1.0833.3764-1.6134.1042-1.771.2139-3.5423.3009-5.3142.0332-.6712.1055-1.3333.0655-2.0096-.0328-.5579-.0368-1.1984-.3891-1.6563-.6218-.8073-1.9476-.741-2.8523-.6158zm2.084 15.9505a1.1053 1.1053 0 0 0-1.2306-.4145 1.1398 1.1398 0 0 0-.1526.0633 1.4806 1.4806 0 0 0-.2171.1354c-.1992.1475-.3668.3392-.5196.5315-.0386.049-.074.1143-.12.1562l-.7686 1.0573a113.9168 113.9168 0 0 0-1.2913 1.789c-.278.3895-.5184.7184-.7083 1.0094-.036.0547-.0734.116-.1075.1647-.2277.3522-.3566.6092-.4228.8381a1.0945 1.0945 0 0 0-.046.4721c.0211.1655.0768.3246.1635.467.046.0715.0957.1406.1487.207a2.334 2.334 0 0 0 .1754.1825 1.843 1.843 0 0 0 .2108.1732c.5304.369 1.1112.6342 1.722.8391a6.0958 6.0958 0 0 0 1.5716.3004c.091.0046.1821.0025.2728-.006a2.3878 2.3878 0 0 0 .2506-.0351 2.3862 2.3862 0 0 0 .2447-.071 1.1927 1.1927 0 0 0 .4175-.2658c.1127-.113.1994-.249.2541-.3989.0889-.2214.1473-.5026.1857-.92.0034-.0593.0118-.1305.0177-.1958.0304-.3463.0443-.7531.0666-1.2315.0375-.7357.067-1.4681.0903-2.2026 0 0 .0495-1.3053.0494-1.306.0113-.3008.002-.6342-.0814-.9336a1.396 1.396 0 0 0-.1756-.4054zm8.6754 2.0439c-.1605-.176-.3878-.3514-.7462-.5682-.0518-.0288-.1124-.0674-.1684-.1009-.2985-.1795-.658-.3684-1.078-.5965a120.7615 120.7615 0 0 0-1.9427-1.042l-1.1515-.6107c-.0597-.0175-.1203-.0607-.1766-.0878-.2212-.1058-.4558-.2045-.6992-.2498a1.4915 1.4915 0 0 0-.2545-.0265 1.1527 1.1527 0 0 0-.1648.01 1.1077 1.1077 0 0 0-.9227.9133 1.4186 1.4186 0 0 0 .0159.439c.0563.3065.1932.6096.3346.875l.615 1.1526c.3422.65.6884 1.2963 1.0435 1.9406.229.4202.4196.7799.5982 1.078.0338.056.0721.1163.1011.1682.2173.3584.392.584.569.7458.1146.1107.252.195.4026.247.1583.0525.326.071.4919.0546a2.368 2.368 0 0 0 .251-.0435c.0817-.022.1622-.048.241-.0784a1.863 1.863 0 0 0 .2475-.1143 6.1018 6.1018 0 0 0 1.2818-.9597c.4596-.4522.8659-.9454 1.182-1.51.044-.08.0819-.163.1138-.2483a2.49 2.49 0 0 0 .0773-.2411c.0186-.083.033-.1669.0429-.2513a1.188 1.188 0 0 0-.0565-.491 1.0933 1.0933 0 0 0-.248-.4041z"/></svg>`,
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
      // text rather than reserving an empty half-width column beside the copy. That
      // collapse is the safety net for any future page that ends up with no photo.
      //
      // MIN_COPY_FOR_PHOTO: the auto-photo is skipped when the copy is too short to
      // balance it. The image column is a fixed 320px tall, so ~3 lines of text beside
      // it left the row visibly half-empty (worst on the product sub-pages and the
      // Accessibility Statement, which Jake flagged 2026-08-08). Short sections now go
      // full-width instead. This gate applies ONLY to the automatic alternating photo:
      // an explicit `image:` always wins, so a section that must keep its photo just
      // pins one.
      //
      // 290 is TUNED, not arbitrary, and the gap it threads is narrow — re-measure
      // before changing it. The 16 city x category leaf-page leads run 299-390 chars
      // and must KEEP their photo; the sections that read as half-empty (accessibility
      // 243/265, short blog and product sub-sections 188-287) sit just below. Raising
      // this to 450 strips 32 of 52 body photos and blanks every leaf page.
      const MIN_COPY_FOR_PHOTO = 290;
      let img = null;
      if (!section.noImage) {
        if (section.image) img = u("/assets/images/" + section.image);
        else if (idx % 2 === 0 && section.body.join(" ").length >= MIN_COPY_FOR_PHOTO) img = photoFor(pageSeed + idx);
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
    case "photoStrip": {
      // Homepage "Find Us On" block. This was a rotating carousel (arrows + dots,
      // one photo at a time, full width) until 2026-08-08 — that was the wrong
      // component entirely: live shows the "Find Us On" label inline with a Houzz
      // badge and social buttons, then all four photos side by side as a plain static
      // grid with no slideshow behaviour. Do not reintroduce the carousel here.
      //
      // The social marks are the real badge images already in the repo (img_016 Houzz,
      // img_006 Instagram, img_007 Facebook), not glyphs — they are in BRAND_FILES so
      // they can never leak into PHOTO_POOL.
      const socials = section.socials || [];
      return `<section class="section">
        ${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}
        ${
          section.cta
            ? `<a class="btn-pill" href="${u(section.cta.href)}">${esc(section.cta.label)} <span class="arrow">&#8594;</span></a>`
            : ""
        }
        ${
          section.label || socials.length
            ? `<div class="find-us">
          ${section.label ? `<p class="find-us-label">${esc(section.label)}</p>` : ""}
          ${socials
            .map(
              (s) =>
                `<a class="find-us-badge${s.wide ? " find-us-badge-wide" : ""}" href="${s.href}" aria-label="${esc(s.alt)}" target="_blank" rel="noopener"><img src="${u("/assets/images/" + s.file)}" alt="${esc(s.alt)}" loading="lazy"></a>`
            )
            .join("\n          ")}
        </div>`
            : ""
        }
        <div class="photo-strip">
          ${section.images
            .map((img) => `<img src="${u("/assets/images/" + img.file)}" alt="${esc(img.alt)}" loading="lazy">`)
            .join("\n          ")}
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
              (p) => `<a class="blog-card${p.image ? " blog-card-featured" : ""}" href="${u(p.href)}">
            ${p.image ? `<img src="${u("/assets/images/" + p.image)}" alt="${esc(p.imageAlt || p.title)}" loading="lazy">` : ""}
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
  // `noHero: true` skips the banner section entirely (see heroBlock below) — for
  // pages where live has no banner photo at all (confirmed by screenshot: Our Work,
  // Accessibility Statement, Blog index, all 4 blog posts). heroImg is unused in
  // that case but computing it unconditionally keeps this block simple.
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
    : page.noHero
    ? `<div class="page-title-plain">
        ${page.postMeta ? `<p class="post-meta">${esc(page.postMeta.date)} &middot; ${esc(page.postMeta.readTime)}</p>` : ""}
        <h1>${esc(page.h1)}</h1>
      </div>`
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
