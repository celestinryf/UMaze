package controller

import (
	"database/sql"
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

	db, err := sql.Open("sqlite3", "./db/360Game.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	switch r.Method {
	case "GET": // Get list of all saved games

		if err := json.NewEncoder(w).Encode(s.getSavedGames(db)); err != nil {
			http.Error(w, "Failed to encode stored games", http.StatusInternalServerError)
			return
		}

	case "POST": // Save current game

		var dataName struct {
			Name string `json:"name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&dataName); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		s.saveGame(dataName.Name, db)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Game saved successfully",
		})

	case "PUT": // Load a game

		var dataId struct {
			Id int `json:"id"`
		}
		if err := json.NewDecoder(r.Body).Decode(&dataId); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		s.loadGame(dataId.Id, db)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "success",
			"message": "Game saved successfully",
		})

	case "DELETE": // delete game by id

		var dataId struct {
			Id int `json:"id"`
		}

		if err := json.NewDecoder(r.Body).Decode(&dataId); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		s.deleteGame(dataId.Id, db)
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
