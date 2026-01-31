// storage.js - Handles saving and loading data from localStorage

const PROJECTS_KEY = 'comicProjects';
const GLOBAL_CHARACTERS_KEY = 'globalCharacters';
const GLOBAL_LOCATIONS_KEY = 'globalLocations';

// Get all saved projects
export function getProjects() {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading projects:', e);
    return [];
  }
}

// Save or update a project
export function saveProject(project) {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  if (existingIndex !== -1) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

// Get a single project by id or name
export function getProjectByIdOrName(identifier) {
  const projects = getProjects();
  return projects.find(p => p.id === identifier || p.name === identifier);
}

// Global characters
export function getGlobalCharacters() {
  try {
    const data = localStorage.getItem(GLOBAL_CHARACTERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveGlobalCharacter(character) {
  const chars = getGlobalCharacters();
  chars.push(character);
  localStorage.setItem(GLOBAL_CHARACTERS_KEY, JSON.stringify(chars));
}

// Global locations (similar)
export function getGlobalLocations() {
  try {
    const data = localStorage.getItem(GLOBAL_LOCATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveGlobalLocation(location) {
  const locs = getGlobalLocations();
  locs.push(location);
  localStorage.setItem(GLOBAL_LOCATIONS_KEY, JSON.stringify(locs));
}
