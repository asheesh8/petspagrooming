/* Pet Spa & Grooming — interactions
   Vanilla JS, no dependencies. Progressive enhancement only:
   the site is fully readable with JS disabled. */

(function () {
  "use strict";

  /* Sticky header shadow on scroll */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu toggle */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("show");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("show");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Scroll-reveal via IntersectionObserver */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Build the reviews carousel from the real Google reviews in reviews.js */
  var track = document.getElementById("reviewsTrack");
  var reviews = window.PSG_REVIEWS || [];
  var avatarColors = ["#2a8c84", "#ef7a5a", "#18605c", "#d65f3f", "#7c5cc3", "#c39a2a"];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function initials(name) {
    var parts = name.trim().split(/\s+/);
    var a = parts[0] ? parts[0][0] : "";
    var b = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (a + b).toUpperCase();
  }
  function starPct(rating) { return Math.max(0, Math.min(5, rating)) / 5 * 100; }

  if (track && reviews.length) {
    var html = reviews.map(function (r, i) {
      var color = avatarColors[i % avatarColors.length];
      var meta = r.meta ? '<span class="rc-meta">' + escapeHtml(r.meta) + "</span>" : "";
      return (
        '<article class="review-card" role="listitem">' +
          '<div class="rc-head">' +
            '<span class="avatar" style="background:' + color + '" aria-hidden="true">' + escapeHtml(initials(r.author)) + "</span>" +
            '<span class="rc-who">' +
              '<span class="rc-name">' + escapeHtml(r.author) + "</span><br>" + meta +
            "</span>" +
          "</div>" +
          '<div class="rc-stars">' +
            '<span class="stars" style="--pct:' + starPct(r.rating) + '%" aria-label="' + r.rating + ' out of 5 stars"></span>' +
            '<span class="rc-time">' + escapeHtml(r.time) + "</span>" +
          "</div>" +
          '<p class="rc-text">' + escapeHtml(r.text) + "</p>" +
          '<span class="rc-foot">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.6 0-1.2-.1-1.8H12v3.5h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2Z"/><path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z"/><path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6.1 12 6.1Z"/></svg>' +
            "Posted on Google" +
          "</span>" +
        "</article>"
      );
    }).join("");
    track.innerHTML = html;

    /* Prev / next buttons scroll by roughly one card width */
    var prev = document.getElementById("revPrev");
    var next = document.getElementById("revNext");
    var step = function () {
      var card = track.querySelector(".review-card");
      return card ? card.getBoundingClientRect().width + 18 : 320;
    };
    var updateBtns = function () {
      if (!prev || !next) return;
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", updateBtns, { passive: true });
    updateBtns();
  }

  /* Graceful image fallback: hide broken images so the gradient shows through */
  document.querySelectorAll("img[data-photo]").forEach(function (img) {
    img.addEventListener("error", function () {
      img.style.display = "none";
    });
  });

  /* Footer year */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = String(new Date().getFullYear());
})();
