// main.js - Main entry point for the app

// Navigation function
function navigate(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  }
}

// Show/Hide loading overlay
function showLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.toggle('hidden', !show);
  }
}

// Initialize the app on load
document.addEventListener('DOMContentLoaded', () => {
  navigate('home');
  // Add more init code here later (e.g. load saved data)
});
