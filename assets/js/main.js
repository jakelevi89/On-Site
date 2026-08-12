// Mobile nav toggle + basic contact form handling.
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // On touch devices, tapping a dropdown parent link should open the
  // submenu on first tap instead of navigating away.
  document.querySelectorAll(".nav-item.has-dropdown > a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var parent = link.parentElement;
      if (window.matchMedia("(max-width: 800px)").matches && !parent.classList.contains("submenu-open")) {
        e.preventDefault();
        document.querySelectorAll(".nav-item.has-dropdown.submenu-open").forEach(function (el) {
          if (el !== parent) el.classList.remove("submenu-open");
        });
        parent.classList.add("submenu-open");
      }
    });
  });

  // ---- lead forms (Contact Us + Cleaning quick form) ----
  // Progressive enhancement over a real <form action="/api/lead" method="POST">: with
  // JS off the browser just posts the form and the Pages Function replies with a
  // thank-you page, so the form works either way. Here we upgrade it to a fetch so
  // the visitor keeps their place on the page and gets an inline status message
  // instead of a full navigation.
  //
  // querySelectorAll, not querySelector — the old handler bound only the FIRST form on
  // the page, which is exactly how a second form would silently go dead.
  //
  // Visitor-facing copy only in here: no developer or README language ever reaches
  // this string, and every failure path names the phone number, because a form error
  // the visitor cannot act on is the same as a lost lead.
  var PHONE_FALLBACK = "Sorry — something went wrong sending that. Please call us at (949) 770-8989 and we'll take care of you right away.";

  document.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    var status = form.querySelector("[data-form-status]");
    var button = form.querySelector('button[type="submit"]');
    var busy = false;

    function setStatus(message, state) {
      if (!status) return;
      status.textContent = message;
      status.className = "form-status" + (state ? " form-status-" + state : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;

      // Let the browser's own validation speak first — it points at the offending
      // field, which a generic message at the bottom of the form cannot do.
      if (typeof form.reportValidity === "function" && !form.reportValidity()) return;

      busy = true;
      if (button) {
        button.disabled = true;
        button.dataset.label = button.textContent;
        button.textContent = "Sending...";
      }
      setStatus("Sending...", "pending");

      var payload = {};
      new FormData(form).forEach(function (value, key) {
        payload[key] = value;
      });

      fetch(form.getAttribute("action"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(
            function (body) {
              return { ok: res.ok && body && body.ok, status: res.status, body: body };
            },
            function () {
              return { ok: false, status: res.status, body: null };
            }
          );
        })
        .then(function (result) {
          if (result.ok) {
            form.reset();
            setStatus("Thanks for reaching out — we've got your message and will be in touch shortly.", "ok");
          } else {
            // ONLY a 400 carries a message the visitor can act on (bad email, blank
            // required field). Every other status is our problem, so show the phone
            // instead of whatever the server said.
            //
            // This keys off the STATUS, not the text of the message. It used to sniff
            // the message for /email|field/ — which meant the 503 "Email service is
            // not configured" matched on the word "email" and got printed to real
            // visitors verbatim. Server strings are developer-facing; never render one
            // unless the status says it was written for the visitor.
            var msg = result.body && result.body.error;
            setStatus(result.status === 400 && msg ? msg : PHONE_FALLBACK, "error");
          }
        })
        .catch(function () {
          setStatus(PHONE_FALLBACK, "error");
        })
        .then(function () {
          busy = false;
          if (button) {
            button.disabled = false;
            button.textContent = button.dataset.label || "Send";
          }
        });
    });
  });
});

// The homepage "Find Us On" photo carousel was removed 2026-08-08 — live shows those
// four photos as a plain static grid, so the block renders as `.photo-strip` with no
// behaviour attached. The hero slideshow and the brand-logo rotator below are separate
// components and are still live.

// ---- rotating manufacturer logo strip ----
// The live site cycles its brand logos in groups rather than showing all seven at
// once. Same reduced-motion and hover-pause rules as the other rotators here.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-brand-bar]").forEach(function (root) {
    var slides = root.querySelectorAll(".brand-bar-slide");
    var dots = root.parentElement.querySelectorAll(".brand-bar-dot");
    if (slides.length < 2) return;
    var current = 0;
    var timer = null;
    var INTERVAL = 4000;

    function show(idx) {
      current = (idx + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("active", i === current); });
      dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(function () { show(current + 1); }, INTERVAL);
    }
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { show(i); restart(); });
    });
    root.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    root.addEventListener("mouseleave", restart);
    restart();
  });
});

// ---- rotating hero banner (homepage slideshow) ----
document.addEventListener("DOMContentLoaded", function () {
  var hero = document.querySelector("[data-hero-slideshow]");
  if (!hero) return;
  var slides = hero.querySelectorAll(".hero-slide");
  var dots = hero.querySelectorAll(".hero-dot");
  if (slides.length < 2) return;
  var current = 0;
  var timer = null;
  var INTERVAL = 5000;

  function show(idx) {
    current = (idx + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle("active", i === current); });
    dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
  }
  function restart() {
    if (timer) clearInterval(timer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(function () { show(current + 1); }, INTERVAL);
  }
  dots.forEach(function (d, i) {
    d.addEventListener("click", function () { show(i); restart(); });
  });
  restart();
});

// ---- scroll reveal (Products index photo grid + Cleaning index landing cards) ----
// Two different entrance animations hang off this one observer — the tiles get
// fadeIn + arcIn, the cleaning cards get shuttersIn. Which one applies is decided in
// CSS by the container class (.photo-grid vs .card-links); the JS just adds
// .is-visible and does not care.
// Runs immediately rather than on DOMContentLoaded: this script tag sits at the end of
// <body>, so the grid is already parsed, and arming the hidden state here — before the
// browser has painted — avoids a flash of fully-visible tiles that then snap back to
// invisible.
//
// The hidden state lives behind .reveal-armed, which ONLY this code adds. If the script
// never runs, or IntersectionObserver is missing, the class never lands and the tiles
// render as ordinary visible content. Never move the opacity:0 into the unconditional
// CSS — that turns a JS failure into an invisible page.
(function () {
  var groups = document.querySelectorAll("[data-reveal-group]");
  if (!groups.length || !("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    // Fire slightly BEFORE the tile enters view, not after. The old
    // threshold: 0.18 + rootMargin: "0px 0px -40px 0px" let a tile be fully on screen
    // while still sitting at near-zero opacity mid-animation — that is what read as
    // "washed out" while scrolling (Jake, 2026-08-10). A 1% threshold with a positive
    // bottom margin starts the entrance just under the fold so it is finished, or
    // nearly so, by the time the tile is actually being looked at.
    { threshold: 0.01, rootMargin: "0px 0px 120px 0px" }
  );

  Array.prototype.forEach.call(groups, function (group) {
    group.classList.add("reveal-armed");
    Array.prototype.forEach.call(group.children, function (child) {
      observer.observe(child);
    });
  });
})();
