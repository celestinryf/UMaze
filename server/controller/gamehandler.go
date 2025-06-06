package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Hanldes requests for making games
func (s *Server) GameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)
	switch r.Method {
	case http.MethodPost:
		//decode body
		var HeroIdJson struct {
			HeroId   int    `json:"hero_id"`
			MazeSize int    `json:"maze_size"`
			Username string `json:"username"`
		}
		if err := json.NewDecoder(r.Body).Decode(&HeroIdJson); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		// make game
		newGame := model.InitGame(model.HeroType(HeroIdJson.HeroId), s.DB, HeroIdJson.MazeSize)
		// set up redis
		s.redisSetGame(HeroIdJson.Username, *newGame)
		// send to front
		if err := json.NewEncoder(w).Encode(newGame); err != nil {
			http.Error(w, "Failed to encode game state", http.StatusInternalServerError)
		}
	case http.MethodGet: // gets curr game json
		// decode body
		var UserJson struct {
			Username string `json:"username"`
		}
		if err := json.NewDecoder(r.Body).Decode(&UserJson); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		// get game
		game := s.redisGetGame(UserJson.Username)
		// send to front
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
