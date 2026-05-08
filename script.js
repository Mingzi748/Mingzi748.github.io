const body = document.body;
const toggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("personal-home-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(theme) {
  const isDark = theme === "dark";
  body.classList.toggle("dark", isDark);
  toggle?.setAttribute("aria-pressed", String(isDark));
}
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));
toggle?.addEventListener("click", () => {
  const next = body.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("personal-home-theme", next);
  applyTheme(next);
});

const typeTarget = document.querySelector(".type-line");
if (typeTarget) {
  const text = typeTarget.dataset.type || "";
  let i = 0;
  const timer = window.setInterval(() => {
    typeTarget.textContent = text.slice(0, i);
    i += 1;
    if (i > text.length) window.clearInterval(timer);
  }, 42);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    entry.target.querySelectorAll(".reveal-card").forEach((card, index) => {
      window.setTimeout(() => card.classList.add("is-visible"), index * 140);
    });
  });
}, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

function makeDraggable(element) {
  let startX = 0;
  let startY = 0;
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  element.addEventListener("pointerdown", (event) => {
    dragging = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
    element.classList.add("dragging-note");
    body.classList.add("dragging");
    element.setPointerCapture(event.pointerId);
  });
  element.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;
    element.style.translate = `${offsetX}px ${offsetY}px`;
  });
  const stop = (event) => {
    if (!dragging) return;
    dragging = false;
    element.classList.remove("dragging-note");
    body.classList.remove("dragging");
    if (element.hasPointerCapture?.(event.pointerId)) element.releasePointerCapture(event.pointerId);
  };
  element.addEventListener("pointerup", stop);
  element.addEventListener("pointercancel", stop);
}
document.querySelectorAll("[data-draggable='true']").forEach(makeDraggable);

document.querySelectorAll(".skill-pills button").forEach((pill) => {
  pill.addEventListener("click", () => {
    pill.classList.toggle("active");
  });
});

const modal = document.querySelector(".modal");
const copyHint = document.querySelector(".copy-hint");
function openModal() {
  modal?.classList.add("is-open");
  modal?.setAttribute("aria-hidden", "false");
  copyHint.textContent = "";
}
function closeModal() {
  modal?.classList.remove("is-open");
  modal?.setAttribute("aria-hidden", "true");
}
document.querySelectorAll("[data-contact]").forEach((trigger) => {
  trigger.addEventListener("click", openModal);
});
document.querySelectorAll("[data-close-modal]").forEach((trigger) => {
  trigger.addEventListener("click", closeModal);
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      copyHint.textContent = `已复制微信号：${value}`;
    } catch {
      copyHint.textContent = `微信号：${value}`;
    }
  });
});

window.addEventListener("pointermove", (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * 10;
  document.querySelectorAll(".sticky:not(.dragging-note)").forEach((note, index) => {
    note.style.marginLeft = `${Math.sin(index + x) * 2}px`;
    note.style.marginTop = `${Math.cos(index + y) * 2}px`;
  });
}, { passive: true });
