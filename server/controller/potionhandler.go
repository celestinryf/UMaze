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
			PotionType model.Potion `json:"potion_type"`
		}

		if err := json.NewDecoder(r.Body).Decode(&CurrPotion); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		log.Println(CurrPotion.PotionType)

		if len(s.Game.TheHero.AquiredPotions) != 0 && CurrPotion.PotionType != model.NoPotion {
			s.Game.TheHero.CurrHealth += 100 // every potion is a healing potion rn
			s.Game.TheHero.AquiredPotions = s.Game.TheHero.AquiredPotions[1:]
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
