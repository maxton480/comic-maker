function navigate(sectionId) {
  document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

  // Load lists when sections open
  if (sectionId === 'my-projects') loadProjects();
  if (sectionId === 'my-characters') loadCharacters();
  if (sectionId === 'my-locations') loadLocations();
}

// ── Comics ────────────────────────────────────────────────

function saveNewComic() {
  const name = document.getElementById('comic-name').value.trim();
  const plot = document.getElementById('comic-plot').value.trim();
  const msg = document.getElementById('create-message');

  if (!name || !plot) {
    msg.textContent = 'Please fill name and plot.';
    msg.style.color = 'red';
    return;
  }

  let comics = JSON.parse(localStorage.getItem('myComics') || '[]');
  comics.push({ id: Date.now(), name, plot, created: new Date().toISOString() });
  localStorage.setItem('myComics', JSON.stringify(comics));

  msg.textContent = 'Comic saved successfully!';
  msg.style.color = '#4caf50';

  // Clear form
  document.getElementById('comic-name').value = '';
  document.getElementById('comic-plot').value = '';

  setTimeout(() => navigate('home'), 1800);
}

function loadProjects() {
  const container = document.getElementById('projects-list');
  const items = JSON.parse(localStorage.getItem('myComics') || '[]');

  container.innerHTML = items.length === 0
    ? '<p style="text-align:center; color:#888;">No comics created yet.</p>'
    : '';

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      <small>\( {item.plot.substring(0, 120)} \){item.plot.length > 120 ? '...' : ''}</small><br>
      <small style="color:#777;">${new Date(item.created).toLocaleDateString()}</small>
    `;
    container.appendChild(div);
  });
}

// ── Characters ─────────────────────────────────────────────

function saveNewCharacter() {
  const name = document.getElementById('char-name').value.trim();
  const desc = document.getElementById('char-desc').value.trim();
  const msg = document.getElementById('char-message');

  if (!name || !desc) {
    msg.textContent = 'Please fill name and description.';
    msg.style.color = 'red';
    return;
  }

  let chars = JSON.parse(localStorage.getItem('myCharacters') || '[]');
  chars.push({ id: Date.now(), name, description: desc, created: new Date().toISOString() });
  localStorage.setItem('myCharacters', JSON.stringify(chars));

  msg.textContent = 'Character saved!';
  msg.style.color = '#4caf50';

  document.getElementById('char-name').value = '';
  document.getElementById('char-desc').value = '';

  setTimeout(() => navigate('home'), 1800);
}

function loadCharacters() {
  const container = document.getElementById('characters-list');
  const items = JSON.parse(localStorage.getItem('myCharacters') || '[]');

  container.innerHTML = items.length === 0
    ? '<p style="text-align:center; color:#888;">No characters created yet.</p>'
    : '';

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      <small>\( {item.description.substring(0, 100)} \){item.description.length > 100 ? '...' : ''}</small>
    `;
    container.appendChild(div);
  });
}

// ── Locations ──────────────────────────────────────────────

function saveNewLocation() {
  const name = document.getElementById('loc-name').value.trim();
  const desc = document.getElementById('loc-desc').value.trim();
  const msg = document.getElementById('loc-message');

  if (!name || !desc) {
    msg.textContent = 'Please fill name and description.';
    msg.style.color = 'red';
    return;
  }

  let locs = JSON.parse(localStorage.getItem('myLocations') || '[]');
  locs.push({ id: Date.now(), name, description: desc, created: new Date().toISOString() });
  localStorage.setItem('myLocations', JSON.stringify(locs));

  msg.textContent = 'Location saved!';
  msg.style.color = '#4caf50';

  document.getElementById('loc-name').value = '';
  document.getElementById('loc-desc').value = '';

  setTimeout(() => navigate('home'), 1800);
}

function loadLocations() {
  const container = document.getElementById('locations-list');
  const items = JSON.parse(localStorage.getItem('myLocations') || '[]');

  container.innerHTML = items.length === 0
    ? '<p style="text-align:center; color:#888;">No locations created yet.</p>'
    : '';

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      <small>\( {item.description.substring(0, 100)} \){item.description.length > 100 ? '...' : ''}</small>
    `;
    container.appendChild(div);
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  navigate('home');
});
