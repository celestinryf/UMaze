package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type JsonGame struct {
	Id   int    `json:"Id"`
	Name string `json:"Name"`
	Date string `json:"Date"`
}

// LoadHandler handles GET (list saved games OR check username availability), POST (save current game), PUT (load a game), and DELETE (delete game)
func (s *Server) LoadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodGet:
		// Check if this is a username availability check
		if r.URL.Query().Get("check") == "availability" {
			s.handleUsernameAvailabilityCheck(w, username)
			return
		}

		// Normal behavior: list saved games
		if err := json.NewEncoder(w).Encode(s.getSavedGames(username)); err != nil {
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
		s.saveGame(username, dataName.Name)
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
		s.loadGame(username, dataId.Id)
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

// handleUsernameAvailabilityCheck checks if a username is available
func (s *Server) handleUsernameAvailabilityCheck(w http.ResponseWriter, username string) {
	available := !s.usernameExists(username)

	response := map[string]interface{}{
		"available": available,
		"username":  username,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}

	log.Printf("Username availability check for '%s': available=%t", username, available)
}

// usernameExists checks if a username already exists in the system
func (s *Server) usernameExists(username string) bool {
	// Check Redis for any keys containing this username
	// Pattern matches: game:username:*, saved_games:username:*, etc.
	patterns := []string{
		fmt.Sprintf("game:%s", username),
		fmt.Sprintf("game:%s:*", username),
		fmt.Sprintf("saved_games:%s:*", username),
		fmt.Sprintf("*:%s:*", username),
	}

	ctx := context.Background()

	for _, pattern := range patterns {
		keys, err := s.Redi.Keys(ctx, pattern).Result()
		if err != nil {
			log.Printf("Error checking pattern %s: %v", pattern, err)
			continue
		}

		if len(keys) > 0 {
			log.Printf("Found existing keys for username '%s' with pattern '%s': %v", username, pattern, keys)
			return true
		}
	}

	return false
}
