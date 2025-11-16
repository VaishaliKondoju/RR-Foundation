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
  "team.html": "team",
  "stories.html": "stories",
  "resources.html": "resources",
  "emergency-help.html": "contact",
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

// ==== Simple horizontal slider for "Our Work" cards ====
const workSliders = document.querySelectorAll(".work-slider");

workSliders.forEach((slider) => {
  const viewport = slider.querySelector(".work-slider-viewport");
  const prevBtn = slider.querySelector(".work-slider-btn.prev");
  const nextBtn = slider.querySelector(".work-slider-btn.next");

  if (!viewport || !prevBtn || !nextBtn) return;

  const scrollAmount = () => viewport.clientWidth * 0.9;

  prevBtn.addEventListener("click", () => {
    viewport.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    viewport.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
});

// ==== Donate page UI logic ====
const freqButtons = document.querySelectorAll(".freq-btn");
const amountButtons = document.querySelectorAll(".amount-btn");
const customAmountInput = document.getElementById("customAmount");
const donateNowBtn = document.getElementById("donateNowBtn");
const donateUiStatus = document.getElementById("donateUiStatus");
const giftPurposeSelect = document.getElementById("giftPurpose");

let selectedFrequency = "once";
let selectedAmount = null;

// frequency toggle
freqButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    freqButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedFrequency = btn.dataset.frequency;
  });
});

// quick amount buttons
amountButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    amountButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedAmount = Number(btn.dataset.amount || 0);
    if (customAmountInput) {
      customAmountInput.value = "";
    }
  });
});

// custom amount typing
if (customAmountInput) {
  customAmountInput.addEventListener("input", () => {
    const val = Number(customAmountInput.value || 0);
    selectedAmount = val > 0 ? val : null;
    amountButtons.forEach((b) => b.classList.remove("active"));
  });
}

// continue button
if (donateNowBtn && donateUiStatus) {
  donateNowBtn.addEventListener("click", () => {
    donateUiStatus.style.color = "#fee2e2";

    if (!selectedAmount || selectedAmount <= 0) {
      donateUiStatus.textContent =
        "Please select or enter a donation amount to continue.";
      return;
    }

    const purpose =
      (giftPurposeSelect && giftPurposeSelect.value) || "where-needed";
    const freqLabel = selectedFrequency === "monthly" ? "monthly" : "one-time";

    // Here is where you would redirect to Stripe/PayPal/etc:
    // window.location.href = "https://your-donation-platform.com/checkout-url";

    donateUiStatus.textContent =
      `You selected a ${freqLabel} donation of $${selectedAmount}` +
      (purpose ? ` for “${purpose.replace(/-/g, " ")}”.` : ".") +
      " Connect this button to your payment provider when ready.";
  });
}


// ==== Stories slider (auto-advance) ====
const storySliders = document.querySelectorAll("[data-slider='stories']");

storySliders.forEach((sliderRoot) => {
  const track = sliderRoot.querySelector(".stories-slider-track");
  const slides = sliderRoot.querySelectorAll(".story-slide");
  const dots = sliderRoot.querySelectorAll(".story-dot");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayId = null;
  const slideCount = slides.length;
  const intervalMs = 7000; // 7 seconds per slide

  function goToSlide(index) {
    currentIndex = (index + slideCount) % slideCount;
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;

    // update dot active state
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function startAutoplay() {
    if (autoplayId !== null) return;
    autoplayId = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, intervalMs);
  }

  function stopAutoplay() {
    if (autoplayId !== null) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  // Dots click
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goToSlide(i);
    });
  });

  // Pause on hover (desktop)
  sliderRoot.addEventListener("mouseenter", stopAutoplay);
  sliderRoot.addEventListener("mouseleave", startAutoplay);

  // Initialize
  goToSlide(0);
  startAutoplay();
});
