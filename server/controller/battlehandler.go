package controller

import (
	"encoding/json"
	"log"
	"net/http"
)

// Handles battles
func (s *Server) BattleHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Recieved %s request to %s", r.Method, r.URL.Path)
	switch r.Method {
	case http.MethodPut:
		// get username from body
		var UserJson struct {
			Username string `json:"username"`
		}
		if err := json.NewDecoder(r.Body).Decode(&UserJson); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		// get game from redis
		game := s.rediGetGame(UserJson.Username)
		// update game
		game.Attack()
		//  save to redis
		s.rediSetGame(UserJson.Username, game)
		// send to frontend
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
