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

  var form = document.querySelector("form[data-static-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Visitor-facing copy only — no developer/README language here. The form has no
      // backend yet (see README "Contact form"), so send people to the phone instead.
      alert("Thanks for reaching out! For the fastest response, please call us at (949) 770-8989 and we'll get your free consultation scheduled.");
    });
  }
});

// ---- rotating image carousel (homepage) ----
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var slides = root.querySelectorAll(".carousel-slide");
    var dots = root.querySelectorAll(".carousel-dot");
    if (slides.length < 2) return;
    var current = 0;
    var timer = null;
    var INTERVAL = 4500;

    function show(idx) {
      current = (idx + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("active", i === current); });
      dots.forEach(function (d, i) { d.classList.toggle("active", i === current); });
    }
    function next() { show(current + 1); }
    function restart() {
      if (timer) clearInterval(timer);
      // Respect reduced-motion preference: no autoplay, manual controls still work.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(next, INTERVAL);
    }

    root.querySelector(".carousel-next").addEventListener("click", function () { next(); restart(); });
    root.querySelector(".carousel-prev").addEventListener("click", function () { show(current - 1); restart(); });
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
