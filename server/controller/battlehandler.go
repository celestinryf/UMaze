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
			SpecialAttack bool         `json:"SpecialAttack"`
			Potion        model.Potion `json:"Potion"`
		}

		if err := json.NewDecoder(r.Body).Decode(&CurrAttack); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		s.Game.Attack(CurrAttack.SpecialAttack, CurrAttack.Potion)

		// AttackResult := struct {
		// 	Mon  model.Monster `json:"Monster"`
		// 	Hero model.Hero    `json:"Hero"`
		// }{
		// 	Mon:  *s.Game.TheMaze.Grid[s.Game.TheMaze.CurrCoords.X][s.Game.TheMaze.CurrCoords.X].RoomMonster,
		// 	Hero: *s.Game.TheHero,
		// }

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
