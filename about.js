const aboutPageLink = document.querySelector('.main-nav a[href="about.html"]');
if (aboutPageLink) aboutPageLink.setAttribute("aria-current", "page");

const aboutStage = document.querySelector(".about-stage");
const canTiltEmblem = aboutStage
  && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canTiltEmblem) {
  aboutStage.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const bounds = aboutStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    aboutStage.style.setProperty("--tilt-x", `${((.5 - y) * 7).toFixed(2)}deg`);
    aboutStage.style.setProperty("--tilt-y", `${((x - .5) * 9).toFixed(2)}deg`);
  });

  aboutStage.addEventListener("pointerleave", () => {
    aboutStage.style.setProperty("--tilt-x", "0deg");
    aboutStage.style.setProperty("--tilt-y", "0deg");
  });
}
