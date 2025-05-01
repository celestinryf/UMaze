package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// this will be the serialized version of a new game
type serialGame struct {
	game string `json:"game"`
}

type dummyGame struct {
	dummy string
}

func gameHandler(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case "POST":
		fmt.Println("Post Called: Call this when we want to start up a new/existing game")

		var sg serialGame

		err := json.NewDecoder(r.Body).Decode(&sg)
		if err != nil {
			fmt.Println("Could not unmarshall json:", err)
		}

		if sg.game == "" {
			fmt.Println("We are creating and returning a new game")
			newGame := dummyGame{
				dummy: "This is just a test",
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(newGame)
		} else {
			fmt.Println("This is where we load up an old game, not implemented")
		}
	case "GET":
		fmt.Println("Get Called: gives the current game status")
	case "PUT":
		fmt.Println("Gets called when the front wants to change the hero of the game")
	default:
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

// Starting point of the server
func main() {
	fmt.Println("Starting server on :8080")

	http.HandleFunc("/api/game", gameHandler) // sets up the game (generates a maze)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
