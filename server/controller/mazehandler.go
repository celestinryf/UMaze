package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Handle functions in the game, like attacking a monster
func (s *Server) MoveHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("This should be triggering")

	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	// Get username from query params
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut: // gives an x and a y and change to that location
		// Get game from Redis
		game, err := s.getGameFromRedis(username)
		if err != nil {
			log.Printf("No game found for user %s: %v", username, err)
			http.Error(w, "No active game found", http.StatusNotFound)
			return
		}

		var updatedCoord model.Coords
		if err := json.NewDecoder(r.Body).Decode(&updatedCoord); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		log.Println(updatedCoord)

		game.Move(&updatedCoord)
		log.Println(game.TheMaze.CurrCoords.X)
		log.Println(game.TheMaze.CurrCoords.Y)

		// Save updated game back to Redis
		if err := s.saveGameToRedis(username, game); err != nil {
			log.Printf("Failed to save game to Redis: %v", err)
			http.Error(w, "Failed to save game state", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(game)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "error",
			"message": "Method not allowed",
		})
	}
}
