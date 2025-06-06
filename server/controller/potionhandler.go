package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Handles battles
func (s *Server) PotionHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	// Get username from query params
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		// Get game from Redis
		game, err := s.getGameFromRedis(username)
		if err != nil {
			log.Printf("No game found for user %s: %v", username, err)
			http.Error(w, "No active game found", http.StatusNotFound)
			return
		}

		var CurrPotion struct {
			PotionType int `json:"potion_type"`
		}

		if err := json.NewDecoder(r.Body).Decode(&CurrPotion); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if CurrPotion.PotionType == 1 && hasPotionAndRemove(&game.TheHero.AquiredPotions, model.HealingPotion) {
			if game.TheHero.Name == "PRIMO" {
				game.TheHero.CurrHealth += 150
			} else {
				game.TheHero.CurrHealth += 100
			}
			game.TheHero.CurrHealth = min(game.TheHero.CurrHealth, game.TheHero.TotalHealth)
		}

		if CurrPotion.PotionType == 2 && hasPotionAndRemove(&game.TheHero.AquiredPotions, model.AttackPotion) {
			if game.TheHero.Name == "PRIMO" {
				game.TheHero.Attack += 15
			} else {
				game.TheHero.Attack += 10
			}
		}

		// Save updated game back to Redis
		if err := s.saveGameToRedis(username, game); err != nil {
			log.Printf("Failed to save game to Redis: %v", err)
			http.Error(w, "Failed to save game state", http.StatusInternalServerError)
			return
		}

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

func hasPotionAndRemove(bag *map[model.Potion]int, potion model.Potion) bool {
	val := (*bag)[potion]
	if val > 0 {
		(*bag)[potion]--
		return true
	}
	return false
}
