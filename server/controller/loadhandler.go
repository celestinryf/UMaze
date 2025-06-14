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
		savedGames, err := s.getSavedGames(username)
		if err != nil {
			http.Error(w, "Failed to encode stored games", http.StatusInternalServerError)
			fmt.Println(err)
			return
		}

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
		err := s.saveGame(username, dataName.Name)
		if err != nil {
			fmt.Print(err)
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
		err := s.loadGame(username, dataId.Id)
		if err != nil {
			fmt.Println(err)
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
		err := s.deleteGame(dataId.Id)
		if err != nil {
			fmt.Println(err)
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
	ctx := context.Background()

	// Check if the username exists as a Redis key (how games are stored)
	_, err := s.Redi.Get(ctx, username).Result()
	if err == nil {
		log.Printf("Found existing game for username '%s'", username)
		return true
	}

	// Also check database for saved games
	var count int
	err = s.DB.QueryRow("SELECT COUNT(*) FROM saved_games WHERE username = ?", username).Scan(&count)
	if err != nil {
		log.Printf("Error checking database for username '%s': %v", username, err)
		return false
	}

	exists := count > 0
	log.Printf("Username '%s' exists in database: %t", username, exists)
	return exists
}
