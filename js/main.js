// =========================================================
// 1. FOOTER YEAR
// Keeps the copyright year always current.
// =========================================================
document.querySelectorAll(".js-year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// =========================================================
// 2. ENTRANCE ANIMATIONS ("reveal on scroll")
// Elements with the .reveal class start hidden (see CSS).
// An IntersectionObserver tells us when each one enters the
// screen: at that moment we add .is-visible and CSS animates it.
// =========================================================
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target); // animate only once
    });
  },
  {
    threshold: 0.15, // 15% of the element must be visible
    rootMargin: "0px 0px -40px 0px", // trigger a bit before the bottom edge
  }
);

// Global function: projects.js uses it for the cards it creates.
function revealOnScroll(elements) {
  elements.forEach((el) => {
    if (prefersReducedMotion) {
      el.classList.add("is-visible"); // no animation, just show it
    } else {
      revealObserver.observe(el);
    }
  });
}

revealOnScroll(document.querySelectorAll(".reveal"));

// =========================================================
// 3. NAVBAR
// a) gets a background once you start scrolling
// b) highlights the link of the section you are looking at
// c) closes the mobile menu after you tap a link
// =========================================================
const nav = document.getElementById("siteNav");
const navLinks = document.querySelectorAll(".site-nav .nav-link");
const navCollapse = document.getElementById("navMain");

function updateNavBackground() {
  nav.classList.toggle("is-scrolled", window.scrollY > 10);
}

window.addEventListener("scroll", updateNavBackground, { passive: true });
updateNavBackground();

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", isCurrent);
      });
    });
  },
  // A section counts as "current" when it crosses the middle of the screen
  { rootMargin: "-50% 0px -50% 0px" }
);

// The hero (#intro) is observed too: no nav link matches it,
// so when you are back at the top nothing is highlighted.
document
  .querySelectorAll("main > [id]")
  .forEach((section) => sectionObserver.observe(section));

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navCollapse.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
    }
  });
});
