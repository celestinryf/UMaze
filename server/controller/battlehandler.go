package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// Handles battles
func (s *Server) BattleHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Recieved %s request to %s", r.Method, r.URL.Path)
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}
	switch r.Method {
	case http.MethodPut:
		var AttackJson struct {
			SpecialAttack bool `json:"SpecialAttack"`
		}
		if err := json.NewDecoder(r.Body).Decode(&AttackJson); err != nil {
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
		game.Attack(AttackJson.SpecialAttack)
		//  save to redis
		err = s.redisSetGame(username, game)
		if err != nil {
			fmt.Println(err)
			return
		}
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
