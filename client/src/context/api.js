// src/services/api.js

// For Vercel deployment - both frontend and backend on same domain
const API_BASE_URL = '/api';

// Username management functions - NO RANDOM GENERATION
const setUsername = (username) => {
  localStorage.setItem('gameUsername', username);
};

const getUsername = () => {
  return localStorage.getItem('gameUsername');
};

const getDisplayUsername = () => {
  return getUsername() || 'Anonymous';
};

const hasUsername = () => {
  return !!getUsername();
};

const clearUsername = () => {
  localStorage.removeItem('gameUsername');
};

// Base API helper - DRY principle implementation
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    requiresUsername = true,
    queryParams = {}
  } = options;

  // Get username if required
  if (requiresUsername) {
    const username = getUsername();
    if (!username) {
      throw new Error('No username set');
    }
    queryParams.username = username;
  }

  // Build URL with query parameters
  const url = new URL(`${API_BASE_URL}/${endpoint}`, window.location.origin);
  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  // Build fetch options
  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  // Make request
  const response = await fetch(url.toString(), fetchOptions);

  // Handle response
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Check if username is available - Special case (doesn't require existing username)
const checkUsernameAvailability = async (username) => {
  return apiRequest('load', {
    requiresUsername: false,
    queryParams: { 
      username: encodeURIComponent(username), 
      check: 'availability' 
    }
  });
};

// Game API functions - Clean and DRY
const gameAPI = {
  // Start a new game
  startGame: async () => {
    return apiRequest('game', { method: 'POST' });
  },

  // Get current game state
  getGame: async () => {
    try {
      return await apiRequest('game');
    } catch (err) {
      if (err.message === 'Resource not found') {
        throw new Error('No active game found');
      }
      throw err;
    }
  },

  // Move player
  move: async (direction) => {
    return apiRequest('game', { 
      method: 'PUT', 
      body: direction 
    });
  },

  // Attack monster
  attack: async () => {
    return apiRequest('attack', { method: 'POST' });
  },

  // Use potion
  usePotion: async (potionType) => {
    return apiRequest('potion', { 
      method: 'POST', 
      body: { type: potionType } 
    });
  }
};

// Save/Load API functions - Clean and DRY
const saveLoadAPI = {
  // Get saved games list
  getSavedGames: async () => {
    return apiRequest('load');
  },

  // Save current game
  saveGame: async (gameName) => {
    return apiRequest('load', { 
      method: 'POST', 
      body: { name: gameName } 
    });
  },

  // Load a saved game
  loadGame: async (gameId) => {
    return apiRequest('load', { 
      method: 'PUT', 
      body: { id: gameId } 
    });
  },

  // Delete a saved game
  deleteGame: async (gameId) => {
    return apiRequest('load', { 
      method: 'DELETE', 
      body: { id: gameId } 
    });
  }
};

// Export all functions
export { 
  gameAPI, 
  saveLoadAPI, 
  setUsername, 
  getUsername, 
  getDisplayUsername, 
  hasUsername, 
  clearUsername,
  checkUsernameAvailability 
};