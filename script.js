const photos = [
  { title: "Where the wild grows", category: "nature", categoryLabel: "Nature", src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85", alt: "Sunlight filtering through a lush green forest" },
  { title: "Quiet geometry", category: "architecture", categoryLabel: "Architecture", src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85", alt: "Minimal white modern architecture against the sky" },
  { title: "A road to somewhere", category: "travel", categoryLabel: "Travel", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85", alt: "Mountain peaks rising into the clouds" },
  { title: "The slow morning", category: "details", categoryLabel: "Little details", src: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1000&q=85", alt: "A warm, quiet cafe interior" },
  { title: "Into the blue", category: "nature", categoryLabel: "Nature", src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85", alt: "A scenic landscape with open sky and rolling hills" },
  { title: "Lines in the city", category: "architecture", categoryLabel: "Architecture", src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=85", alt: "Contemporary building facade with geometric lines" },
  { title: "The long way home", category: "travel", categoryLabel: "Travel", src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85", alt: "A peaceful lake surrounded by mountains" },
  { title: "A little sun", category: "details", categoryLabel: "Little details", src: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85", alt: "Soft pastel flowers lit by natural light" },
  { title: "Green, uninterrupted", category: "nature", categoryLabel: "Nature", src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1000&q=85", alt: "Wildlife in a green woodland landscape" },
  { title: "Old soul, new city", category: "architecture", categoryLabel: "Architecture", src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85", alt: "A city skyline at dusk" },
  { title: "Somewhere coastal", category: "travel", categoryLabel: "Travel", src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85", alt: "Ocean waves moving toward the shore" },
  { title: "Details make the day", category: "details", categoryLabel: "Little details", src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1000&q=85", alt: "A thoughtfully arranged cozy interior" }
];

const grid = document.querySelector("#gallery-grid");
const emptyState = document.querySelector("#empty-state");
const photoCount = document.querySelector("#photo-count");
const searchInput = document.querySelector("#search-input");
const resetButton = document.querySelector("#reset-btn");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxCategory = document.querySelector("#lightbox-category");
const lightboxCounter = document.querySelector("#lightbox-counter");
const filterButtons = [...document.querySelectorAll(".filter-btn")];

let activeFilter = "all";
let visiblePhotos = [...photos];
let currentIndex = 0;
let previousFocus = null;

function renderGallery() {
  const query = searchInput.value.trim().toLowerCase();
  visiblePhotos = photos.filter(photo => {
    const matchesCategory = activeFilter === "all" || photo.category === activeFilter;
    const matchesSearch = `${photo.title} ${photo.categoryLabel} ${photo.alt}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = "";
  visiblePhotos.forEach((photo, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    const button = document.createElement("button");
    button.className = "photo-button";
    button.type = "button";
    button.setAttribute("aria-label", `Open photo: ${photo.title}`);
    const image = document.createElement("img");
    image.className = "photo-image";
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      image.alt = `${photo.alt} (Image could not be loaded. Check your internet connection.)`;
      image.style.background = "#d8d6cc";
    }, { once: true });
    const overlay = document.createElement("span");
    overlay.className = "photo-overlay";
    overlay.setAttribute("aria-hidden", "true");
    const viewLabel = document.createElement("span");
    viewLabel.className = "view-label";
    viewLabel.textContent = "VIEW FRAME ↗";
    button.append(image, overlay, viewLabel);
    button.addEventListener("click", () => openLightbox(index));

    const info = document.createElement("div");
    info.className = "photo-info";
    const textGroup = document.createElement("div");
    const title = document.createElement("h2");
    title.className = "photo-title";
    title.textContent = photo.title;
    const category = document.createElement("p");
    category.className = "photo-category";
    category.textContent = photo.categoryLabel;
    textGroup.append(title, category);
    const number = document.createElement("span");
    number.className = "photo-number";
    number.textContent = String(index + 1).padStart(2, "0");
    info.append(textGroup, number);
    card.append(button, info);
    grid.append(card);
  });

  photoCount.textContent = `${visiblePhotos.length} ${visiblePhotos.length === 1 ? "photograph" : "photographs"}`;
  emptyState.hidden = visiblePhotos.length > 0;
  grid.hidden = visiblePhotos.length === 0;
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach(button => {
    const selected = button.dataset.filter === filter;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  renderGallery();
}

function openLightbox(index) {
  if (!visiblePhotos.length) return;
  currentIndex = index;
  previousFocus = document.activeElement;
  updateLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.querySelector("#lightbox-close").focus();
}

function updateLightbox() {
  const photo = visiblePhotos[currentIndex];
  if (!photo) return;
  lightboxImage.src = photo.src.replace("w=1000", "w=1800");
  lightboxImage.alt = photo.alt;
  lightboxTitle.textContent = photo.title;
  lightboxCategory.textContent = photo.categoryLabel;
  lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(visiblePhotos.length).padStart(2, "0")}`;
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
}

function moveLightbox(direction) {
  if (!visiblePhotos.length) return;
  currentIndex = (currentIndex + direction + visiblePhotos.length) % visiblePhotos.length;
  updateLightbox();
}

filterButtons.forEach(button => button.addEventListener("click", () => setFilter(button.dataset.filter)));
searchInput.addEventListener("input", renderGallery);
resetButton.addEventListener("click", () => {
  searchInput.value = "";
  setFilter("all");
});
document.querySelector("#lightbox-close").addEventListener("click", closeLightbox);
document.querySelector("#lightbox-prev").addEventListener("click", () => moveLightbox(-1));
document.querySelector("#lightbox-next").addEventListener("click", () => moveLightbox(1));
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

renderGallery();
