package controller

import (
	"encoding/json"
	"log"
	"net/http"
)

// LoadHandler handles GET (list saved games), POST (save current game), and PUT (load a game)
func (s *Server) LoadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	// Get username from query params
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodGet:
		savedGames := s.getSavedGames(username)
		if err := json.NewEncoder(w).Encode(savedGames); err != nil {
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

		if err := s.saveGame(username, dataName.Name); err != nil {
			log.Printf("Failed to save game: %v", err)
			http.Error(w, "Failed to save game", http.StatusInternalServerError)
			return
		}

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

		if err := s.loadGame(username, dataId.Id); err != nil {
			log.Printf("Failed to load game: %v", err)
			http.Error(w, "Failed to load game", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Game loaded successfully",
		})

	case http.MethodDelete: // delete game by id
		var dataId struct {
			Id int `json:"id"`
		}

		if err := json.NewDecoder(r.Body).Decode(&dataId); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if err := s.deleteGame(username, dataId.Id); err != nil {
			log.Printf("Failed to delete game: %v", err)
			http.Error(w, "Failed to delete game", http.StatusInternalServerError)
			return
		}

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
