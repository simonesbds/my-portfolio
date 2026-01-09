const projectsCountEl = document.getElementById("projectsCount");

async function updateProjectsCount() {
  if (!projectsCountEl) return;

  try {
    const response = await fetch("./data/projects.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (!Array.isArray(data)) throw new Error("JSON non è un array");

    projectsCountEl.textContent = data.length;
  } catch (err) {
    projectsCountEl.textContent = "—";
    console.warn("Impossibile aggiornare il contatore progetti:", err);
  }
}

updateProjectsCount();
