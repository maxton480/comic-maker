// utils.js - Utility functions

export function generateUniqueId() {
  return 'proj-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

export function showError(message) {
  alert('Error: ' + message);
}
