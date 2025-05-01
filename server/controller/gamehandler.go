package controller

import (
	"encoding/json"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

func GameHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		model.InitGame()
	case "GET":
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(model.GetCurrGame)
	case "PUT":
		var heroType int
		err := json.NewDecoder(r.Body).Decode(&heroType)
		if err != nil {
			http.Error(w, "Couldn't parse json", http.StatusBadRequest)
		}
		model.GetCurrGame().SetHero(heroType)
	default:
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}
