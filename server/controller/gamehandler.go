package controller

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
	"strconv"

	"github.com/celestinryf/go-backend/model"
)

type heroRequest struct {
	HeroType int `json:"heroType"`
}

// Response represents a generic JSON response
type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

func GameHandler(w http.ResponseWriter, r *http.Request) {
	// Always set Content-Type header first, before any potential errors
	w.Header().Set("Content-Type", "application/json")

	// Log the request for debugging
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	switch r.Method {
	case "POST":
		model.InitGame()
		// Return success response with more descriptive data
		resp := Response{
			Status:  "success",
			Message: "Game initialized successfully",
			Data: map[string]interface{}{
				"initialized": true,
				"timestamp": time.Now().Unix(),
				"gameId": "game-" + strconv.FormatInt(time.Now().Unix(), 10),
				"serverInfo": "Go backend is responding correctly with JSON",
			},
		}
		if err := json.NewEncoder(w).Encode(resp); err != nil {
			log.Printf("Error encoding response: %v", err)
			http.Error(w, `{"status":"error","message":"Internal server error"}`, http.StatusInternalServerError)
		}

	case "GET":
		game := model.GetCurrGame()
		
		// If game is nil, initialize it automatically
		if game == nil {
			log.Println("Game not initialized, initializing now...")
			model.InitGame()
			game = model.GetCurrGame()
			
			// If still nil after initialization, return error
			if game == nil {
				log.Println("Failed to initialize game")
				resp := Response{
					Status:  "error",
					Message: "Failed to initialize game",
				}
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(resp)
				return
			}
			
			log.Println("Game initialized successfully")
		}
		
		// Encode the game data
		if err := json.NewEncoder(w).Encode(game); err != nil {
			log.Printf("Error encoding game data: %v", err)
			http.Error(w, `{"status":"error","message":"Failed to encode game data"}`, http.StatusInternalServerError)
		}

	case "PUT":
		var heroReq heroRequest
		if err := json.NewDecoder(r.Body).Decode(&heroReq); err != nil {
			log.Printf("Error decoding request body: %v", err)
			resp := Response{
				Status:  "error",
				Message: fmt.Sprintf("Invalid JSON: %v", err),
			}
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(resp)
			return
		}
		
		// Update the hero
		game := model.GetCurrGame()
		if game == nil {
			resp := Response{
				Status:  "error",
				Message: "Game not initialized",
			}
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(resp)
			return
		}
		
		game.SetHero(heroReq.HeroType)
		
		// Return success response
		resp := Response{
			Status:  "success",
			Message: "Hero updated successfully",
		}
		json.NewEncoder(w).Encode(resp)

	default:
		// Return proper JSON for method not allowed
		resp := Response{
			Status:  "error",
			Message: "Method not allowed",
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(resp)
	}
}