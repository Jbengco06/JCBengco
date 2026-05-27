const yearEl = document.getElementById("year");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light" || savedTheme === "dark") {
  document.body.setAttribute("data-theme", savedTheme);
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

function setThemeLabel(mode) {
  if (!themeToggle) return;
  themeToggle.textContent = mode === "light" ? "🌞 Light" : "🌙 Dark";
}

setThemeLabel(document.body.getAttribute("data-theme") || "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.body.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setThemeLabel(next);
  });
}

if (window.location.hash === "#projects") {
  const projectsSection = document.getElementById("projects");
  if (projectsSection) {
    // Force landing at projects when returning from project pages.
    projectsSection.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

const profilePhoto = document.getElementById("profilePhoto");
const profileFallback = document.getElementById("profileFallback");

if (profilePhoto && profileFallback) {
  profilePhoto.addEventListener("error", () => {
    profilePhoto.classList.add("hide");
    profileFallback.classList.add("show");
  });
}

// Project details now open in a new tab via `project.html`.
