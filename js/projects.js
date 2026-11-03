const projectGrid = document.getElementById("projectsGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("q");
const btnFilter = document.querySelectorAll(".btn-filter");

const CATEGORY_LABELS = {
  js: "JavaScript",
  api: "API",
  ui: "UI",
};

let allProjects = [];
let activeFilter = "all";
let searchQuery = "";
let searchTimer = null;

// HELPERS
function isFilledString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function showMessage(text) {
  projectGrid.hidden = true;
  emptyState.hidden = false;
  emptyState.textContent = text;
}

// LOADING PROJECTS
async function loadProjects() {
  btnFilter.forEach((btn) => (btn.disabled = true));
  searchInput.disabled = true;
  showMessage("Loading projects…");

  try {
    const response = await fetch("./data/projects.json");
    if (!response.ok) {
      throw new Error(`Error ${response.status}. Please try again later.`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON format: expected an array of projects.");
    }

    allProjects = data;
    applyFilters();
  } catch (e) {
    showMessage(e.message);
  } finally {
    btnFilter.forEach((btn) => (btn.disabled = false));
    searchInput.disabled = false;
  }
}

// CARD
function createProjectCard(project) {
  const col = document.createElement("div");
  col.className = "col-md-6";

  const card = document.createElement("article");
  card.className = "panel project-card d-flex flex-column";
  col.append(card);

  // Screenshot
  if (isFilledString(project.image)) {
    const frame = document.createElement("div");
    frame.className = "browser-frame mb-4";

    const bar = document.createElement("div");
    bar.className = "browser-bar";
    bar.setAttribute("aria-hidden", "true");
    bar.append(
      document.createElement("span"),
      document.createElement("span"),
      document.createElement("span")
    );

    const img = document.createElement("img");
    img.src = project.image;
    img.alt = `Screenshot of ${project.title || "project"}`;
    img.loading = "lazy";

    frame.append(bar, img);
    card.append(frame);
  }

  const body = document.createElement("div");
  body.className = "px-2 pb-2 d-flex flex-column flex-grow-1";
  card.append(body);

  // Category + title
  const category = document.createElement("p");
  category.className = "eyebrow mb-2";
  category.textContent = CATEGORY_LABELS[project.category] || "Project";

  const title = document.createElement("h2");
  title.className = "project-title mb-3";
  title.textContent = project.title || "Untitled project";

  const description = document.createElement("p");
  description.className = "text-muted-soft mb-4";
  description.textContent = project.description || "";

  body.append(category, title, description);

  // Tags
  if (Array.isArray(project.tags) && project.tags.length > 0) {
    const tagsRow = document.createElement("div");
    tagsRow.className = "d-flex flex-wrap gap-2 mb-4";

    project.tags.forEach((tag) => {
      if (!isFilledString(tag)) return;

      const tagEl = document.createElement("span");
      tagEl.className = "tag";
      tagEl.textContent = tag.trim();
      tagsRow.append(tagEl);
    });

    if (tagsRow.children.length > 0) body.append(tagsRow);
  }

  // Links (pushed to the bottom of the card with mt-auto)
  const links = document.createElement("div");
  links.className = "d-flex gap-4 mt-auto";

  const linkData = [
    ["Live demo ↗", project.demoUrl],
    ["Code ↗", project.repoUrl],
  ];

  linkData.forEach(([label, url]) => {
    if (!isFilledString(url)) return;

    const link = document.createElement("a");
    link.className = "link-arrow";
    link.textContent = label;
    link.href = url.trim();
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    links.append(link);
  });

  if (links.children.length > 0) body.append(links);

  return col;
}

// RENDER
function renderProjects(list) {
  projectGrid.innerHTML = "";

  if (list.length === 0) {
    showMessage("No projects match your search. Try another filter or keyword.");
    return;
  }

  emptyState.hidden = true;
  projectGrid.hidden = false;

  list.forEach((project, index) => {
    const card = createProjectCard(project);

    // Entrance animation: each card arrives 0.12s after the previous one
    card.classList.add("reveal");
    card.style.setProperty("--delay", `${index * 0.12}s`);

    projectGrid.append(card);
  });

  // revealOnScroll comes from main.js
  revealOnScroll(projectGrid.querySelectorAll(".reveal"));
}

// APPLY FILTERS
function applyFilters() {
  let result = allProjects;

  // Category filter
  if (activeFilter !== "all") {
    result = result.filter((p) => p.category === activeFilter);
  }

  // Search filter
  if (searchQuery !== "") {
    result = result.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const tags = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";
      return (title + " " + desc + " " + tags).includes(searchQuery);
    });
  }

  renderProjects(result);
}

// BUTTON FILTERS
btnFilter.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;

    btnFilter.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    applyFilters();
  });
});

// SEARCH (debounced: waits 150ms after the last keystroke)
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchQuery = searchInput.value.trim().toLowerCase();
    applyFilters();
  }, 150);
});

loadProjects();
