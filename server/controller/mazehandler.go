package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Handle movement in the games
func (s *Server) MoveHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)
	switch r.Method {
	case http.MethodPut: // gives an x and a y and change to that location
		// decode body
		var MoveJson struct {
			Username     string       `json:"username"`
			UpdatedCoord model.Coords `json:"new_coords"`
		}
		if err := json.NewDecoder(r.Body).Decode(&MoveJson); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		// get game from redis
		game := s.rediGetGame(MoveJson.Username)
		// update game
		game.Move(&MoveJson.UpdatedCoord)
		// save to redi
		s.rediSetGame(MoveJson.Username, game)
		// send to front
		json.NewEncoder(w).Encode(game)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "error",
			"message": "Method not allowed",
		})
	}
}
