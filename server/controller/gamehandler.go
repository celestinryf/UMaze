package controller

import (
	"database/sql"
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
	case http.MethodPost: // makes a new game given the hero id
		var HeroIdJson struct {
			HeroId   int `json:"hero_id"`
			MazeSize int `json:"maze_size"`
		}

		if err := json.NewDecoder(r.Body).Decode(&HeroIdJson); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		db, err := sql.Open("sqlite3", "./db/360Game.db")
		if err != nil {
			log.Fatal(err)
		}
		defer db.Close()

		s.Game = model.InitGame(model.HeroType(HeroIdJson.HeroId), db, HeroIdJson.MazeSize)
		if err := json.NewEncoder(w).Encode(s.Game); err != nil {
			http.Error(w, "Failed to encode game state", http.StatusInternalServerError)
		}
	case http.MethodGet: // gets curr game json
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
