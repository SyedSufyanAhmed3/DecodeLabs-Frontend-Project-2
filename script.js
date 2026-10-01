document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("#nav-menu");
  const navLinks = document.querySelectorAll(".nav-link, .nav-cta");

  const closeMenu = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("mobile-open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("mobile-open");
      navToggle.classList.toggle("active", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });

    navLinks.forEach(link => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 950) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  const sections = document.querySelectorAll("main section[id]");
  const sectionObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            document.querySelectorAll(".nav-link").forEach(link => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      }, { rootMargin: "-35% 0px -55% 0px" })
    : null;

  if (sectionObserver) sections.forEach(section => sectionObserver.observe(section));

  const backTop = document.querySelector("#back-to-top");
  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });

    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  const dateInput = document.querySelector("#date");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  const bookingForm = document.querySelector("#booking-form");
  const message = document.querySelector("#form-message");

  if (bookingForm) {
    bookingForm.addEventListener("submit", event => {
      event.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      const name = document.querySelector("#name")?.value.trim() || "Guest";
      const guests = document.querySelector("#guests")?.value || "2 Guests";
      const time = document.querySelector("#time")?.value || "";

      if (message) {
        message.textContent = `Thank you, ${name}! Your table for ${guests} at ${time} has been requested.`;
        message.style.color = "#28745b";
      }

      bookingForm.reset();
      if (dateInput) {
        const today = new Date();
        dateInput.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
      }

      setTimeout(() => {
        if (message) message.textContent = "";
      }, 7000);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const selector = link.getAttribute("href");
      if (!selector || selector === "#") return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", selector);
    });
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
});
