// Site content data, extracted from the live on-sitespecialists.com site (Wix).
// Used by build.js to generate static HTML pages.

const BUSINESS = {
  name: "On-Site Custom Drapes & Blinds",
  phone: "(949) 770-8989",
  phoneHref: "tel:+19497708989",
  email: "sales@on-sitespecialists.com",
  address: "23452 Peralta Dr STE A, Laguna Hills, CA 92653",
  serviceAreaShort: "Orange County - San Diego - Los Angeles",
  social: {
    // Real profile URLs pulled from the live Wix site footer (2026-07-22)
    facebook: "https://www.facebook.com/drapesandblindcleaning/",
    instagram: "https://www.instagram.com/draperyandblindspecialists",
    houzz: "https://www.houzz.com/pro/rosebahou/on-site-specialists",
    yelp: "https://www.yelp.com/biz/on-site-custom-drapes-and-blinds-mission-viejo",
  },
};

// Primary nav (used in header)
const NAV = [
  { label: "Home", href: "/" },
  {
    label: "Products",
    href: "/hunter-douglas-shades-blinds",
    children: [
      { label: "Custom Window Treatments", href: "/custom-window-treatments-orange-county" },
      { label: "Sheer Shades & Silhouettes", href: "/hunter-douglas-shades-blinds/sheer-shades" },
      { label: "Drapery & Top Treatments", href: "/hunter-douglas-shades-blinds/drapery-top-treatments" },
      { label: "Wood & Faux Wood Blinds", href: "/hunter-douglas-shades-blinds/wood-blinds-orange-county" },
      { label: "Roller, Roman & Banded Shades", href: "/hunter-douglas-shades-blinds/roller-roman-shades" },
      { label: "Woven Woods & Bamboo Shades", href: "/hunter-douglas-shades-blinds/woven-wood-bamboo" },
      { label: "Motorization", href: "/hunter-douglas-shades-blinds/motorized-blinds-repairs" },
    ],
  },
  {
    label: "Cleaning",
    href: "/hunter-douglas-blind-cleaning",
    children: [
      { label: "Blind Cleaning", href: "/hunter-douglas-blind-cleaning/orange-county" },
      { label: "Drapery Cleaning", href: "/hunter-douglas-blind-cleaning/drapery-orange-county" },
    ],
  },
  { label: "About Us", href: "/about-us" },
  {
    label: "Service Areas",
    href: "/service-areas",
    children: [
      { label: "Newport Beach", href: "/service-areas/window-treatments-newport-beach" },
      { label: "Huntington Beach", href: "/service-areas/window-treatments-huntington-beach" },
      { label: "Laguna Beach", href: "/service-areas/window-treatments-laguna-beach" },
      { label: "Irvine", href: "/service-areas/drapes-and-blinds-irvine" },
    ],
  },
  { label: "Our Work", href: "/our-work" },
  { label: "Blog", href: "/window-treatment-blog-orange-county" },
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/hunter-douglas-shades-blinds" },
  { label: "Cleaning", href: "/hunter-douglas-blind-cleaning" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "About Us", href: "/about-us" },
  { label: "Our Work", href: "/our-work" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Accessibility Statement", href: "/accessibility-statement" },
];

// Reusable "why choose" bullet block used across many product/service-area pages
function whyChoose(items) {
  return { type: "checklist", items };
}

// ---- Cross-link lists (the "Check out our service areas / products / cleaning /
// blog" link blocks that appear at the bottom of most live pages — a deliberate
// internal-linking / local-SEO pattern; see seo-service-area-pages-win.md, which
// credits this exact hub-and-spoke structure with real ROI). Kept as shared
// constants so every page pulls from one source of truth.
const PRODUCT_LINKS = [
  { label: "Sheer Shades & Silhouettes", href: "/hunter-douglas-shades-blinds/sheer-shades" },
  { label: "Drapery and Top Treatments", href: "/hunter-douglas-shades-blinds/drapery-top-treatments" },
  { label: "Woven Woods & Bamboo Shades", href: "/hunter-douglas-shades-blinds/woven-wood-bamboo" },
  { label: "Roller, Roman & Banded Shades", href: "/hunter-douglas-shades-blinds/roller-roman-shades" },
  { label: "Motorization", href: "/hunter-douglas-shades-blinds/motorized-blinds-repairs" },
  { label: "Wood & Faux Wood Blinds", href: "/hunter-douglas-shades-blinds/wood-blinds-orange-county" },
  { label: "Custom Window Treatments", href: "/custom-window-treatments-orange-county" },
];
const CLEANING_LINKS = [
  { label: "Blind Cleaning", href: "/hunter-douglas-blind-cleaning/orange-county" },
  { label: "Drapery Cleaning", href: "/hunter-douglas-blind-cleaning/drapery-orange-county" },
];
const SERVICE_AREA_LINKS = [
  { label: "Newport Beach", href: "/service-areas/window-treatments-newport-beach" },
  { label: "Irvine", href: "/service-areas/drapes-and-blinds-irvine" },
  { label: "Huntington Beach", href: "/service-areas/window-treatments-huntington-beach" },
  { label: "Laguna Beach", href: "/service-areas/window-treatments-laguna-beach" },
];
const BLOG_LINKS = [{ label: "Our Blog", href: "/window-treatment-blog-orange-county" }];

function crossLink(heading, items) {
  return { type: "linkgrid", heading, items, crossLink: true };
}

function crumbs(list) {
  return list;
}

// ---- IMAGES ----
// Downloaded from the live site into assets/images/img_000.png ... img_128.*
// img_000.png is the logo. The rest are real photography from the site,
// distributed across pages (the crawl captured a flat pool of 129 unique
// images site-wide rather than a strict per-page mapping).
const IMG = (n) => `/assets/images/img_${String(n).padStart(3, "0")}.${["001","047","060","078","103","116","119","125"].includes(String(n)) ? "png" : "jpg"}`;
// Simpler: just build actual filenames from the manifest at build time (see build.js loadImageManifest()).

const PAGES = [];

// ================= HOME =================
PAGES.push({
  path: "/",
  title: "On-Site Custom Drapes & Blinds | Luxury Window Treatments OC",
  description: "Transform your space with On-Site Custom Drapes & Blinds! We specialize in custom drapes, blinds, and expert cleaning services in Orange County. Elevate your window treatments today!",
  nav: "Home",
  home: true,
  h1: "Custom Window Treatments",
  h1sub: "Certified Cleaning - Affordable Pricing",
  // Rotating hero banner — same 5 slides as the live site's Wix SlideShowContainer.
  // Slide 1 (img_001) is the one Wix server-renders; img_008-011 are the other
  // four slide backgrounds (all 2:1 banner-format images).
  heroSlides: [
    { file: "img_001.png", alt: "Custom window treatments showcase" },
    { file: "img_008.jpeg", alt: "Blue drapes" },
    { file: "img_009.jpg", alt: "Blue drapes in a Newport Beach home" },
    { file: "img_010.jpeg", alt: "Cellular shades in a Laguna Beach home" },
    { file: "img_011.jpeg", alt: "Banded shades in an Irvine home" },
  ],
  sections: [
    {
      // Live site uses a real Wix Video Box component here (video.wixstatic.com/
      // video/132425_c808b352878a4a1cab761a4aff8c8545), not a static photo — pulled
      // directly from the live site 2026-08-06 (see website-clone-comparison doc).
      type: "textVideo",
      heading: "Window Treatment Specialists",
      videoFile: "hero-720p.mp4",
      poster: "img_001.png",
      body: [
        "On-Site Custom Drapes & Blinds sales team is second to none! With expert knowledge, personalized service, and a commitment to excellence, they ensure every client finds the perfect window treatment solutions. We also offer cutting-edge technology & automation with PowerView® Automation, allowing you to schedule window treatments to open and close at your convenience. Available on almost all of our solutions, PowerView seamlessly integrates with smart home systems for ultimate convenience. Trust our extraordinary sales team to deliver the best in drapery, blinds, and automation—every time!",
      ],
    },
    {
      type: "text",
      heading: "Window Treatment Cleaning Specialists",
      body: [
        "At On-Site Specialists, we take pride in our expert drapery and blind cleaning services. Hunter Douglas refers our method of cleaning as one of the best in the industry — the injection/extraction method — which cleans window treatments on-site without the shrinkage or damage risked by ordinary cleaning methods.",
      ],
    },
    {
      // Newport Beach project-photo showcase — live homepage has a captioned photo
      // gallery + "Check out our Hunter Douglas blinds in Newport Beach" teaser here,
      // reusing the same 4 photos as the hero slideshow (img_008-011).
      type: "carousel",
      heading: "Check out our Hunter Douglas blinds in Newport Beach for custom solutions.",
      // Live site has a plain "Newport Beach" text link here — redesigned as a
      // proper pill CTA button per Jake, 2026-08-06 ("don't match it identically").
      cta: { label: "Newport Beach", href: "/service-areas/window-treatments-newport-beach" },
      images: [
        { file: "img_008.jpeg", alt: "Blue drapes" },
        { file: "img_009.jpg", alt: "Blue and white drapes inside a Newport Beach home" },
        { file: "img_010.jpeg", alt: "Cellular shades inside a Laguna Beach home" },
        { file: "img_011.jpeg", alt: "Banded shades inside an Irvine home" },
      ],
    },
    crossLink("Check out our service areas:", SERVICE_AREA_LINKS),
    crossLink("Check out our cleaning services:", CLEANING_LINKS),
    crossLink("Check out our products page:", PRODUCT_LINKS),
    {
      // Brand logo strip — mirrors the live site's Hunter Douglas / Alta partner row
      type: "brandbar",
      items: [
        {
          file: "img_014.png",
          alt: "Hunter Douglas",
          href: "/service-areas/window-treatments-laguna-beach/hunter-douglas-shades",
        },
        { file: "img_012.png", alt: "Alta Window Fashions" },
        { file: "img_015.jpg", alt: "Window treatments logo" },
      ],
    },
    {
      type: "cta",
      heading: "Ready to Upgrade Your Windows?",
      body: ["Call today for a free, no-obligation in-home consultation."],
    },
  ],
});

// ================= ABOUT / WORK / CONTACT / ACCESSIBILITY =================
PAGES.push({
  path: "/about-us",
  title: "About On-Site Custom Drapes & Blinds | Window Treatment Experts",
  description: "Learn about On-Site Custom Drapes & Blinds — 20+ years of experience as a Certified Hunter Douglas Dealer serving Orange County, LA, and San Diego.",
  nav: "About Us",
  h1: "Your Trusted Window Treatment Experts in Orange County",
  sections: [
    {
      type: "text",
      heading: "Who We Are",
      body: [
        "Founded over 20 years ago, On-Site Custom Drapes & Blinds has become a leader in custom window treatments, motorized blinds, and professional drapery & blind cleaning. We proudly serve Orange County, Los Angeles, San Diego, and surrounding Southern California cities, offering high-quality window solutions for residential and commercial spaces.",
        "As a Hunter Douglas Dealer and Certified Cleaner, we specialize in custom blinds, drapery, and motorized window treatments tailored to your style and needs.",
      ],
    },
    {
      type: "checklist",
      heading: "Our Mission",
      items: [
        "Deliver high-quality craftsmanship and expert installation",
        "Provide professional blind & drapery cleaning with our advanced Injection-Extraction method",
        "Offer a seamless customer experience from consultation to installation",
      ],
    },
    {
      type: "checklist",
      heading: "Why Choose Us",
      items: [
        "Certified Hunter Douglas Dealer & Installer",
        "20+ Years of Industry Expertise",
        "Eco-Friendly Cleaning Solutions for Drapes & Blinds",
        "Serving Newport Beach, Laguna Beach, Irvine & More",
        "Shop-at-Home Convenience – We Bring the Store to You!",
      ],
    },
    {
      type: "text",
      heading: "Meet Our Team",
      body: ["Our expert team is professionally trained in window treatment applications, motorization, and cleaning techniques. Whether you're purchasing new blinds & drapery or cleaning & maintaining your existing treatments, we ensure the highest level of precision and care.", "Every design solution is tailored to match your space, style, and budget. We prioritize exceptional customer service, competitive pricing, and on-time scheduling to make your experience seamless."],
    },
    {
      type: "linkgrid",
      heading: "One Stop Shop",
      intro: "Let us bring our shop-at-home service to your door! Looking for custom blinds or drapery? Explore our Hunter Douglas Shades & Blinds. Need professional drapery or blind cleaning? Learn about our drapery cleaning services.",
      items: [
        { label: "Hunter Douglas Shades & Blinds", href: "/hunter-douglas-shades-blinds" },
        { label: "Drapery & Blind Cleaning", href: "/hunter-douglas-blind-cleaning" },
      ],
    },
    crossLink("Check out our service areas:", SERVICE_AREA_LINKS),
    crossLink("Check out our products page:", PRODUCT_LINKS),
  ],
});

PAGES.push({
  path: "/our-work",
  title: "Our Work | On-Site Custom Drapes & Blinds",
  description: "See completed drapery, blinds, and cleaning projects by On-Site Custom Drapes & Blinds across Orange County.",
  nav: "Our Work",
  h1: "Our Work",
  sections: [
    {
      type: "gallery",
      count: 21,
    },
    {
      type: "cta",
      heading: "Call today for our Spring Cleaning Specials!",
      body: [BUSINESS.phone],
    },
  ],
});

PAGES.push({
  path: "/contact-us",
  title: "Contact On-Site Custom Drapes & Blinds | Get a Free Consultation",
  description: "Contact On-Site Custom Drapes & Blinds for a free in-home consultation. Serving Orange County, San Diego, and Los Angeles.",
  nav: "Contact",
  h1: "Contact Us!",
  sections: [
    {
      type: "contactForm",
      body: ["Call us today for a free in-home consultation!"],
    },
  ],
});

PAGES.push({
  path: "/accessibility-statement",
  title: "Accessibility Statement | On-Site Custom Drapes & Blinds",
  description: "Accessibility statement for On-Site Custom Drapes & Blinds.",
  nav: null,
  h1: "Accessibility Statement",
  sections: [
    {
      type: "text",
      heading: "Accessibility Statement for On-Site Custom Drapes & Blinds",
      body: [
        "This is an accessibility statement from On-Site Custom Drapes & Blinds.",
        "We are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.",
      ],
    },
    {
      type: "text",
      heading: "Conformance Status",
      body: [
        "The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. On-Site Custom Drapes & Blinds is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.",
      ],
    },
    {
      type: "text",
      heading: "Feedback",
      body: [
        `We welcome your feedback on the accessibility of this site. Please let us know if you encounter accessibility barriers by phone at ${BUSINESS.phone}, by mail at ${BUSINESS.address}, or through our social media channels.`,
      ],
    },
  ],
});

// ================= PRODUCTS =================
PAGES.push({
  path: "/custom-window-treatments-orange-county",
  title: "Custom Window Treatments | On-Site Custom Drapes & Blinds",
  description: "Luxury custom window treatments for Orange County homes and businesses — drapery, blinds, shades, and Hunter Douglas PowerView Automation.",
  nav: "Products",
  h1: "Custom Window Treatments in Orange County",
  sections: [
    {
      type: "text",
      body: [
        "At On-Site Custom Drapes & Blinds, we specialize in providing luxury custom window treatments for homes and businesses throughout Orange County. Whether you're in Huntington Beach, Newport Beach, Laguna Beach, or Irvine, our expert team brings your vision to life with elegant, made-to-measure drapery, blinds, and shades tailored to complement your space. From initial design consultation to professional installation, we guide you through every step to ensure your window treatments not only enhance your décor but also provide optimal light control, privacy, and energy efficiency.",
        "Choose from premium materials, sophisticated fabrics, and the latest innovations like Hunter Douglas PowerView® Automation, giving you the ultimate convenience of motorized shades controlled from your phone or smart home system. Experience the difference of true customization and transform your windows into a statement of style and comfort.",
      ],
    },
    {
      type: "checklist",
      heading: "Why Choose Our Custom Window Treatments?",
      items: [
        "Tailored designs to match your home's architecture and interior style",
        "High-end materials, from rich velvets to eco-friendly natural fibers",
        "Expert craftsmanship with over 20 years of experience",
        "Full-service options, including motorization, installation, and repairs",
        "Local expertise serving Orange County's most discerning homeowners",
      ],
    },
    { type: "cta", heading: "Ready to elevate your space?", body: ["Contact us today for a personalized consultation."] },
  ],
});

PAGES.push({
  path: "/hunter-douglas-shades-blinds",
  title: "Roller Shades & Blinds | On-Site Custom Drapes & Blinds",
  description: "Explore our full line of Hunter Douglas shades, blinds, drapery, and motorization for Orange County homes.",
  nav: "Products",
  h1: "Custom Window Treatments for Every Style & Need",
  sections: [
    {
      type: "text",
      body: ["At On-Site Custom Drapes & Blinds, we offer a wide selection of luxury window treatments designed for style, functionality, and energy efficiency. Explore our product categories below, or schedule a complimentary consultation."],
    },
    {
      type: "linkgrid",
      heading: "Product Categories",
      items: [
        { label: "Sheer Shades & Silhouettes", href: "/hunter-douglas-shades-blinds/sheer-shades" },
        { label: "Drapery and Top Treatments", href: "/hunter-douglas-shades-blinds/drapery-top-treatments" },
        { label: "Woven Woods & Bamboo Shades", href: "/hunter-douglas-shades-blinds/woven-wood-bamboo" },
        { label: "Roller, Roman & Banded Shades", href: "/hunter-douglas-shades-blinds/roller-roman-shades" },
        { label: "Motorization", href: "/hunter-douglas-shades-blinds/motorized-blinds-repairs" },
        { label: "Wood & Faux Wood Blinds", href: "/hunter-douglas-shades-blinds/wood-blinds-orange-county" },
      ],
    },
    crossLink("Check out our cleaning services:", CLEANING_LINKS),
    crossLink("Check out our service areas:", SERVICE_AREA_LINKS),
  ],
});

PAGES.push({
  path: "/hunter-douglas-shades-blinds/motorized-blinds-repairs",
  title: "Motorized Blinds & Shades | Orange County | On-Site Custom Drapes",
  description: "Motorized window treatments and PowerView Automation for Orange County homes — convenience, safety, and energy efficiency.",
  nav: "Products",
  h1: "Motorization",
  sections: [
    {
      type: "text",
      body: [
        "When it comes time to decide whether you want your custom window treatments with a motorized operating system, convenience is a key consideration – but it is not the only one. Enhanced safety is another benefit. As is greater energy efficiency.",
        "Virtually every type of product can be outfitted with a motorized system – we offer the most innovative technology in the industry. The system appropriate for your custom window coverings depends mostly on the type of product you purchase. Some systems raise and lower window treatments and adjust slats, vanes and louvers, while others move the window covering from side to side, rotating vanes and louvers.",
      ],
    },
    {
      type: "text",
      heading: "Convenience in Every Room",
      body: [
        "With a simple press of a button, wirelessly operate your home's motorized window fashions. With the push of a button, darken your media room for a video game or to watch your favorite movie. Simultaneously lower groups of shades or tilt blinds to protect your home furnishings from harsh ultraviolet rays. Reach for the remote on your night stand to lower bedroom shades or tilt blinds for an afternoon nap — all accomplished quickly and conveniently with a remote or wireless wall switch. Control window fashions throughout your house with a simple slide and tap on your mobile device. Wireless accessories allow you to automate your motorization system further.",
      ],
    },
    { type: "cta", heading: "Don't wait!", body: ["Call us today! " + BUSINESS.phone] },
  ],
});

PAGES.push({
  path: "/hunter-douglas-shades-blinds/sheer-shades",
  title: "Sheer Shades & Silhouettes | Drapes & Blinds in Orange County",
  description: "Sheer shades, Silhouette®, Luminette®, Pirouette® and Vignette® window shadings — privacy and softened light in one elegant solution.",
  nav: "Products",
  h1: "Sheer Shades",
  sections: [
    {
      type: "text",
      body: ["Sheer shades are innovative products that offer the privacy benefits of a window shade with the softening view of a sheer. Our sheer shades delicately filter incoming sunshine to create an inviting room ambiance. They also keep out harmful UV rays that can damage your furnishings and artwork."],
    },
    {
      type: "text",
      heading: "Silhouette® — Window Shadings",
      body: ["Transforming light. Like the subtle cast their name suggests, Silhouette® window shadings, with the Signature S-Vane™, create beautiful and ambient light and shadow. Soft fabric vanes are suspended between two sheers, diffusing softened light deep into a room. Tilt the vanes to achieve the privacy you desire while maintaining UV protection."],
    },
    {
      type: "text",
      heading: "Luminette® — Privacy Sheers",
      body: ["Privacy with softened light. Enjoy subdued light and the privacy of soft draperies in Luminette® Privacy Sheers. Fabric vanes rotate for privacy while controlling the light in a room. Perfect for large windows and sliding glass doors, their superior UV protection meets both your decorating and practical needs."],
    },
    {
      type: "text",
      heading: "Pirouette® — Window Shadings",
      body: ["Striking design, dramatically filtered light. With Pirouette® window shadings, the look and feel of a traditional fabric shade is enhanced: the gentle pull of a cord lets you change a room's lighting in a whole new way. Soft, horizontal fabric vanes close to filter natural light, or open to give you a perfect outside view. Our revolutionary Invisi-Lift™ system allows the vanes to float gracefully, and even opened they offer UV protection and reduced glare through the sheer backing."],
    },
    {
      type: "text",
      heading: "Vignette® — Modern Roman Shades",
      body: ["Simple, uncluttered, innovative. Luxurious fabrics and soft folds give Vignette® Modern Roman Shades a clean, crisp look, with the added benefit of enhanced child safety. Offered in semi-sheer, light-filtering and room-darkening fabrics, the range of styles and fold sizes help you create warm, inviting, beautiful windows."],
    },
  ],
});

PAGES.push({
  path: "/hunter-douglas-shades-blinds/wood-blinds-orange-county",
  title: "Wood Blinds & Faux Wood Blinds | Custom Blinds in Orange County",
  description: "Genuine wood and faux wood blinds for Orange County homes — natural warmth, premium finishes, lasting durability.",
  nav: "Products",
  h1: "Wood Blinds",
  sections: [
    {
      type: "text",
      body: ["Genuine Woods are made from Oak, Cherry and Pine and offer your home natural warmth. Complementing the styling of any room, these premium hardwood blinds feature an exclusive finish that provides longstanding protection against everyday wear."],
    },
    { type: "cta", heading: "Don't wait! Call us today!", body: [BUSINESS.phone] },
  ],
});

PAGES.push({
  path: "/hunter-douglas-shades-blinds/drapery-top-treatments",
  title: "Drapery and Top Treatments | On-Site Custom Drapes & Blinds",
  description: "Full-length drapery panels and top treatments — pleated, shirred, tabbed and grommeted headers in formal and casual styles.",
  nav: "Products",
  h1: "Drapery Panels",
  sections: [
    {
      type: "text",
      body: ["Full length drapery panels add insulation, texture, color and dimension. The variety of styles available is defined mainly by the type of header the panel has."],
    },
    {
      type: "text",
      heading: "Header Types",
      body: ["The header is the top of the drapery panel and the way in which the fabric is gathered for fullness. The header can be pleated, shirred, tabbed or grommeted."],
    },
    {
      type: "text",
      heading: "Pleat Types",
      body: ["Pleat types include pinch pleats, goblet pleats, french pleats and inverted pleats. Pleats add formality to the drapery because it gathers the fabric uniformly across the width of the panel."],
    },
    {
      type: "text",
      heading: "Ripplefold Drapery System",
      body: ["Soft ripple-like folds flow smoothly from one end of the track to the other. The system features master carriers that eliminate flat areas — folds are identically beautiful from inside the room or outside the building, presenting an architectural advantage."],
    },
    {
      type: "text",
      heading: "Formal & Casual Styles",
      body: [
        "Fabrics such as damask, silk and tapestry create a formal feel. These are typically lined and sometimes interlined to add weight and protection to the fabrics.",
        "Tabbed or shirred panels have a soft fullness with less uniformity than pleated panels. Grommet panels also provide a modern trend in less formal styling. Panels can be suspended via various methods including shirred on a rod or hung from drapery pins that attach to the rod or rings on the rod.",
      ],
    },
  ],
});

PAGES.push({
  path: "/hunter-douglas-shades-blinds/roller-roman-shades",
  title: "Roller & Roman Shades | Custom Drapes & Blinds in Orange County",
  description: "Roller, solar, designer banded, and Roman shades — clean lines, contemporary sophistication, and precise light control.",
  nav: "Products",
  h1: "Roller & Roman Shades",
  sections: [
    {
      type: "text",
      heading: "Roller — Solar Shades",
      body: ["Roller shades exude contemporary sophistication with their clean lines and simple design. They offer extensive customization with numerous colors and fabrics. These shades are user-friendly, cost-effective, and provide various light-filtering capabilities. Motorization options allow remote control operation. Decorative enhancements like valances and cornices enable personalized window styling."],
    },
    {
      type: "text",
      heading: "Designer Banded Shades — Modern Style with Superior Light Control",
      body: ["Designer Banded Shades combine sleek aesthetics with adjustable layered bands for precise control over light and privacy. Over 90 fabric options are available with varied colors, textures, and patterns. These come in medium or large band heights with fabric-covered headrails. Operation options include PowerView® Automation, beaded loops, UltraGlide® retractable wands, or SoftTouch® motorized wands."],
    },
    {
      type: "text",
      heading: "Roman Shades",
      body: ["Clean lines and classic tailoring have made Roman Shades a popular choice among interior designers and home owners alike. They serve privacy, light control, and decorative purposes and can include trim embellishments."],
    },
    {
      type: "checklist",
      heading: "Three Roman Shade Styles",
      items: [
        "Flat Roman Shades: Handcrafted with neat bottom folds for modern elegance",
        "Balloon: Creates soft to dramatic effects for added flair",
        "Shirred: Formal styles providing fullness and dimension, best with sheer fabrics",
      ],
    },
  ],
});

PAGES.push({
  path: "/hunter-douglas-shades-blinds/woven-wood-bamboo",
  title: "Woven Woods and Bamboo Shades | On-Site Custom Drapes & Blinds",
  description: "Hand-woven natural material shades — uniquely textured, versatile, and perfect for a casual lifestyle.",
  nav: "Products",
  h1: "Woven Woods and Bamboo Shades",
  sections: [
    {
      type: "text",
      body: ["With unmatched style, selection and craftsmanship, Woven Wood Shades are perfect for today's casual lifestyle. Hand woven from all natural materials, these shades are uniquely textured and incredibly versatile. With the newest colors and weaves, you can bring the latest fashion to any room."],
    },
    { type: "cta", heading: "Don't wait! Call us today!", body: [BUSINESS.phone] },
  ],
});

// ================= CLEANING =================
PAGES.push({
  path: "/hunter-douglas-blind-cleaning",
  title: "Hunter Douglas Cleaning | On-Site Custom Drapes & Blinds",
  description: "Professional blind and drapery cleaning services in Orange County using the injection/extraction method. 20+ years of experience.",
  nav: "Cleaning",
  h1: "Orange County's Trusted Drapery & Blind Cleaning Experts",
  sections: [
    {
      type: "text",
      heading: "Professional Blind & Drapery Cleaning Services in Orange County",
      body: ["At On-Site Custom Drapes & Blinds, we specialize in professional blind and drapery cleaning services in Orange County, ensuring your window treatments stay pristine, dust-free, and well-maintained. We serve residents in Newport Beach, Laguna Beach, Irvine, and surrounding areas with both on-site and in-shop cleaning options."],
    },
    {
      type: "checklist",
      heading: "Expert Blind & Drapery Cleaning Services",
      items: [
        "Fabric-safe dry and wet cleaning methods",
        "On-site cleaning without removal",
        "Take-down and re-hanging services for deep cleaning",
        "Cleaning for Sheer Shades & Silhouettes, Roman Shades, and more",
      ],
    },
    {
      type: "checklist",
      heading: "Why Choose On-Site Custom Drapes & Blinds?",
      items: [
        "20+ years of experience in Orange County blind & drapery cleaning",
        "Certified Hunter Douglas blind cleaning specialists",
        "Eco-friendly cleaning methods safe for fabrics and the environment",
        "Convenient on-site cleaning with no downtime",
      ],
    },
    { type: "cta", heading: "Ready to restore your window treatments?", body: ["Contact us for a free consultation."] },
    {
      // "Cleaning Quick Form" — see wix-forms-notification-fix.md. Distinct from the
      // full Contact Us form; a submission here specifically signals cleaning intent.
      type: "quickForm",
      heading: "Get a Free Quote",
      intro: "Enter your information below for a free quote today!",
    },
    crossLink("Check out our products page:", PRODUCT_LINKS),
  ],
});

PAGES.push({
  path: "/hunter-douglas-blind-cleaning/orange-county",
  title: "Blind Cleaning Services | Hunter Douglas & All Brands in Orange County",
  description: "Hunter Douglas certified blind cleaning in Orange County using the injection/extraction method — free on-site consultation.",
  nav: "Cleaning",
  h1: "Blind Cleaning Services | Hunter Douglas & All Brands",
  sections: [
    {
      type: "text",
      body: [
        "For over 20 years, On-Site Custom Drapes & Blinds has been the trusted expert for Hunter Douglas blind cleaning and all other window treatments in Orange County. We understand the investment you've made in choosing the perfect blinds for your home, and we're here to keep them looking their best.",
        "Our cleaning process begins with a free, no-obligation, on-site consultation to assess the condition of your Hunter Douglas blinds or other window treatments. We'll provide a comprehensive cost estimate based on a thorough pre-inspection.",
        "We use the injection/extraction method for cleaning, ensuring the deepest clean possible. Our method is gentle yet effective, protecting even the most delicate window treatments. For treatments that require special care, we provide hand cleaning to prevent any damage.",
        "We offer on-site cleaning for all window treatments, including Hunter Douglas blinds, so there's no need to remove your treatments from the window. For customers undergoing home renovations, we provide a take down, clean, store, and re-hang service to ensure your blinds stay in top condition.",
        "As Certified Fabricare Specialists, we are proud to be highly recommended by Hunter Douglas for the cleaning of their blinds.",
      ],
    },
    {
      type: "text",
      heading: "Drapery, Blinds & Motorization Repair",
      body: ["At On-Site Specialists, we provide professional repair and parts replacement for all types of drapery, blinds, and motorized window treatments. Whether it's broken cords, malfunctioning motors, or damaged hardware, our skilled technicians can restore your window treatments to perfect working condition."],
    },
    {
      type: "checklist",
      items: [
        "Blind & Drapery Repairs – Restringing, re-cording, and hardware replacement",
        "Motorization Repairs – Troubleshooting and fixing motorized systems, including PowerView® Automation",
        "Parts Replacement – Tracks, brackets, wands, remotes, and more",
      ],
    },
    {
      type: "checklist",
      heading: "We Offer Cleaning Options For All Types",
      items: ["Silhouettes and Luminettes", "Cellular Shades", "Honeycomb and Duette shades", "Roller and Roman shades", "Horizontal and vertical blinds", "All fabric blinds or shades"],
    },
    { type: "cta", heading: "Call today for our Spring Cleaning Specials!", body: [BUSINESS.phone] },
  ],
});

PAGES.push({
  path: "/hunter-douglas-blind-cleaning/drapery-orange-county",
  title: "Drapery Cleaning Services | Expert Care in Orange County",
  description: "Eco-friendly drapery cleaning in Orange County using the injection/extraction method — free consultation, no shrinkage or damage.",
  nav: "Cleaning",
  h1: "Drapery Cleaning Services",
  sections: [
    {
      type: "text",
      body: [
        "On-Site Custom Drapes & Blinds offers the finest drapery cleaning services for both residential and commercial properties in Orange County. With over 20 years of experience, we are among the most trusted and experienced drapery cleaners in the region. Our pricing is competitive, and we ensure a prompt turn-around time for all drapery cleaning services. We only use eco-friendly solvents to clean your window treatments, so your home and business remain safe and environmentally conscious.",
        "Our cleaning process starts with a free, no-obligation, on-site consultation to assess the condition of your drapes and provide a cost estimate. We use the injection/extraction method, which allows us to clean your drapes on-site, preventing shrinkage and damage while ensuring no downtime. Delicate drapery treatments that could otherwise be damaged by ordinary cleaning services are carefully hand-treated by our experienced technicians. Our team is fully certified, and we are bonded and insured, ensuring peace of mind for every customer.",
        "We also provide a take-down, storage, and re-hanging service, ideal for homeowners undergoing renovations or requiring temporary storage.",
      ],
    },
    {
      type: "text",
      heading: "Allergy Alert: Clean Your Blinds & Drapes for Better Air Quality",
      body: ["Many allergy symptoms—such as skin irritation, eye discomfort, and respiratory issues—are triggered by harmful dust mites and other allergens. These microscopic organisms thrive in areas of high humidity, making your blinds and drapes a prime location for allergen build-up. On-Site Custom Drapes & Blinds' specialized cleaning process is designed to remove dust mites and other harmful allergens from your drapes and blinds, creating a healthier living environment for you and your family."],
    },
    { type: "cta", heading: "Call today for our Spring Cleaning Specials!", body: [BUSINESS.phone] },
  ],
});

// ================= SERVICE AREAS =================
PAGES.push({
  path: "/service-areas",
  title: "Service Areas | On-Site Custom Drapes & Blinds",
  description: "On-Site Custom Drapes & Blinds proudly serves Orange County, San Diego, and Los Angeles, including Newport Beach, Huntington Beach, Laguna Beach, and Irvine.",
  nav: "Service Areas",
  h1: "Our Service Areas — Custom Window Treatments & Blinds",
  sections: [
    {
      type: "text",
      body: ["At On-Site Custom Drapes & Blinds, we proudly serve homeowners across Orange County, San Diego, and Los Angeles with custom window treatments, including blinds, shades, shutters, and drapery. We offer motorized smart shades, plantation shutters, and elegant drapery with expert design consultation and professional installation services. We provide custom window treatment services in many cities across Southern California — if you don't see your specific city listed, contact us!"],
    },
    {
      type: "linkgrid",
      heading: "Featured Service Areas",
      items: [
        { label: "Newport Beach", href: "/service-areas/window-treatments-newport-beach" },
        { label: "Huntington Beach", href: "/service-areas/window-treatments-huntington-beach" },
        { label: "Laguna Beach", href: "/service-areas/window-treatments-laguna-beach" },
        { label: "Irvine", href: "/service-areas/drapes-and-blinds-irvine" },
      ],
    },
    crossLink("Check out our products page:", PRODUCT_LINKS),
    crossLink("Check out our cleaning services:", CLEANING_LINKS),
    crossLink("Check out our blog for inspiration:", BLOG_LINKS),
  ],
});

function cityHub(city, path, intro, neighborhoods, subs) {
  PAGES.push({
    path,
    // Live tab title for these hub pages is the short "<City> | On-Site Custom Drapes
    // & Blinds" form (confirmed directly for Newport Beach 2026-08-06) — kept distinct
    // from the longer, more descriptive <h1>, which is normal/intentional SEO practice.
    title: `${city} | On-Site Custom Drapes & Blinds`,
    description: `Custom window treatments in ${city} — blinds, shades, shutters, drapery, and motorized smart shades. Free in-home consultation.`,
    nav: "Service Areas",
    h1: `Window Treatments & Blinds in ${city} | Custom Shades & Shutters`,
    sections: [
      { type: "text", body: [intro] },
      { type: "pins", heading: `Neighborhoods We Serve in ${city}`, items: neighborhoods },
      {
        type: "linkgrid",
        heading: `Check out our services in ${city}`,
        items: subs,
      },
      crossLink(
        "Check out our other service areas:",
        SERVICE_AREA_LINKS.filter((l) => l.label !== city)
      ),
    ],
  });
}

cityHub(
  "Newport Beach",
  "/service-areas/window-treatments-newport-beach",
  "At On-Site Custom Drapes & Blinds, we specialize in premium window treatments in Newport Beach, offering custom blinds, shades, shutters, and motorized smart shades to complement your home's style. Whether you're looking for light-filtering shades, energy-efficient blinds, or luxury window coverings, our team provides expert design consultation, top-quality products, and professional installation. We proudly serve homeowners throughout Newport Beach, Balboa Island, Corona Del Mar, Crystal Cove, and the surrounding coastal communities.",
  ["Corona Del Mar", "Balboa Island & Balboa Peninsula", "Crystal Cove & Newport Coast", "East Bluff & Lido Isle", "Back Bay & Mariners Mile"],
  [
    { label: "Custom Window Treatments", href: "/service-areas/window-treatments-newport-beach/custom-treatments" },
    { label: "Hunter Douglas Window Treatments", href: "/service-areas/window-treatments-newport-beach/hunter-douglas" },
    { label: "Window Shades & Blinds", href: "/service-areas/window-treatments-newport-beach/shades-and-blinds" },
    { label: "Motorized Blinds & Smart Shades", href: "/service-areas/window-treatments-newport-beach/motorized-blinds" },
  ]
);

cityHub(
  "Huntington Beach",
  "/service-areas/window-treatments-huntington-beach",
  "At On-Site Custom Drapes & Blinds, we offer custom window treatments in Huntington Beach, providing high-quality blinds, shades, shutters, and motorized smart shades tailored to enhance your home's aesthetic and functionality. We serve homeowners throughout Huntington Beach, Sunset Beach, Bolsa Chica, Downtown Huntington Beach, and surrounding areas.",
  ["Sunset Beach & Bolsa Chica", "Downtown Huntington Beach & Pacific City", "Huntington Harbour & Seacliff", "Goldenwest & Edwards Hill"],
  [
    { label: "Custom Window Treatments", href: "/service-areas/window-treatments-huntington-beach/blinds-shades" },
    { label: "Hunter Douglas Window Treatments", href: "/service-areas/window-treatments-huntington-beach/hunter-douglas-treatments" },
    { label: "Window Shades & Blinds", href: "/service-areas/window-treatments-huntington-beach/shades-blinds" },
    { label: "Motorized Blinds & Smart Shades", href: "/service-areas/window-treatments-huntington-beach/motorized-smart-shades" },
  ]
);

cityHub(
  "Laguna Beach",
  "/service-areas/window-treatments-laguna-beach",
  "At On-Site Custom Drapes & Blinds, we provide premium window treatments in Laguna Beach, including custom blinds, shades, shutters, and motorized smart shades. Whether you're updating your coastal home with elegant window coverings or need energy-efficient shades, our expert team offers personalized consultations, high-quality products, and professional installation. We proudly serve homeowners across Laguna Beach, Emerald Bay, Three Arch Bay, Victoria Beach, and surrounding areas.",
  ["Crystal Cove & Emerald Bay", "Three Arch Bay & Bluebird Canyon", "Top of the World & Victoria Beach", "South Laguna & Laguna Canyon"],
  [
    { label: "Custom Window Treatments", href: "/service-areas/window-treatments-laguna-beach/custom-blinds-drapes" },
    { label: "Hunter Douglas Window Treatments", href: "/service-areas/window-treatments-laguna-beach/hunter-douglas-shades" },
    { label: "Window Shades & Blinds", href: "/service-areas/window-treatments-laguna-beach/custom-shades-blinds" },
    { label: "Motorized Blinds & Smart Shades", href: "/service-areas/window-treatments-laguna-beach/blinds-motorized" },
  ]
);

cityHub(
  "Irvine",
  "/service-areas/drapes-and-blinds-irvine",
  "At On-Site Custom Drapes & Blinds, we offer custom window treatments in Irvine, providing high-quality blinds, shades, shutters, and motorized smart shades tailored to enhance your home. Whether you're looking for energy-efficient shades, luxury window coverings, or smart home-integrated blinds, our team delivers expert design consultations, top-tier products, and professional installation. We proudly serve homeowners throughout Irvine, Northwood, Turtle Rock, University Park, Woodbridge, and surrounding communities.",
  ["Northwood & Northpark", "Turtle Rock & University Park", "Woodbridge & Westpark", "Portola Springs & Quail Hill"],
  [
    { label: "Custom Window Treatments", href: "/service-areas/drapes-and-blinds-irvine/custom-window-treatments" },
    { label: "Hunter Douglas Blinds", href: "/service-areas/drapes-and-blinds-irvine/hunter-douglas-blinds" },
    { label: "Window Shades & Blinds", href: "/service-areas/drapes-and-blinds-irvine/custom-shades" },
    { label: "Motorized Blinds & Smart Shades", href: "/service-areas/drapes-and-blinds-irvine/smart-shades" },
  ]
);

// City x category detail pages
function cityDetail(city, path, kind, title, intro, whyItems, selectionIntro, selectionItems, neighborhoods) {
  PAGES.push({
    path,
    title,
    description: `${kind} in ${city} — free in-home consultation with On-Site Custom Drapes & Blinds.`,
    nav: "Service Areas",
    h1: title.split(" | ")[0],
    sections: [
      { type: "text", body: [intro] },
      { type: "checklist", heading: `Why Choose ${kind}?`, items: whyItems },
      { type: "checklist", heading: `Our Selection of ${kind} in ${city}`, intro: selectionIntro, items: selectionItems },
      { type: "pins", heading: `Proudly Serving ${city} & Nearby Areas`, items: neighborhoods },
      { type: "cta", heading: `Schedule Your Free Consultation for ${kind} in ${city}`, body: [`Call ${BUSINESS.phone} or Request a Quote Online!`] },
    ],
  });
}

// Newport Beach details
cityDetail(
  "Newport Beach", "/service-areas/window-treatments-newport-beach/hunter-douglas", "Hunter Douglas Window Treatments",
  "Hunter Douglas Window Treatments in Newport Beach",
  "Looking for high-end Hunter Douglas window treatments in Newport Beach? At On-Site Custom Drapes & Blinds, we offer the full selection of Hunter Douglas blinds, shades, shutters, and drapery to elevate your home's style and functionality.",
  ["Custom Fit & High-End Style – Tailored window treatments designed to complement any home aesthetic.", "Energy Efficiency – Cellular shades and insulating designs help regulate indoor temperatures.", "Motorized & Smart Home Integration – Control your shades with PowerView® Automation, Alexa, and Google Home.", "Superior Light & Privacy Control – Innovative designs like Silhouette® and Luminette® shades provide perfect light filtering.", "Durability & Warranty – Backed by the Hunter Douglas Lifetime Limited Warranty."],
  null,
  ["Hunter Douglas Blinds: Wood, faux wood, and metal blinds with superior craftsmanship.", "Hunter Douglas Shades: Roller shades, Roman shades, and cellular shades for light control and insulation.", "Hunter Douglas Shutters: Classic plantation shutters with premium hardwood or Polysatin™ finishes.", "Hunter Douglas Smart Shades: Motorized window treatments powered by PowerView® Automation."],
  ["Corona Del Mar & Balboa Island", "Crystal Cove & Newport Coast", "East Bluff & Lido Isle", "Back Bay & Mariners Mile"]
);
cityDetail(
  "Newport Beach", "/service-areas/window-treatments-newport-beach/motorized-blinds", "Motorized Blinds & Smart Shades",
  "Motorized Blinds & Smart Shades in Newport Beach",
  "Looking for high-tech motorized blinds & smart shades in Newport Beach? At On-Site Custom Drapes & Blinds, we specialize in state-of-the-art automated window treatments that combine style, convenience, and energy efficiency.",
  ["Effortless Operation – Open and close your window coverings with the touch of a button or voice command.", "Smart Home Integration – Compatible with Alexa, Google Home, and Apple HomeKit for seamless automation.", "Energy Efficiency – Schedule your shades to adjust based on sunlight, reducing heat and saving on energy bills.", "Enhanced Privacy & Security – Set timers for blinds to open and close automatically, even when you're away.", "Customizable Designs – Available in roller shades, Roman shades, wood blinds, and more to match any home style."],
  null,
  ["Motorized Roller Shades – Sleek, modern, and available in light-filtering and blackout options.", "Remote-Controlled Blinds – Wood, faux wood, or aluminum blinds that adjust with a simple remote.", "Smart Home-Compatible Shades – Integrate with Amazon Alexa, Google Assistant, and Apple HomeKit.", "PowerView® Automation by Hunter Douglas – Advanced motorization that syncs with your home automation system."],
  ["Corona Del Mar & Balboa Island", "Crystal Cove & Newport Coast", "East Bluff & Lido Isle", "Back Bay & Mariners Mile"]
);
cityDetail(
  "Newport Beach", "/service-areas/window-treatments-newport-beach/shades-and-blinds", "Window Shades & Blinds",
  "Window Shades & Blinds in Newport Beach",
  "Looking for high-quality window shades & blinds in Newport Beach? At On-Site Custom Drapes & Blinds, we offer a wide selection of custom window coverings designed to enhance your home's style, privacy, and energy efficiency.",
  ["Custom Designs – Find the perfect match for your interior with our modern, classic, and luxury window coverings.", "Light Control & Privacy – Choose from room-darkening, light-filtering, and blackout options.", "Energy-Efficient Window Coverings – Reduce heat and glare with solar and cellular shades.", "Motorized & Smart Options – Upgrade your home with automated shades and blinds that integrate with Alexa & Google Home.", "Professional Installation – We ensure a precise fit and expert setup for long-lasting results."],
  null,
  ["Custom Window Shades: Roller shades, Roman shades, cellular shades, and woven wood shades.", "Classic & Modern Blinds: Wood blinds, faux wood blinds, vertical blinds, and aluminum blinds.", "Motorized & Smart Shades: Control your window coverings with a remote, mobile app, or smart home system.", "Solar & Blackout Shades: Reduce glare, enhance privacy, and improve energy efficiency."],
  ["Corona Del Mar & Balboa Island", "Crystal Cove & Newport Coast", "East Bluff & Lido Isle", "Back Bay & Mariners Mile"]
);
cityDetail(
  "Newport Beach", "/service-areas/window-treatments-newport-beach/custom-treatments", "Custom Window Treatments",
  "Custom Window Treatments in Newport Beach — Stylish & Functional Designs",
  "Looking for high-quality custom window treatments in Newport Beach? At On-Site Custom Drapes & Blinds, we specialize in premium blinds, shades, shutters, and drapery designed to complement your home's style.",
  ["Premium Selection – Choose from luxury blinds, Roman shades, roller shades, and custom drapery.", "Expert Design Consultation – We help you find the perfect window treatments for your home's aesthetic.", "Professional Installation – Our Newport Beach team ensures a seamless, custom fit for every window.", "Motorized & Smart Home Options – Upgrade your home with smart shades compatible with Alexa & Google Home.", "Locally Owned & Operated – Serving Newport Beach, Corona Del Mar, and surrounding coastal neighborhoods."],
  null,
  [],
  ["Corona Del Mar", "Balboa Island & Balboa Peninsula", "Crystal Cove & Newport Coast", "East Bluff & The Bluffs"]
);

// Huntington Beach details
cityDetail(
  "Huntington Beach", "/service-areas/window-treatments-huntington-beach/hunter-douglas-treatments", "Hunter Douglas Window Treatments",
  "Luxury Hunter Douglas Window Treatments for Huntington Beach Homes",
  "Looking for high-end Hunter Douglas window treatments in Huntington Beach? At On-Site Custom Drapes & Blinds, we provide the full selection of Hunter Douglas blinds, shades, shutters, and drapery to enhance your home's beauty and functionality.",
  ["Custom Fit & Elegant Style – Perfectly designed to enhance your home's interior.", "Energy Efficiency – Cellular shades help insulate your home and lower energy costs.", "Smart Home Integration – Enjoy effortless control with PowerView® Automation, Alexa, and Google Home.", "Superior Light & Privacy Control – Choose from Silhouette® and Luminette® shades for customizable light filtering.", "Durability & Warranty – Backed by the Hunter Douglas Lifetime Limited Warranty."],
  null,
  ["Hunter Douglas Blinds: Stylish wood, faux wood, and metal blinds.", "Hunter Douglas Shades: Roller shades, Roman shades, and energy-efficient cellular shades.", "Hunter Douglas Shutters: Premium plantation shutters in hardwood or Polysatin™ finishes.", "Hunter Douglas Smart Shades: Motorized window treatments with PowerView® Automation for remote and voice control."],
  ["Sunset Beach & Bolsa Chica", "Downtown Huntington Beach & Pacific City", "Huntington Harbour & Seacliff", "Goldenwest & Edwards Hill"]
);
cityDetail(
  "Huntington Beach", "/service-areas/window-treatments-huntington-beach/shades-blinds", "Custom Window Treatments",
  "Enhance Your Huntington Beach Home with Custom Window Treatments",
  "Looking for premium custom window treatments in Huntington Beach? At On-Site Custom Drapes & Blinds, we specialize in high-quality blinds, shades, shutters, and drapery designed to complement your home's style.",
  ["Premium Selection – Custom blinds, roller shades, Roman shades, and luxury drapery", "Expert Design Consultation – Specialists help choose treatments for décor and function", "Professional Installation – Seamless, custom fit for every window", "Motorized & Smart Shades – Upgrade with smart home-integrated shades for ultimate convenience", "Locally Owned & Trusted – Serves Huntington Beach, Sunset Beach, Bolsa Chica, and surrounding communities"],
  "Huntington Beach homeowners appreciate stylish, energy-efficient, and durable window treatments that offer privacy, light control, and coastal protection.",
  ["Custom blinds (wood, faux wood, vertical, aluminum)", "Luxury shades (Roman, roller, cellular, woven wood)", "Plantation shutters", "Motorized smart shades"],
  ["Sunset Beach", "Bolsa Chica", "Downtown Huntington Beach", "Surrounding communities"]
);
cityDetail(
  "Huntington Beach", "/service-areas/window-treatments-huntington-beach/blinds-shades", "Window Shades & Blinds",
  "Custom Window Shades & Blinds for Huntington Beach Homes",
  "Looking for high-quality window shades & blinds in Huntington Beach? At On-Site Custom Drapes & Blinds, we offer a premium selection of custom window coverings designed for coastal homes, modern interiors, and functional spaces.",
  ["Coastal-Ready Designs – Fade-resistant, moisture-resistant, and energy-efficient window coverings ideal for beachfront homes.", "Superior Light & Privacy Control – Options include room-darkening, light-filtering, and blackout shades.", "Energy-Efficient Window Coverings – Reduce heat and glare while protecting interiors with solar and cellular shades.", "Smart & Motorized Options – Automated window treatments that integrate with Alexa & Google Home.", "Professional Installation – A perfect fit and seamless installation for long-lasting beauty and function."],
  null,
  ["Custom Window Shades: Roller shades, Roman shades, cellular shades, and woven wood shades.", "Classic & Modern Blinds: Wood blinds, faux wood blinds, vertical blinds, and aluminum blinds.", "Motorized & Smart Shades: Control your shades with a remote, mobile app, or smart home system.", "Solar & Blackout Shades: Reduce glare, increase privacy, and improve energy efficiency."],
  ["Sunset Beach & Bolsa Chica", "Downtown Huntington Beach & Pacific City", "Huntington Harbour & Seacliff", "Goldenwest & Edwards Hill"]
);
cityDetail(
  "Huntington Beach", "/service-areas/window-treatments-huntington-beach/motorized-smart-shades", "Motorized Blinds & Smart Shades",
  "Upgrade Your Huntington Beach Home with Motorized Blinds & Smart Shades",
  "Looking for motorized blinds & smart shades in Huntington Beach? At On-Site Custom Drapes & Blinds, we specialize in automated window treatments that provide luxury, convenience, and energy efficiency.",
  ["Seamless Operation – Control window coverings with a remote, mobile app, or voice assistant.", "Smart Home Integration – Works with Alexa, Google Home, and Apple HomeKit.", "Energy Efficiency – Schedule blinds and shades to adjust automatically for heat and glare control.", "Privacy & Security – Set timers for shades to move even when you're not home.", "Stylish & Customizable – Available in roller shades, Roman shades, wood blinds, and matching options."],
  null,
  ["Motorized Roller Shades – Sleek and modern with light-filtering and blackout options.", "Remote-Controlled Blinds – Available in wood, faux wood, and aluminum finishes.", "Smart Home-Compatible Shades – Integrate with Amazon Alexa, Google Assistant, and Apple HomeKit.", "PowerView® Automation by Hunter Douglas – Advanced motorization for custom scheduling and effortless operation."],
  ["Sunset Beach & Bolsa Chica", "Downtown Huntington Beach & Pacific City", "Huntington Harbour & Seacliff", "Goldenwest & Edwards Hill"]
);

// Laguna Beach details
cityDetail(
  "Laguna Beach", "/service-areas/window-treatments-laguna-beach/hunter-douglas-shades", "Hunter Douglas Window Treatments",
  "Luxury Hunter Douglas Window Treatments for Laguna Beach Homes",
  "Looking for high-end Hunter Douglas window treatments in Laguna Beach? At On-Site Custom Drapes & Blinds, we offer the full collection of Hunter Douglas blinds, shades, shutters, and drapery to complement your coastal home.",
  ["Custom Fit & High-End Style – Tailored window treatments designed to complement any home aesthetic.", "Energy Efficiency – Cellular shades and insulating designs help regulate indoor temperatures.", "Motorized & Smart Home Integration – Control your shades with PowerView® Automation, Alexa, and Google Home.", "Superior Light & Privacy Control – Innovative designs like Silhouette® and Luminette® shades provide perfect light filtering.", "Durability & Warranty – Backed by the Hunter Douglas Lifetime Limited Warranty."],
  null,
  ["Real wood and faux wood blinds", "Roller shades and Roman shades", "Plantation shutters in hardwood or Polysatin™ finishes", "Motorized options powered by PowerView® Automation"],
  ["Crystal Cove & Emerald Bay", "Three Arch Bay & Bluebird Canyon", "Top of the World & Victoria Beach", "South Laguna & Laguna Canyon"]
);
cityDetail(
  "Laguna Beach", "/service-areas/window-treatments-laguna-beach/custom-blinds-drapes", "Custom Window Treatments",
  "Elevate Your Laguna Beach Home with Custom Window Treatments",
  "Looking for high-end custom window treatments in Laguna Beach? At On-Site Custom Drapes & Blinds, we offer premium blinds, shades, shutters, and drapery that perfectly complement your coastal home.",
  ["Luxury Selection – Custom blinds, Roman shades, roller shades, and drapery designed to enhance your space.", "Expert Design Consultation – Specialists help you select the best window treatments for your Laguna Beach home.", "Professional Installation – Precise measurements and expert installation ensure a perfect fit.", "Motorized & Smart Shades – Integrate smart window treatments with Alexa, Google Home, or remote controls.", "Locally Owned & Trusted – Serving Laguna Beach, Crystal Cove, Three Arch Bay, and surrounding coastal areas."],
  null,
  [],
  ["Crystal Cove & Emerald Bay", "Three Arch Bay & Bluebird Canyon", "Top of the World & Victoria Beach", "South Laguna & Laguna Canyon"]
);
cityDetail(
  "Laguna Beach", "/service-areas/window-treatments-laguna-beach/blinds-motorized", "Motorized Blinds & Smart Shades",
  "Upgrade Your Laguna Beach Home with Motorized Blinds & Smart Shades",
  "Looking for motorized blinds & smart shades in Laguna Beach? At On-Site Custom Drapes & Blinds, we provide high-end automated window treatments that enhance convenience, energy efficiency, and coastal aesthetics.",
  ["Seamless Control – Operate your window coverings via remote, mobile app, or voice assistant.", "Smart Home Automation – Works with Alexa, Google Home, and Apple HomeKit for easy scheduling and adjustments.", "Energy Efficiency – Automated settings help control indoor temperatures and reduce energy costs.", "Privacy & Security – Set timers to adjust blinds automatically, even when you're away.", "Customizable Designs – Available in roller shades, Roman shades, wood blinds, and more to match your interior style."],
  null,
  ["Motorized roller shades with light-filtering and blackout options", "Remote-controlled blinds in various finishes", "Smart home-compatible shades", "PowerView® Automation by Hunter Douglas"],
  ["Crystal Cove", "Emerald Bay", "Three Arch Bay", "Bluebird Canyon", "Top of the World", "Victoria Beach", "South Laguna", "Laguna Canyon"]
);
cityDetail(
  "Laguna Beach", "/service-areas/window-treatments-laguna-beach/custom-shades-blinds", "Window Shades & Blinds",
  "Custom Window Shades & Blinds for Laguna Beach Homes",
  "Looking for high-quality window shades & blinds in Laguna Beach? At On-Site Custom Drapes & Blinds, we offer a premium selection of custom window coverings designed for coastal homes, modern interiors, and luxury spaces.",
  ["Coastal-Ready Designs – Fade-resistant, moisture-resistant, and energy-efficient window coverings ideal for beachfront homes.", "Superior Light & Privacy Control – Options include room-darkening, light-filtering, and blackout shades.", "Energy-Efficient Window Coverings – Reduce heat and glare while protecting interiors with solar and cellular shades.", "Smart & Motorized Options – Automated window treatments that integrate with Alexa & Google Home.", "Professional Installation – A perfect fit and seamless installation for long-lasting beauty and function."],
  null,
  ["Custom Window Shades: Roller shades, Roman shades, cellular shades, and woven wood shades.", "Classic & Modern Blinds: Wood blinds, faux wood blinds, vertical blinds, and aluminum blinds.", "Motorized & Smart Shades: Control your shades with a remote, mobile app, or smart home system.", "Solar & Blackout Shades: Reduce glare, increase privacy, and improve energy efficiency."],
  ["Crystal Cove & Emerald Bay", "Three Arch Bay & Bluebird Canyon", "Top of the World & Victoria Beach", "South Laguna & Laguna Canyon"]
);

// Irvine details
cityDetail(
  "Irvine", "/service-areas/drapes-and-blinds-irvine/hunter-douglas-blinds", "Hunter Douglas Window Treatments",
  "Premium Hunter Douglas Window Treatments for Irvine Homes",
  "Looking for high-end Hunter Douglas window treatments in Irvine? At On-Site Custom Drapes & Blinds, we provide the full range of Hunter Douglas blinds, shades, shutters, and drapery designed to enhance your home's style and functionality.",
  ["Custom Fit & High-End Style – Tailored window treatments designed to complement any home aesthetic.", "Energy Efficiency – Cellular shades and insulating designs help regulate indoor temperatures.", "Motorized & Smart Home Integration – Control your shades with PowerView® Automation, Alexa, and Google Home.", "Superior Light & Privacy Control – Innovative designs like Silhouette® and Luminette® shades provide perfect light filtering.", "Durability & Warranty – Backed by the Hunter Douglas Lifetime Limited Warranty."],
  null,
  ["Hunter Douglas Blinds: Elegant wood, faux wood, and metal blinds built for longevity.", "Hunter Douglas Shades: Roller shades, Roman shades, and cellular shades for enhanced insulation.", "Hunter Douglas Shutters: Classic plantation shutters with premium hardwood or Polysatin™ finishes.", "Hunter Douglas Smart Shades: Motorized shades powered by PowerView® Automation for seamless home integration."],
  ["Northwood & Northpark", "Turtle Rock & University Park", "Woodbridge & Westpark", "Portola Springs & Quail Hill"]
);
cityDetail(
  "Irvine", "/service-areas/drapes-and-blinds-irvine/custom-shades", "Custom Window Treatments",
  "Transform Your Irvine Home with Custom Window Treatments",
  "Looking for high-quality custom window treatments in Irvine? At On-Site Custom Drapes & Blinds, we specialize in premium blinds, shades, shutters, and drapery tailored to enhance your home's beauty and functionality.",
  ["Wide Selection – Choose from custom blinds, Roman shades, roller shades, and drapery to match your style.", "Expert Design Consultation – We help you find the perfect window treatments for your home's decor.", "Professional Installation – Our Irvine team ensures a seamless, custom fit for every window.", "Motorized & Smart Home Options – Upgrade your home with smart shades that integrate with Alexa & Google Home.", "Locally Trusted & Operated – Serving Irvine, Northwood, Turtle Rock, Woodbridge, and nearby communities."],
  null,
  [],
  ["Northwood & Northpark", "Turtle Rock & University Park", "Woodbridge & Westpark", "Portola Springs & Quail Hill"]
);
cityDetail(
  "Irvine", "/service-areas/drapes-and-blinds-irvine/smart-shades", "Motorized Blinds & Smart Shades",
  "Motorized Blinds & Smart Shades in Irvine",
  "Looking for high-tech motorized blinds & smart shades in Irvine? At On-Site Custom Drapes & Blinds, we provide state-of-the-art automated window treatments that combine elegance, convenience, and energy efficiency.",
  ["Effortless Operation – Control your window coverings with a remote, mobile app, or voice commands.", "Smart Home Integration – Works with Alexa, Google Home, and Apple HomeKit for seamless automation.", "Energy Savings – Schedule shades to adjust based on sunlight, reducing heat and lowering utility costs.", "Increased Privacy & Security – Automate blinds to open and close, even when you're away from home.", "Custom Designs – Available in roller shades, Roman shades, wood blinds, and more to match any home aesthetic."],
  null,
  ["Motorized Roller Shades – Sleek, modern, and available in light-filtering and blackout options.", "Remote-Controlled Blinds – Elegant wood, faux wood, and aluminum blinds with seamless motorization.", "Smart Home-Compatible Shades – Integrate with Amazon Alexa, Google Assistant, and Apple HomeKit.", "PowerView® Automation by Hunter Douglas – Advanced automation for scheduling and remote operation."],
  ["Northwood & Northpark", "Turtle Rock & University Park", "Woodbridge & Westpark", "Portola Springs & Quail Hill"]
);
cityDetail(
  "Irvine", "/service-areas/drapes-and-blinds-irvine/custom-window-treatments", "Window Shades & Blinds",
  "Custom Window Shades & Blinds for Irvine Homes",
  "Looking for high-quality window shades & blinds in Irvine? At On-Site Custom Drapes & Blinds, we offer a wide selection of custom window coverings designed to provide privacy, light control, and energy efficiency.",
  ["Custom Styles for Every Home – Choose from modern, traditional, and high-end window coverings.", "Superior Light & Privacy Control – Options include room-darkening, light-filtering, and blackout shades.", "Energy-Efficient Window Coverings – Reduce heat and glare with solar and cellular shades.", "Smart & Motorized Options – Automated window treatments that integrate with Alexa & Google Home.", "Professional Installation – Expert setup for long-lasting results."],
  null,
  ["Custom window shades (roller, Roman, cellular, woven wood)", "Classic and modern blinds (wood, faux wood, vertical, aluminum)", "Motorized smart shades", "Solar/blackout options"],
  ["Northwood", "Northpark", "Turtle Rock", "University Park", "Woodbridge", "Westpark", "Portola Springs", "Quail Hill"]
);

// ================= BLOG =================
PAGES.push({
  path: "/window-treatment-blog-orange-county",
  title: "Blog | On-Site Custom Drapes & Blinds",
  description: "Tips and trends on window treatments, blinds, and drapery for Orange County, Irvine, Newport Beach, and Laguna Beach homeowners.",
  nav: "Blog",
  h1: "Our Blog",
  sections: [
    {
      type: "bloglist",
      items: [
        { title: "5 Things to Consider Before Buying New Blinds or Shades", date: "Mar 26, 2025", href: "/post/buying-new-blinds-or-shades-orange-county", excerpt: "Expert guidance on upgrading your window treatments, with five key tips for Orange County residents planning purchases." },
        { title: "How Often Should You Clean Hunter Douglas Blinds & Drapes?", date: "Mar 19, 2025", href: "/post/hunter-douglas-blind-cleaning-tips-orange-county", excerpt: "Blinds and drapery add style, privacy, and light control to any home, but over time they accumulate dust and allergens." },
        { title: "Why Newport Beach Homeowners Are Upgrading to Hunter Douglas Shades", date: "Mar 16, 2025", href: "/post/why-newport-beach-homeowners-are-upgrading-to-hunter-douglas-shades", excerpt: "Why luxury homeowners in Newport Beach are choosing Hunter Douglas products for their high-end interiors." },
        { title: "Trending Window Treatment Styles for 2025 | Orange County", date: "Feb 22, 2025", href: "/post/trending-window-treatment-styles-for-2025-orange-county", excerpt: "Current design trends including smart shades and custom drapery elevating Orange County homes." },
      ],
    },
  ],
});

PAGES.push({
  path: "/post/buying-new-blinds-or-shades-orange-county",
  title: "5 Things to Consider Before Buying New Blinds or Shades | On-Site",
  description: "Five key things to consider before buying new blinds or shades in Orange County — functionality, room type, automation, style, and installation.",
  nav: "Blog",
  h1: "5 Things to Consider Before Buying New Blinds or Shades",
  postMeta: { date: "Mar 26, 2025", readTime: "3 min" },
  sections: [
    { type: "text", body: ["Upgrading your window treatments is one of the easiest ways to transform the look and feel of your home. Whether you're renovating, moving into a new space, or simply replacing outdated blinds, choosing the right option requires more thought than you might expect.", "At On-Site Custom Drapes & Blinds, we help homeowners throughout Newport Beach, Laguna Beach, and greater Orange County make smart, stylish, and functional choices for their windows. Before you invest, here are five important things to consider when buying new blinds or shades."] },
    { type: "text", heading: "1. Start with Functionality", body: ["Before selecting a style or fabric, think about what you want your window treatments to do: privacy (especially for bedrooms and bathrooms), light control (ideal for media rooms or sunny living areas), energy efficiency (to reduce heat from afternoon sun), and UV protection for your furniture and floors. For ultimate versatility, consider Hunter Douglas Silhouette® or Pirouette® window shadings, which offer both light filtering and privacy in one elegant solution."] },
    { type: "text", heading: "2. Room Type — Match Form to Function", body: ["Different rooms have different needs. Kitchens and bathrooms benefit from moisture-resistant materials like faux wood blinds or roller shades, while living rooms or dining rooms may call for something more decorative like custom drapery or woven wood shades. If you're furnishing a coastal home in Newport Beach or Laguna Beach, consider UV-resistant, easy-to-clean options that stand up to salt air and humidity."] },
    { type: "text", heading: "3. Automation — Do You Want Smart Blinds?", body: ["Homeowners throughout Orange County are upgrading to motorized blinds and shades for the convenience and efficiency they provide. With Hunter Douglas PowerView® Automation, you can raise and lower your window treatments using an app, remote, or voice command — even while you're away. Motorized blinds are perfect for hard-to-reach windows, multi-level homes, and those looking to enhance their smart home experience."] },
    { type: "text", heading: "4. Style & Design — What Works with Your Home's Aesthetic?", body: ["Do you prefer a clean and modern look? Try roller shades or minimal wood blinds. Want a soft, coastal feel? Woven wood shades or layered sheer curtains might be the perfect fit. Our team can help you choose styles, fabrics, and colors that complement your home's existing design. Hunter Douglas offers over 90 fabric and color options to customize your look."] },
    { type: "text", heading: "5. Professional Measuring & Installation — Skip the DIY Hassle", body: ["Window treatments should look seamless — not slightly off-center or ill-fitting. At On-Site Custom Drapes & Blinds, we offer expert shop-at-home consultations, professional measuring, and certified installation to ensure your new blinds and shades fit perfectly and perform beautifully. From Newport Beach to Irvine, we make the process easy and tailored to you."] },
    { type: "text", heading: "The Bottom Line", body: ["Choosing new blinds or shades is more than just picking a color — it's about selecting window treatments that fit your lifestyle, your home, and your long-term needs. At On-Site Custom Drapes & Blinds, we guide you through every step of the process, from design to installation."] },
    { type: "cta", heading: "Ready to get started?", body: ["Contact us today to schedule your free consultation in Orange County!"] },
  ],
});

PAGES.push({
  path: "/post/hunter-douglas-blind-cleaning-tips-orange-county",
  title: "How Often Should You Clean Hunter Douglas Blinds & Drapes? | On-Site",
  description: "How often to clean Hunter Douglas blinds and drapes in Orange County's coastal climate, and the warning signs it's time for a professional cleaning.",
  nav: "Blog",
  h1: "How Often Should You Clean Hunter Douglas Blinds & Drapes?",
  postMeta: { date: "Mar 19, 2025", readTime: "3 min" },
  sections: [
    { type: "text", body: ["Blinds and drapery add style, privacy, and light control to any home, but over time, they can collect dust, allergens, and moisture, affecting their appearance and indoor air quality. If you live in coastal cities like Newport Beach or Laguna Beach, the increased humidity and salty air can cause faster buildup of grime, meaning your window treatments need more frequent care.", "So, how often should you clean your blinds and drapes? The answer depends on your home's location, environment, and the type of window treatments you have."] },
    { type: "checklist", heading: "Why Regular Cleaning Matters", items: ["Improves Indoor Air Quality – Removes allergens, pet dander, and dust mites.", "Extends the Life of Your Window Treatments – Prevents fabric damage, discoloration, and wear.", "Keeps Your Home Looking Fresh & Luxurious – No more dingy, dust-covered drapes!"] },
    { type: "text", heading: "Blinds & Shades (Hunter Douglas, Wood, Faux Wood, Woven, etc.)", body: ["Every 3-6 months: light dusting with a microfiber cloth or vacuuming. Every 12-24 months: professional deep cleaning for built-up dirt, grime, and salt exposure, especially for homes near the ocean. Motorized blinds and smart shades tend to collect less dust, but still benefit from an annual deep clean."] },
    { type: "text", heading: "Drapery & Sheers (Custom Drapes, Luminette® Privacy Sheers, etc.)", body: ["Every 6-12 months: light vacuuming or fabric-safe dusting. Every 18-36 months: professional cleaning for deep stains, odors, and allergens. Humidity and moisture cause drapery fabrics to absorb more dust and allergens than in drier areas — silk, linen, and custom fabrics require specialized cleaning to maintain their texture and color."] },
    { type: "checklist", heading: "Signs It's Time for a Professional Cleaning", items: ["Dust buildup is visible, even after wiping", "Fabric feels stiff, sticky, or has a musty odor", "Discoloration or stains from moisture, smoke, or cooking oils", "Increased allergy symptoms in your home"] },
    { type: "text", heading: "Professional Blind & Drapery Cleaning in Orange County", body: ["At On-Site Custom Drapes & Blinds, we specialize in expert cleaning for Hunter Douglas blinds, custom drapery, and sheer window treatments. Our on-site and in-shop cleaning services ensure your window treatments stay in pristine condition—without the risk of shrinkage or damage. Serving Newport Beach, Laguna Beach, Irvine, and surrounding areas."] },
    { type: "cta", heading: "Schedule Your Blind or Drapery Cleaning Today!", body: ["Contact us today for a free consultation! " + BUSINESS.phone] },
  ],
});

PAGES.push({
  path: "/post/why-newport-beach-homeowners-are-upgrading-to-hunter-douglas-shades",
  title: "Why Newport Beach Homeowners Are Upgrading to Hunter Douglas Shades",
  description: "Why Newport Beach homeowners are choosing Hunter Douglas shades — smart home integration, energy efficiency, and custom high-end looks.",
  nav: "Blog",
  h1: "Why Newport Beach Homeowners Are Upgrading to Hunter Douglas Shades",
  postMeta: { date: "Mar 16, 2025", readTime: "3 min" },
  sections: [
    { type: "text", body: ["Newport Beach is known for its luxury homes, stunning ocean views, and high-end interiors. From modern waterfront properties to elegant estates, homeowners here understand the value of design, comfort, and functionality. One of the most impactful upgrades in home design today? Custom window treatments—specifically, Hunter Douglas shades.", "As more homeowners in Newport Beach, Balboa Island, and Crystal Cove look for luxury window coverings, Hunter Douglas shades have become the go-to choice. With advanced motorization, energy efficiency, and sleek, customizable designs, these shades offer the perfect balance of style and innovation."] },
    { type: "text", heading: "Smart Home Integration & Effortless Control", body: ["Hunter Douglas PowerView® Automation allows homeowners to adjust their shades with the touch of a button, a voice command, or even on a set schedule. For Newport Beach residents, this means effortless light control, better security (program your shades to move while you're away), and a seamless smart home experience integrating with Alexa, Google Home, or Apple HomeKit."] },
    { type: "text", heading: "Energy Efficiency & Sun Protection", body: ["Newport Beach's abundant sunshine is part of its charm, but it can also lead to heat buildup and sun damage inside the home. Options like Duette® Honeycomb Shades provide insulating properties, reducing heat transfer and helping to lower energy costs. Meanwhile, Silhouette® Sheer Shades allow natural light to filter through without damaging furniture, flooring, or artwork."] },
    { type: "text", heading: "A Custom Look for High-End Interiors", body: ["Newport Beach homeowners take pride in curating unique, stylish interiors, and Hunter Douglas shades provide endless customization options. With over 90 premium fabrics, colors, and textures, these shades can be tailored to complement any coastal-modern, contemporary, or traditional space — including Silhouette® Sheer Shades, Luminette® Privacy Sheers, and Pirouette® Window Shadings."] },
    { type: "text", heading: "Why It's Time to Upgrade", body: ["Newport Beach homeowners are investing in smart, stylish, and high-performing window treatments that align with their lifestyles. Hunter Douglas shades provide the perfect combination of modern technology, energy efficiency, and timeless design, making them an essential upgrade for any luxury home."] },
    { type: "cta", heading: "Ready to transform your windows?", body: ["Contact us today for a free consultation! " + BUSINESS.phone] },
  ],
});

PAGES.push({
  path: "/post/trending-window-treatment-styles-for-2025-orange-county",
  title: "Trending Window Treatment Styles for 2025 | Orange County",
  description: "The top window treatment trends for 2025 in Orange County — smart shades, sustainable materials, floor-to-ceiling drapery, and bold colors.",
  nav: "Blog",
  h1: "Trending Window Treatment Styles for 2025",
  postMeta: { date: "Feb 22, 2025", readTime: "3 min" },
  sections: [
    { type: "text", body: ["As we step into 2025, window treatments are taking center stage in home design, blending functionality with high-end aesthetics. Whether you're looking for a modern minimalist approach or luxurious statement pieces, the latest trends in drapery and blinds offer something for every style. Here's a look at the top window treatment trends for 2025 to elevate your home décor."] },
    { type: "text", heading: "1. Smart and Automated Window Treatments", body: ["Homeowners in Orange County are opting for smart window treatments that can be controlled via voice commands, remotes, or smartphone apps. These automated solutions provide convenience and enhance energy efficiency by adjusting to the time of day and climate conditions. Trending: Hunter Douglas PowerView® Automation for seamless smart home integration."] },
    { type: "text", heading: "2. Sustainable and Eco-Friendly Materials", body: ["In 2025, expect a rise in window treatments made from organic cotton, bamboo, linen, and recycled materials. Trending: Woven wood shades and natural linen drapery for a soft, organic look."] },
    { type: "text", heading: "3. Floor-to-Ceiling Drapery for a Luxe Effect", body: ["One of the biggest statements in window fashion this year is full-length drapery that extends from ceiling to floor. Rich textures and heavy fabrics like velvet, silk, and layered sheers are making a strong comeback. Trending: Layering sheer panels with blackout curtains for both beauty and functionality."] },
    { type: "text", heading: "4. Bold Colors and Patterned Fabrics", body: ["Deep greens, terracotta, navy, and rich jewel tones are making waves, along with geometric, floral, and art-inspired patterns. Trending: Custom drapery in jewel-toned velvets or botanical prints for a chic, curated look."] },
    { type: "text", heading: "5. Minimalist and Sleek Roller Shades", body: ["For those who prefer a modern and understated aesthetic, sleek roller shades and solar shades continue to be a top choice. Trending: Dual-layer zebra shades for a balance of light control and contemporary style."] },
    { type: "text", heading: "6. Natural Light Maximization with Sheer Curtains", body: ["Bright, airy interiors are a major trend in 2025, making sheer curtains a must-have for homes looking to embrace natural light. Trending: Sheer drapes paired with smart shades for the perfect balance of openness and control."] },
    { type: "text", heading: "7. Customized and Tailored Window Treatments", body: ["With more homeowners seeking personalization, custom window treatments are on the rise. Trending: Custom embroidered curtains and tailored Roman shades for a one-of-a-kind touch."] },
    { type: "text", heading: "Final Thoughts", body: ["The window treatment trends of 2025 focus on a blend of technology, sustainability, luxury, and personalization. Whether you love the elegance of full-length drapes, the innovation of smart shades, or the natural beauty of woven materials, there's a style to enhance your home this year."] },
    { type: "cta", heading: "Looking to update your window treatments?", body: ["Contact us today to explore the latest Hunter Douglas collections and custom drapery solutions!"] },
  ],
});

module.exports = { BUSINESS, NAV, FOOTER_LINKS, PAGES };
