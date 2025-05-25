package controller

import "net/http"

// Handles battles
func (s *Server) BattleHandler(w http.ResponseWriter, r *http.Request) {

	// have to attack (recieves damage as well)
	// have to use potion

}

// func GameHandler(w http.ResponseWriter, r *http.Request) {

// 	w.Header().Set("Content-Type", "application/json")
// 	log.Printf("Received %s request to %s", r.Method, r.URL.Path)

// 	switch r.Method {
// 	case "POST": // makes a new game given the hero id
// 		type HeroIdJson struct {
// 			HeroId int `json:"hero_id"`
// 		}
// 		var inputHero HeroIdJson
// 		if err := json.NewDecoder(r.Body).Decode(&inputHero); err != nil {
// 			http.Error(w, "Invalid request body", http.StatusBadRequest)
// 			return
// 		}
// 		db, err := sql.Open("sqlite3", "./db/360Game.db")
// 		if err != nil {
// 			log.Fatal(err)
// 		}
// 		defer db.Close()

// 		model.InitGame(inputHero.HeroId, db)
// 		if err := json.NewEncoder(w).Encode(model.MyGame); err != nil {
// 			http.Error(w, "Failed to encode game state", http.StatusInternalServerError)
// 		}
// 	case "GET": // gets curr game json
// 		if err := json.NewEncoder(w).Encode(model.MyGame); err != nil {
// 			http.Error(w, "Failed to encode game state", http.StatusInternalServerError)
// 		}
// 	default:
// 		w.WriteHeader(http.StatusMethodNotAllowed)
// 		json.NewEncoder(w).Encode(map[string]string{
// 			"status":  "error",
// 			"message": "Method not allowed",
// 		})
// 	}
// }
