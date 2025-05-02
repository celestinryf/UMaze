package controller

import (
	"encoding/json"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

type heroRequest struct {
	HeroType int `json:"heroType"`
}

func GameHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		model.InitGame()
	case "GET":
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(model.GetCurrGame())
	case "PUT":
		var heroReq heroRequest
		err := json.NewDecoder(r.Body).Decode(&heroReq)
		if err != nil {
			http.Error(w, "Couldn't parse json", http.StatusBadRequest)
			return
		}
		model.GetCurrGame().SetHero(heroReq.HeroType)
	default:
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}
