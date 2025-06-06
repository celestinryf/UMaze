package controller

import (
	"encoding/json"
	"log"
	"net/http"
)

type JsonGame struct {
	Id   int    `json:"Id"`
	Name string `json:"Name"`
	Date string `json:"Date"`
}

// LoadHandler handles GET (list saved games), POST (save current game), and PUT (load a game)
func (s *Server) LoadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)
	switch r.Method {
	case http.MethodGet:
		if err := json.NewEncoder(w).Encode(s.getSavedGames()); err != nil {
			http.Error(w, "Failed to encode stored games", http.StatusInternalServerError)
			return
		}
	case http.MethodPost:
		var dataName struct {
			Name string `json:"name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&dataName); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		s.saveGame(dataName.Name)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Game saved successfully",
		})
	case http.MethodPut: // Load a game
		var dataId struct {
			Id int `json:"id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&dataId); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		s.loadGame(dataId.Id)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Game saved successfully",
		})
	case http.MethodDelete: // delete game by id
		var dataId struct {
			Id int `json:"id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&dataId); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		s.deleteGame(dataId.Id)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Game deleted successfully",
		})
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "error",
			"message": "Method not allowed",
		})
	}
}
