// main.js - Entry point
function navigate(sectionId) {
  document.querySelectorAll('.section').forEach(el => {
    el.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

// Show loading
function showLoading(show) {
  document.getElementById('loading').classList.toggle('hidden', !show);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  navigate('home');
});
