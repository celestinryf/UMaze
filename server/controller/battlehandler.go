package controller

import (
	"encoding/json"
	"log"
	"net/http"
)

// Handles battles
func (s *Server) BattleHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	// Get username from query params
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		// Get game from Redis
		game, err := s.getGameFromRedis(username)
		if err != nil {
			log.Printf("No game found for user %s: %v", username, err)
			http.Error(w, "No active game found", http.StatusNotFound)
			return
		}

		game.Attack()

		// Save updated game back to Redis
		if err := s.saveGameToRedis(username, game); err != nil {
			log.Printf("Failed to save game to Redis: %v", err)
			http.Error(w, "Failed to save game state", http.StatusInternalServerError)
			return
		}

		if err := json.NewEncoder(w).Encode(game); err != nil {
			http.Error(w, "Failed to encode hero and monster", http.StatusInternalServerError)
		}

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "error",
			"message": "Method not allowed",
		})
	}
}
