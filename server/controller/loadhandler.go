package controller

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// LoadHandler handles GET (list saved games), POST (save current game), and PUT (load a game)
func LoadHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	switch r.Method {
	case "GET": // Get list of all saved games
		if err := json.NewEncoder(w).Encode(model.GetStoredGames()); err != nil {
			http.Error(w, "Failed to encode stored games", http.StatusInternalServerError)
			return
		}

	case "POST": // Save current game
		var data struct {
			Name string `json:"name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		db, err := sql.Open("sqlite3", "./db/360Game.db")
		if err != nil {
			log.Fatal(err)
		}
		defer db.Close()
		model.StoreGame(data.Name, db)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Game saved successfully",
		})
	case "PUT": // Load a game
		var data struct {
			Id int `json:"id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		model.RetrieveGame(data.Id, "./db/360Game.db")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Game saved successfully",
		})
	case "DELETE": // delete game by id
		var data struct {
			Id int `json:"id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		model.RemoveGame(data.Id)
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
