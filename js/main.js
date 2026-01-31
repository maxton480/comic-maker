// main.js - Updated with create & save logic

function navigate(sectionId) {
  document.querySelectorAll('.section').forEach(el => {
    el.classList.remove('active');
  });
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  }
}

// Save new comic function
function saveNewComic() {
  const nameInput = document.getElementById('comic-name');
  const plotInput = document.getElementById('comic-plot');
  const messageEl = document.getElementById('save-message');

  const name = nameInput.value.trim();
  const plot = plotInput.value.trim();

  if (!name || !plot) {
    messageEl.textContent = "Please fill both name and plot.";
    messageEl.style.color = "red";
    return;
  }

  // Create project object
  const newComic = {
    id: 'comic-' + Date.now(),
    name: name,
    plot: plot,
    createdAt: new Date().toISOString()
  };

  // Get existing comics or empty array
  let comics = JSON.parse(localStorage.getItem('myComics') || '[]');
  
  // Add new one
  comics.push(newComic);
  
  // Save back to localStorage
  localStorage.setItem('myComics', JSON.stringify(comics));

  // Show success
  messageEl.textContent = `Comic "${name}" created successfully!`;
  messageEl.style.color = "#58a6ff";

  // Clear form
  nameInput.value = '';
  plotInput.value = '';

  // Optional: go back to home after 2 sec
  setTimeout(() => {
    navigate('home');
    messageEl.textContent = ''; // clear message
  }, 2000);
}

// Page load
document.addEventListener('DOMContentLoaded', () => {
  navigate('home');
});
