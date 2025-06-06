// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

// Get username from localStorage
const getUsername = () => {
  return localStorage.getItem('gameUsername') || 'anonymous';
};

// Game API calls
export const gameAPI = {
  // Start a new game
  startGame: async () => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/game/?username=${username}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to start game');
    return response.json();
  },

  // Get current game state
  getGame: async () => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/game/?username=${username}`);
    if (!response.ok) throw new Error('Failed to get game');
    return response.json();
  },

  // Move player
  move: async (direction) => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/move/?username=${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction }),
    });
    if (!response.ok) throw new Error('Failed to move');
    return response.json();
  },

  // Use potion
  usePotion: async () => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/potion/?username=${username}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to use potion');
    return response.json();
  },

  // Battle actions
  attack: async () => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/battle/?username=${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'attack' }),
    });
    if (!response.ok) throw new Error('Failed to attack');
    return response.json();
  },

  defend: async () => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/battle/?username=${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'defend' }),
    });
    if (!response.ok) throw new Error('Failed to defend');
    return response.json();
  },

  flee: async () => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/battle/?username=${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'flee' }),
    });
    if (!response.ok) throw new Error('Failed to flee');
    return response.json();
  },
};

// Save/Load game API calls
export const saveLoadAPI = {
  // Get list of saved games
  getSavedGames: async () => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/load/?username=${username}`);
    if (!response.ok) throw new Error('Failed to get saved games');
    return response.json();
  },

  // Save current game
  saveGame: async (gameName) => {
    const username = getUsername();
    const response = await fetch(`${API_BASE_URL}/load/?username=${username}`, {
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
    const response = await fetch(`${API_BASE_URL}/load/?username=${username}`, {
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
    const response = await fetch(`${API_BASE_URL}/load/?username=${username}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: gameId }),
    });
    if (!response.ok) throw new Error('Failed to delete game');
    return response.json();
  },
};