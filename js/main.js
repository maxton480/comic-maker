const HF_API_KEY = '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';

function navigate(sectionId) {
  document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

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
    msg.textContent = 'Name and plot required.';
    msg.style.color = 'red';
    return;
  }

  let comics = JSON.parse(localStorage.getItem('myComics') || '[]');
  comics.push({ id: Date.now(), name, plot, created: new Date().toISOString() });
  localStorage.setItem('myComics', JSON.stringify(comics));

  msg.textContent = 'Comic saved!';
  msg.style.color = '#4caf50';

  document.getElementById('comic-name').value = '';
  document.getElementById('comic-plot').value = '';

  setTimeout(() => navigate('my-projects'), 1800);
}

function loadProjects() {
  const container = document.getElementById('projects-list');
  container.innerHTML = '';
  const items = JSON.parse(localStorage.getItem('myComics') || '[]');

  if (items.length === 0) {
    container.innerHTML = '<p>No comics created yet.</p>';
    return;
  }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <strong>${item.name}</strong><br>
      <small>\( {item.plot.substring(0, 120)} \){item.plot.length > 120 ? '...' : ''}</small>
    `;
    container.appendChild(div);
  });
}

// ── Characters ─────────────────────────────────────────────

let currentCharImages = [];

async function generateCharacterImages() {
  const name = document.getElementById('char-name').value.trim();
  const desc = document.getElementById('char-desc').value.trim();
  const grid = document.getElementById('char-images-grid');

  if (!name || !desc) return alert('Enter name and description first.');

  grid.innerHTML = '<p>Generating images... (may take 10-60 seconds)</p>';

  const prompt = `Comic character portrait: ${name}, ${desc}, detailed face, high quality, anime style comic art`;

  grid.innerHTML = '';
  currentCharImages = [];

  for (let i = 0; i < 4; i++) {
    const seed = Math.floor(Math.random() * 1000000000);
    const url = await generateAIImage(prompt, seed);
    currentCharImages.push(url);

    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
      <img src="${url || 'https://via.placeholder.com/200?text=Image+' + (i+1)}" alt="Option ${i+1}" style="width:100%;"/>
      <input type="radio" name="char-image" value="\( {url}" data-index=" \){i}" />
    `;
    grid.appendChild(card);
  }
}

function regenerateCharacterImages() {
  generateCharacterImages();
}

function saveNewCharacter() {
  const name = document.getElementById('char-name').value.trim();
  const desc = document.getElementById('char-desc').value.trim();
  const selected = document.querySelector('input[name="char-image"]:checked');

  if (!name || !desc || !selected) {
    document.getElementById('char-message').textContent = 'Fill details and select one image.';
    document.getElementById('char-message').style.color = 'red';
    return;
  }

  let chars = JSON.parse(localStorage.getItem('myCharacters') || '[]');
  chars.push({
    id: Date.now(),
    name,
    description: desc,
    image: selected.value,
    created: new Date().toISOString()
  });
  localStorage.setItem('myCharacters', JSON.stringify(chars));

  document.getElementById('char-message').textContent = 'Character saved!';
  document.getElementById('char-message').style.color = '#4caf50';

  document.getElementById('char-name').value = '';
  document.getElementById('char-desc').value = '';
  document.getElementById('char-images-grid').innerHTML = '';

  setTimeout(() => navigate('my-characters'), 1800);
}

function loadCharacters() {
  const container = document.getElementById('characters-list');
  container.innerHTML = '';
  const items = JSON.parse(localStorage.getItem('myCharacters') || '[]');

  if (items.length === 0) {
    container.innerHTML = '<p>No characters yet.</p>';
    return;
  }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <img src="${item.image}" style="width:100px; height:auto; border-radius:8px; margin-bottom:10px;"/>
      <strong>${item.name}</strong><br>
      <small>\( {item.description.substring(0, 100)} \){item.description.length > 100 ? '...' : ''}</small>
    `;
    container.appendChild(div);
  });
}

// ── Locations ──────────────────────────────────────────────

let currentLocImages = [];

async function generateLocationImages() {
  const name = document.getElementById('loc-name').value.trim();
  const desc = document.getElementById('loc-desc').value.trim();
  const grid = document.getElementById('loc-images-grid');

  if (!name || !desc) return alert('Enter name and description first.');

  grid.innerHTML = '<p>Generating images... (may take 10-60 seconds)</p>';

  const prompt = `Comic background location: ${name}, ${desc}, detailed scene, high quality, anime style`;

  grid.innerHTML = '';
  currentLocImages = [];

  for (let i = 0; i < 4; i++) {
    const seed = Math.floor(Math.random() * 1000000000);
    const url = await generateAIImage(prompt, seed);
    currentLocImages.push(url);

    const card = document.createElement('div');
    card.className = 'image-card';
    card.innerHTML = `
      <img src="${url || 'https://via.placeholder.com/200?text=Image+' + (i+1)}" alt="Option ${i+1}" style="width:100%;"/>
      <input type="radio" name="loc-image" value="\( {url}" data-index=" \){i}" />
    `;
    grid.appendChild(card);
  }
}

function regenerateLocationImages() {
  generateLocationImages();
}

function saveNewLocation() {
  const name = document.getElementById('loc-name').value.trim();
  const desc = document.getElementById('loc-desc').value.trim();
  const selected = document.querySelector('input[name="loc-image"]:checked');

  if (!name || !desc || !selected) {
    document.getElementById('loc-message').textContent = 'Fill details and select one image.';
    document.getElementById('loc-message').style.color = 'red';
    return;
  }

  let locs = JSON.parse(localStorage.getItem('myLocations') || '[]');
  locs.push({
    id: Date.now(),
    name,
    description: desc,
    image: selected.value,
    created: new Date().toISOString()
  });
  localStorage.setItem('myLocations', JSON.stringify(locs));

  document.getElementById('loc-message').textContent = 'Location saved!';
  document.getElementById('loc-message').style.color = '#4caf50';

  document.getElementById('loc-name').value = '';
  document.getElementById('loc-desc').value = '';
  document.getElementById('loc-images-grid').innerHTML = '';

  setTimeout(() => navigate('my-locations'), 1800);
}

function loadLocations() {
  const container = document.getElementById('locations-list');
  container.innerHTML = '';
  const items = JSON.parse(localStorage.getItem('myLocations') || '[]');

  if (items.length === 0) {
    container.innerHTML = '<p>No locations yet.</p>';
    return;
  }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <img src="${item.image}" style="width:100px; height:auto; border-radius:8px; margin-bottom:10px;"/>
      <strong>${item.name}</strong><br>
      <small>\( {item.description.substring(0, 100)} \){item.description.length > 100 ? '...' : ''}</small>
    `;
    container.appendChild(div);
  });
}

// ── AI Image Generation ───────────────────────────

async function generateAIImage(prompt, seed) {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt + ', masterpiece, best quality, ultra detailed, sharp focus, 8k',
        parameters: {
          negative_prompt: 'blurry, deformed, ugly, low quality, mutated',
          num_inference_steps: 4,
          guidance_scale: 3.5,
          seed: seed,
          width: 512,
          height: 512
        }
      })
    });

    if (!response.ok) {
      console.error('API error:', response.status, await response.text());
      throw new Error('API call failed');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Image generation failed:', err);
    return 'https://via.placeholder.com/200?text=Error';
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  navigate('home');
});
