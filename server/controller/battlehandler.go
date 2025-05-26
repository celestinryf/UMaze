package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Handles battles
func (s *Server) BattleHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	log.Printf("Recieved %s request to %s", r.Method, r.URL.Path)

	switch r.Method {
	case http.MethodPut:

		var CurrAttack struct {
			Attack int          `json:"Attack"`
			Potion model.Potion `json:"Potion"`
		}

		if err := json.NewDecoder(r.Body).Decode(&CurrAttack); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		RoomMonster := s.game.TheMaze.Grid[s.game.TheMaze.CurrCoords.X][s.game.TheMaze.CurrCoords.X].RoomMonster
		CurrHero := s.game.TheHero

		if CurrAttack.Potion != model.NoPotion {
			CurrHero.CurrHealth += 100                            // health from potion
			CurrHero.AquiredPotions = CurrHero.AquiredPotions[1:] // take off first element
		}

		RoomMonster.CurrHealth -= CurrHero.Attack
		if RoomMonster.CurrHealth > 0 {
			CurrHero.CurrHealth -= RoomMonster.Attack
		}

		var AttackResult struct {
			RoomMonster model.Monster `json:"Monster"`
			CurrHero    model.Hero    `json:"Hero"`
		}

		if err := json.NewEncoder(w).Encode(AttackResult); err != nil {
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
