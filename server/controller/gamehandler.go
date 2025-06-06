package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Hanldes requests for making games
func (s *Server) GameHandler(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	switch r.Method {
	case http.MethodPost:
		var HeroIdJson struct {
			HeroId   int    `json:"hero_id"`
			MazeSize int    `json:"maze_size"`
			Username string `json:"username"`
		}

		if err := json.NewDecoder(r.Body).Decode(&HeroIdJson); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// init the game
		newGame := model.InitGame(model.HeroType(HeroIdJson.HeroId), s.DB, HeroIdJson.MazeSize)
		// set username: new_game
		gameJSON, err := json.Marshal(newGame)
		if err != nil {
			http.Error(w, "Failed to marshal game", http.StatusInternalServerError)
			return
		}
		err = s.Redi.Set(ctx, HeroIdJson.Username, gameJSON, 0).Err()
		if err != nil {
			fmt.Println(err)
		}
		// send back the game
		if err := json.NewEncoder(w).Encode(newGame); err != nil {
			http.Error(w, "Failed to encode game state", http.StatusInternalServerError)
		}
	case http.MethodGet: // gets curr game json
		var UserJson struct {
			Username string `json:"username"`
		}
		if err := json.NewDecoder(r.Body).Decode(&UserJson); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		gameStr, err := s.Redi.Get(ctx, UserJson.Username).Result()
		if err != nil {
			fmt.Println(err)
		}
		var game model.Game
		if err := json.Unmarshal([]byte(gameStr), &game); err != nil {
			fmt.Println(err)
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
