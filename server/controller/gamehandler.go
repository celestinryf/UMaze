package controller

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/model"
)

func GameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

	model.InitGame(4) // eventually get form the request based on the hero chosen
	currGame := model.GetCurrGame()

	switch r.Method {
	case "POST", "GET", "PUT":
		if err := json.NewEncoder(w).Encode(currGame); err != nil {
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
