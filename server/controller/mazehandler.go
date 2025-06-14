package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Handle movement in the games
func (s *Server) MoveHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut: // gives an x and a y and change to that location
		var MoveJson struct {
			UpdatedCoord model.Coords `json:"new_coords"`
		}
		if err := json.NewDecoder(r.Body).Decode(&MoveJson); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		// get game from redis
		game, err := s.redisGetGame(username)
		if err != nil {
			fmt.Println(err)
			return
		}

		// update game
		err = game.Move(&MoveJson.UpdatedCoord)
		if err != nil {
			fmt.Println(err)
			return
		}
		// save to redi
		err = s.redisSetGame(username, game)
		if err != nil {
			fmt.Println(err)
			return
		}
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
