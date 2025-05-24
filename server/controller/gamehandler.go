package controller

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

// Hanldes requests for making games
func GameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	db, err := sql.Open("sqlite3", "./db/360Game.db")
	if err != nil {
		log.Fatal(err)
	}

	model.InitGame(4, db) // eventually get form the request based on the hero chosen

	switch r.Method {
	case "POST", "GET", "PUT":
		if err := json.NewEncoder(w).Encode(model.MyGame); err != nil {
			http.Error(w, "Failed to encode game state", http.StatusInternalServerError)
		}
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "error",
			"message": "Method not allowed",
		})
	}
}
