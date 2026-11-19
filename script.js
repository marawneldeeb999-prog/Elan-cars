const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

document.querySelectorAll('a[href="../../contact.html"]').forEach((link) => {
  link.setAttribute("href", "contact.html");
});

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "فتح القائمة" : "إغلاق القائمة");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "فتح القائمة");
      navigation.classList.remove("is-open");
    });
  });
}

document.querySelectorAll(".details-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const details = button.nextElementSibling;
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.querySelector("span").textContent = isExpanded ? "＋" : "−";
    details.hidden = isExpanded;
  });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
