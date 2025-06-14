package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// Handles battles
func (s *Server) PotionHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Recieved %s request to %s", r.Method, r.URL.Path)

	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		// get username
		var CurrPotion struct {
			PotionType string `json:"potion_type"`
		}
		if err := json.NewDecoder(r.Body).Decode(&CurrPotion); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		game, err := s.redisGetGame(username)
		if err != nil {
			fmt.Println(err)
			return
		}

		if CurrPotion.PotionType == "Health" && hasPotionAndRemove(&game.TheHero.AquiredPotions, "Health") {
			if game.TheHero.Name == "PRIMO" {
				game.TheHero.CurrHealth += 150
			} else {
				game.TheHero.CurrHealth += 100
			}
			game.TheHero.CurrHealth = min(game.TheHero.CurrHealth, game.TheHero.TotalHealth)
		}

		if CurrPotion.PotionType == "Attack" && hasPotionAndRemove(&game.TheHero.AquiredPotions, "Attack") {
			if game.TheHero.Name == "PRIMO" {
				game.TheHero.Attack += 15
			} else {
				game.TheHero.Attack += 10
			}
		}
		// save to redis
		err = s.redisSetGame(username, game)
		if err != nil {
			fmt.Println(err)
			return
		}
		// send to front end
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

// Checks if a bag has a potion and removes it
func hasPotionAndRemove(bag *map[string]int, potion string) bool {
	val := (*bag)[potion]
	if val > 0 {
		(*bag)[potion]--
		return true
	}
	return false
}
