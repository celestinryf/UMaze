package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Handles requests for making games
func (s *Server) GameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	// Get username from query params
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPost:
		var HeroIdJson struct {
			HeroId   int `json:"hero_id"`
			MazeSize int `json:"maze_size"`
		}

		if err := json.NewDecoder(r.Body).Decode(&HeroIdJson); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Create new game
		game := model.InitGame(model.HeroType(HeroIdJson.HeroId), s.DB, HeroIdJson.MazeSize)

		// Save to Redis
		if err := s.saveGameToRedis(username, game); err != nil {
			log.Printf("Failed to save game to Redis: %v", err)
			http.Error(w, "Failed to create game", http.StatusInternalServerError)
			return
		}

		if err := json.NewEncoder(w).Encode(game); err != nil {
			http.Error(w, "Failed to encode game state", http.StatusInternalServerError)
		}

	case http.MethodGet: // gets curr game json
		game, err := s.getGameFromRedis(username)
		if err != nil {
			log.Printf("No game found for user %s: %v", username, err)
			http.Error(w, "No active game found", http.StatusNotFound)
			return
		}

		if err := json.NewEncoder(w).Encode(game); err != nil {
			http.Error(w, "Failed to encode game state", http.StatusInternalServerError)
		}

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "error",
			"message": "Method not allowed",
		})
	}
}
