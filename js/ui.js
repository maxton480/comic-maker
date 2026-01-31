// ui.js - Functions to update UI elements

// Example: Load projects list (for my-projects section)
export function loadProjectsList() {
  const container = document.getElementById('projects-list');
  if (!container) return;

  container.innerHTML = '';
  const projects = getProjects(); // from storage.js

  if (projects.length === 0) {
    container.innerHTML = '<p>No projects saved yet.</p>';
    return;
  }

  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <h3>${project.name}</h3>
      <p>${project.plot?.substring(0, 100) || 'No plot'}...</p>
    `;
    card.onclick = () => {
      // Future: open project view
      alert(`Opening project: ${project.name}`);
    };
    container.appendChild(card);
  });
}

// More UI functions will be added here (character previews, etc.)
