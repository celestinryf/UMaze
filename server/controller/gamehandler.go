package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Hanldes requests for making games
func (s *Server) GameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPost:
		var HeroIdJson struct {
			HeroId   string `json:"hero_id"`
			MazeSize int    `json:"maze_size"`
		}
		if err := json.NewDecoder(r.Body).Decode(&HeroIdJson); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		newGame, err := model.InitGame(HeroIdJson.HeroId, s.DB, HeroIdJson.MazeSize)
		if err != nil {
			fmt.Println(err)
			return
		}
		// set up redis
		err = s.redisSetGame(username, newGame)
		if err != nil {
			fmt.Println(err)
			return
		}
		// send to front
		if err := json.NewEncoder(w).Encode(newGame); err != nil {
			http.Error(w, "Failed to encode game state", http.StatusInternalServerError)
		}
	case http.MethodGet: // gets curr game json
		// get game
		game, err := s.redisGetGame(username)
		if err != nil {
			fmt.Println(err)
			return
		}
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
