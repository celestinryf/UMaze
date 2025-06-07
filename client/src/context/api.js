// src/services/api.js

// For Vercel deployment - both frontend and backend on same domain
const API_BASE_URL = '/api';

// Generate a unique username with timestamp and random suffix
const generateUniqueUsername = (baseUsername) => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseUsername}_${timestamp}_${randomSuffix}`;
};

// Set username in localStorage with unique identifier
export const setUsername = (username) => {
  if (!username || username.trim() === '') {
    throw new Error('Username cannot be empty');
  }
  
  // Clean the username (remove spaces, special chars)
  const cleanUsername = username.trim().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  // Generate unique version
  const uniqueUsername = generateUniqueUsername(cleanUsername);
  
  // Store both original and unique versions
  localStorage.setItem('gameUsername', uniqueUsername);
  localStorage.setItem('displayUsername', username.trim());
  
  return uniqueUsername;
};

// Get unique username from localStorage
const getUsername = () => {
  let username = localStorage.getItem('gameUsername');
  
  // If no username exists, create a unique anonymous one
  if (!username) {
    username = generateUniqueUsername('anonymous');
    localStorage.setItem('gameUsername', username);
    localStorage.setItem('displayUsername', 'Anonymous');
  }
  
  return username;
};

// Get display username (what user originally entered)
export const getDisplayUsername = () => {
  return localStorage.getItem('displayUsername') || 'Anonymous';
};

// Clear username (for logout/reset)
export const clearUsername = () => {
  localStorage.removeItem('gameUsername');
  localStorage.removeItem('displayUsername');
};

// Check if username is set
export const hasUsername = () => {
  return !!localStorage.getItem('gameUsername');
};

// Game API calls
export const gameAPI = {
  // Start a new game
  startGame: async (heroId, mazeSize) => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/game/?username=${encodeURIComponent(username)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        hero_id: heroId, 
        maze_size: mazeSize 
      }),
    });
    if (!response.ok) throw new Error('Failed to start game');
    return response.json();
  },

  // Get current game state
  getGame: async () => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/game/?username=${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error('Failed to get game');
    return response.json();
  },

  // Move player (expects x, y coordinates)
  move: async (newCoords) => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/move/?username=${encodeURIComponent(username)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_coords: newCoords }),
    });
    if (!response.ok) throw new Error('Failed to move');
    return response.json();
  },

  // Use potion (potionType: 1 = healing, 2 = attack)
  usePotion: async (potionType) => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/potion/?username=${encodeURIComponent(username)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ potion_type: potionType }),
    });
    if (!response.ok) throw new Error('Failed to use potion');
    return response.json();
  },

  // Battle action (only attack is available)
  attack: async () => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/battle/?username=${encodeURIComponent(username)}`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to attack');
    return response.json();
  },
};

// Save/Load game API calls
export const saveLoadAPI = {
  // Get list of saved games
  getSavedGames: async () => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/load/?username=${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error('Failed to get saved games');
    return response.json();
  },

  // Save current game
  saveGame: async (gameName) => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/load/?username=${encodeURIComponent(username)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: gameName }),
    });
    if (!response.ok) throw new Error('Failed to save game');
    return response.json();
  },

  // Load a saved game
  loadGame: async (gameId) => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/load/?username=${encodeURIComponent(username)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: gameId }),
    });
    if (!response.ok) throw new Error('Failed to load game');
    return response.json();
  },

  // Delete a saved game
  deleteGame: async (gameId) => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/load/?username=${encodeURIComponent(username)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: gameId }),
    });
    if (!response.ok) throw new Error('Failed to delete game');
    return response.json();
  },
};