// Mobile navigation toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close nav when a link is clicked (on mobile)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Dynamic year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Highlight current page in nav (simple)
const currentPath = window.location.pathname.split("/").pop() || "index.html";
const pageMap = {
  "index.html": "home",
  "about.html": "about",
  "programs.html": "programs",
  "emergency-help.html": "help",
  "team.html": "team",
  "stories.html": "stories",
  "resources.html": "resources",
  "contact.html": "contact",
  "donate.html": "donate",
};

const currentPageKey = pageMap[currentPath];

if (currentPageKey && navLinks) {
  navLinks
    .querySelectorAll("a[data-page]")
    .forEach((link) => link.classList.remove("active"));

  const activeLink = navLinks.querySelector(
    `a[data-page="${currentPageKey}"]`
  );
  if (activeLink) {
    activeLink.classList.add("active");
  }
}
