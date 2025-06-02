package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Handle functions in the game, like attacking a monster
func (s *Server) MoveHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)
	switch r.Method {

	// Coordinates of the player
	// type Coords struct {
	// 	X int `json:"x"`
	// 	Y int `json:"y"`
	// }

	case http.MethodPut: // gives an x and a y and change to that location
		var updatedCoord model.Coords
		if err := json.NewDecoder(r.Body).Decode(&updatedCoord); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		s.Game.Move(&updatedCoord)
		json.NewEncoder(w).Encode(s.Game)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "error",
			"message": "Method not allowed",
		})
	}
}
