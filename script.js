const root = document.documentElement;
const routeCount = document.querySelector(".route__count");
const chapters = [...document.querySelectorAll(".chapter")];

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  root.style.setProperty("--progress", progress.toFixed(4));
}

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

const chapterObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible && routeCount) {
      routeCount.textContent = `${visible.target.dataset.step}—07`;
    }
  },
  { threshold: [0.12, 0.35, 0.6], rootMargin: "-15% 0px -45% 0px" }
);

chapters.forEach((chapter) => chapterObserver.observe(chapter));

const analysisTabs = [...document.querySelectorAll(".analysis-tab")];
const analysisImage = document.querySelector("#analysis-image");
const analysisNote = document.querySelector("#analysis-note");
const analysisIndex = document.querySelector("#analysis-index");

function activateTab(tab) {
  const index = analysisTabs.indexOf(tab);

  analysisTabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });

  analysisImage.classList.add("is-changing");

  window.setTimeout(() => {
    analysisImage.src = tab.dataset.src;
    analysisImage.alt = `Слой анализа текста: ${tab.textContent.trim().replace(/^\d+\s*/, "")}`;
    analysisNote.textContent = tab.dataset.note;
    analysisIndex.textContent = String(index + 1).padStart(2, "0");
    analysisImage.classList.remove("is-changing");
  }, 150);
}

analysisTabs.forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (analysisTabs.indexOf(tab) + direction + analysisTabs.length) % analysisTabs.length;
    analysisTabs[nextIndex].focus();
    activateTab(analysisTabs[nextIndex]);
  });
});

const scroller = document.querySelector(".slogan__scroller");
let dragStart = 0;
let scrollStart = 0;
let dragging = false;

scroller?.addEventListener("pointerdown", (event) => {
  dragging = true;
  dragStart = event.clientX;
  scrollStart = scroller.scrollLeft;
  scroller.classList.add("is-dragging");
  scroller.setPointerCapture(event.pointerId);
});

scroller?.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  scroller.scrollLeft = scrollStart - (event.clientX - dragStart);
});

function stopDragging() {
  dragging = false;
  scroller?.classList.remove("is-dragging");
}

scroller?.addEventListener("pointerup", stopDragging);
scroller?.addEventListener("pointercancel", stopDragging);
