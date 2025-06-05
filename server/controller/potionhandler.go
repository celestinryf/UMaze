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
	log.Printf("Recieved %s request to %s", r.Method, r.URL.Path)
	switch r.Method {
	case http.MethodPut:
		var CurrPotion struct {
			PotionType int `json:"potion_type"`
		}
		if err := json.NewDecoder(r.Body).Decode(&CurrPotion); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		if CurrPotion.PotionType == 1 && hasPotionAndRemove(&s.Game.TheHero.AquiredPotions, model.HealingPotion) {
			if s.Game.TheHero.Name == "PRIMO" {
				s.Game.TheHero.CurrHealth += 150
			} else {
				s.Game.TheHero.CurrHealth += 100
			}
			s.Game.TheHero.CurrHealth = min(s.Game.TheHero.CurrHealth, s.Game.TheHero.TotalHealth)
		}
		if CurrPotion.PotionType == 2 && hasPotionAndRemove(&s.Game.TheHero.AquiredPotions, model.AttackPotion) {
			if s.Game.TheHero.Name == "PRIMO" {
				s.Game.TheHero.Attack += 15
			} else {
				s.Game.TheHero.Attack += 10
			}
		}
		if err := json.NewEncoder(w).Encode(s.Game); err != nil {
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
	if (*bag)[potion] > 0 {
		(*bag)[potion]--
		return true
	}
	return false
}
