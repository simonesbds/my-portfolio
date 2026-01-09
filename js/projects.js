const projectGrid = document.getElementById("projectsGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("q");
const btnFilter = document.querySelectorAll(".btn-filter");

let loading = false;
let error = null;

let allProjects = [];
let activeFilter = "all";
let searchQuery = "";
let searchTimer = null;

// LOADING PROJECTS
async function loadProjects() {
  btnFilter.forEach((btn) => (btn.disabled = true));
  searchInput.disabled = true;

  loading = true;
  emptyState.hidden = false;
  projectGrid.hidden = true;
  emptyState.textContent = "Caricamento...";

  try {
    const response = await fetch("./data/projects.json");
    if (!response.ok) {
      throw new Error(`Error ${response.status}. Riprova più tardi`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Formato JSON non valido: atteso un array di progetti");
    }

    allProjects = data;

    projectGrid.hidden = false;
    emptyState.hidden = true;

    applyFilters();
  } catch (e) {
    error = e;
    emptyState.hidden = false;
    projectGrid.hidden = true;
    emptyState.textContent = e.message;
  } finally {
    loading = false;
    btnFilter.forEach((btn) => (btn.disabled = false));
    searchInput.disabled = false;
  }
}

// RENDER
function renderProjects(list) {
  projectGrid.innerHTML = "";

  if (list.length === 0) {
    projectGrid.hidden = true;
    emptyState.hidden = false;
    emptyState.textContent = "Nessun risultato";
    return;
  }

  emptyState.hidden = true;
  projectGrid.hidden = false;

  list.forEach((project) => {
    // COL
    const divContainer = document.createElement("div");
    divContainer.className = "col-md-6 col-lg-4";
    projectGrid.append(divContainer);

    // CARD
    const article = document.createElement("article");
    article.className =
      "card h-100 bg-panel border border-light border-opacity-10";
    divContainer.append(article);

    // BODY + HEADER
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const bodyHeader = document.createElement("div");
    bodyHeader.className =
      "d-flex align-items-start justify-content-between gap-2";
    cardBody.append(bodyHeader);

    // FOOTER
    const cardFooter = document.createElement("div");
    cardFooter.className =
      "card-footer bg-transparent border-top border-light border-opacity-10 d-flex gap-2";

    article.append(cardBody, cardFooter);

    // TITLE
    const cardTitle = document.createElement("h2");
    cardTitle.className = "h5 fw-bold mb-0";
    cardTitle.textContent = project.title || "Titolo mancante";

    // BADGE CATEGORY
    const badge = document.createElement("span");
    badge.className =
      "badge text-bg-primary-subtle border border-primary border-opacity-25";

    if (project.category === "api") badge.textContent = "API";
    else if (project.category === "js") badge.textContent = "JavaScript";
    else badge.textContent = "UI";

    bodyHeader.append(cardTitle, badge);

    // DESCRIPTION
    const bodyDescription = document.createElement("p");
    bodyDescription.className = "text-secondary mt-3 mb-0";
    bodyDescription.textContent = project.description || "Descrizione mancante";
    cardBody.append(bodyDescription);

    // TAGS
    if (Array.isArray(project.tags) && project.tags.length > 0) {
      const tagsRow = document.createElement("div");
      tagsRow.className = "d-flex flex-wrap gap-2 mt-3";

      project.tags.forEach((tag) => {
        if (typeof tag !== "string") return;
        if (tag.trim() === "") return;

        const tagBadge = document.createElement("span");
        tagBadge.className =
          "badge text-bg-dark border border-light border-opacity-10";
        tagBadge.textContent = tag.trim();
        tagsRow.append(tagBadge);
      });

      if (tagsRow.children.length > 0) cardBody.append(tagsRow);
    }

    // DEMO LINK
    let hasAnyLink = false;

    if (typeof project.demoUrl === "string" && project.demoUrl.trim() !== "") {
      const demoLink = document.createElement("a");
      demoLink.className = "btn btn-outline-light btn-sm";
      demoLink.textContent = "Demo";
      demoLink.href = project.demoUrl.trim();
      demoLink.target = "_blank";
      demoLink.rel = "noopener noreferrer";
      cardFooter.append(demoLink);
      hasAnyLink = true;
    }

    // REPO LINK
    if (typeof project.repoUrl === "string" && project.repoUrl.trim() !== "") {
      const repoLink = document.createElement("a");
      repoLink.className = "btn btn-light btn-sm";
      repoLink.textContent = "Repo";
      repoLink.href = project.repoUrl.trim();
      repoLink.target = "_blank";
      repoLink.rel = "noopener noreferrer";
      cardFooter.append(repoLink);
      hasAnyLink = true;
    }

    if (!hasAnyLink) cardFooter.hidden = true;
  });
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

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim().toLowerCase();
  applyFilters();
});

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    searchQuery = searchInput.value.trim().toLowerCase();
    applyFilters();
  }, 150);
});

loadProjects();
