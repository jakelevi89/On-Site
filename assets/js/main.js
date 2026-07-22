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
      alert("Thanks! This form isn't wired up to send email yet — see the project README for a quick Formspree/Netlify Forms setup. In the meantime, please call " + (document.querySelector(".phone-pill") ? document.querySelector(".phone-pill").textContent : "us") + ".");
    });
  }
});
