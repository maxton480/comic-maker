// main.js

function navigate(sectionId) {
  document.querySelectorAll('.section').forEach(el => {
    el.classList.remove('active');
  });
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
    
    // Agar My Projects open ho raha hai to list load karo
    if (sectionId === 'my-projects') {
      loadMyProjects();
    }
  }
}

function showLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.toggle('hidden', !show);
}

// Save new comic
function saveNewComic() {
  const nameInput = document.getElementById('comic-name');
  const plotInput = document.getElementById('comic-plot');
  const message = document.getElementById('save-message');

  const name = nameInput.value.trim();
  const plot = plotInput.value.trim();

  if (!name || !plot) {
    message.textContent = "Please enter both name and plot.";
    message.style.color = "red";
    return;
  }

  const newProject = {
    id: 'comic-' + Date.now(),
    name: name,
    plot: plot,
    created: new Date().toISOString()
  };

  let projects = JSON.parse(localStorage.getItem('comicProjects') || '[]');
  projects.push(newProject);
  localStorage.setItem('comicProjects', JSON.stringify(projects));

  message.textContent = `Comic "${name}" saved!`;
  message.style.color = "#58a6ff";

  nameInput.value = '';
  plotInput.value = '';

  // 2 seconds baad home pe jaao
  setTimeout(() => navigate('home'), 2000);
}

// My Projects list load karo
function loadMyProjects() {
  const container = document.getElementById('projects-container');
  const noMsg = document.getElementById('no-projects-msg');

  if (!container) return;

  container.innerHTML = ''; // Purana content clear
  const projects = JSON.parse(localStorage.getItem('comicProjects') || '[]');

  if (projects.length === 0) {
    noMsg.style.display = 'block';
    return;
  }

  noMsg.style.display = 'none';

  projects.forEach(project => {
    const card = document.createElement('div');
    card.style = 'background:#1e1e2e; padding:15px; margin:10px 0; border-radius:8px; border:1px solid #333;';
    card.innerHTML = `
      <h3 style="margin:0;">${project.name}</h3>
      <p style="margin:8px 0 0; color:#aaa; font-size:0.9rem;">
        \( {project.plot.substring(0, 120)} \){project.plot.length > 120 ? '...' : ''}
      </p>
      <small style="color:#777;">Created: ${new Date(project.created).toLocaleDateString()}</small>
    `;
    container.appendChild(card);
  });
}

// Page load pe home dikhao
document.addEventListener('DOMContentLoaded', () => {
  navigate('home');
});
