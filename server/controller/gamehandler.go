package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Hanldes requests for making games
// POST: makes new game give maze size and hero id
// GET: Returns the current game state
func (s *Server) GameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)
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
		// Use the shared DB connection from Server
		s.Game = model.InitGame(model.HeroType(HeroIdJson.HeroId), s.DB, HeroIdJson.MazeSize)
		if err := json.NewEncoder(w).Encode(s.Game); err != nil {
			http.Error(w, "Failed to encode game state", http.StatusInternalServerError)
		}
	case http.MethodGet:
		if err := json.NewEncoder(w).Encode(s.Game); err != nil {
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
