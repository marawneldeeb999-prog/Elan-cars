const searchInput = document.querySelector("#car-search");
const categoryFilter = document.querySelector("#category-filter");
const favoritesFilter = document.querySelector("#favorites-filter");
const clearFiltersButton = document.querySelector("#clear-filters");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const cards = [...document.querySelectorAll(".car-card")];
const favoritesKey = "ilan-favorite-cars";
const favorites = new Set();
const toast = document.querySelector(".toast");
let toastTimer;
let favoritesStorageAvailable = true;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function getCarId(card) {
  return card.querySelector(".model-index").textContent.trim();
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .toLocaleLowerCase("ar")
    .trim();
}

function saveFavorites() {
  if (!favoritesStorageAvailable) return false;
  try {
    window.localStorage.setItem(favoritesKey, JSON.stringify([...favorites]));
    return true;
  } catch {
    favoritesStorageAvailable = false;
    return false;
  }
}

function applyFilters() {
  const query = normalizeText(searchInput.value);
  const category = categoryFilter.value;
  const favoritesOnly = favoritesFilter.getAttribute("aria-pressed") === "true";
  let visibleCount = 0;

  cards.forEach((card) => {
    const matchesSearch = !query || normalizeText(card.textContent).includes(query);
    const matchesCategory = !category || card.querySelector(".car-tag").textContent.trim() === category;
    const matchesFavorites = !favoritesOnly || favorites.has(getCarId(card));
    const isVisible = matchesSearch && matchesCategory && matchesFavorites;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  const formatNumber = new Intl.NumberFormat("ar");
  resultsCount.textContent = `عرض ${formatNumber.format(visibleCount)} من ${formatNumber.format(cards.length)} سيارة`;
  emptyState.hidden = visibleCount > 0;
}

if (searchInput && categoryFilter && favoritesFilter && clearFiltersButton && cards.length) {
  try {
    const savedFavorites = JSON.parse(window.localStorage.getItem(favoritesKey) || "[]");
    if (!Array.isArray(savedFavorites) || savedFavorites.some((id) => typeof id !== "string")) {
      throw new TypeError("قائمة المفضلة المحفوظة غير صالحة");
    }
    savedFavorites.forEach((id) => favorites.add(id));
  } catch {
    favoritesStorageAvailable = false;
    showToast("تعذر تحميل المفضلة المحفوظة على هذا الجهاز");
  }

  const categories = [...new Set(cards.map((card) => card.querySelector(".car-tag").textContent.trim()))]
    .sort((a, b) => a.localeCompare(b, "ar"));
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });

  cards.forEach((card) => {
    const button = card.querySelector(".favorite");
    const carLabel = button.getAttribute("aria-label")
      .replace(/^(إضافة|إزالة) /, "")
      .replace(/ للمفضلة$/, "");
    const isFavorite = favorites.has(getCarId(card));
    button.setAttribute("aria-pressed", String(isFavorite));
    button.setAttribute("aria-label", `${isFavorite ? "إزالة" : "إضافة"} ${carLabel} للمفضلة`);
    button.textContent = isFavorite ? "♥" : "♡";

    button.addEventListener("click", () => {
      const carId = getCarId(card);
      const willBeFavorite = !favorites.has(carId);
      if (willBeFavorite) favorites.add(carId);
      else favorites.delete(carId);

      button.setAttribute("aria-pressed", String(willBeFavorite));
      button.setAttribute("aria-label", `${willBeFavorite ? "إزالة" : "إضافة"} ${carLabel} للمفضلة`);
      button.textContent = willBeFavorite ? "♥" : "♡";
      const saved = saveFavorites();
      showToast(saved
        ? willBeFavorite ? "تمت إضافة السيارة إلى المفضلة" : "تمت إزالة السيارة من المفضلة"
        : "تم تحديث المفضلة مؤقتًا، لكن تعذر حفظها على هذا الجهاز");
      applyFilters();
    });
  });

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  favoritesFilter.addEventListener("click", () => {
    const isActive = favoritesFilter.getAttribute("aria-pressed") === "true";
    favoritesFilter.setAttribute("aria-pressed", String(!isActive));
    favoritesFilter.textContent = isActive ? "♡ المفضلة فقط" : "♥ عرض كل السيارات";
    applyFilters();
  });

  clearFiltersButton.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    favoritesFilter.setAttribute("aria-pressed", "false");
    favoritesFilter.textContent = "♡ المفضلة فقط";
    applyFilters();
    searchInput.focus();
  });

  applyFilters();
}

const collectionLink = document.querySelector('.main-nav a[href="collection.html"]');
if (collectionLink) collectionLink.setAttribute("aria-current", "page");

const supportsCardTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (supportsCardTilt) {
  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--tilt-x", `${((.5 - y) * 5).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${((x - .5) * 5).toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  const showroomVisual = document.querySelector(".showroom-visual");
  if (showroomVisual) {
    showroomVisual.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const bounds = showroomVisual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      showroomVisual.style.setProperty("--hero-tilt-x", `${((.5 - y) * 3).toFixed(2)}deg`);
      showroomVisual.style.setProperty("--hero-tilt-y", `${((x - .5) * 5).toFixed(2)}deg`);
    });

    showroomVisual.addEventListener("pointerleave", () => {
      showroomVisual.style.setProperty("--hero-tilt-x", "0deg");
      showroomVisual.style.setProperty("--hero-tilt-y", "0deg");
    });
  }
}
