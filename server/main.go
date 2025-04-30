package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// this is temporary!!!
// delete this later
type dummyMaze struct {
	grid [][]int
	hero int
}

var currMaze dummyMaze

// handles /api/game (gives me a hero and returns a new game instance)
func gameHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var theHero int

	err := json.NewDecoder(r.Body).Decode(&theHero)
	if err != nil {
		fmt.Println("Could not unmarshall json:", err)
	}

	currMaze = dummyMaze{
		grid: [][]int{
			{0, 0, 0},
			{0, 0, 0},
			{0, 0, 0},
		},
		hero: theHero,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(currMaze)
}

// handles /api/maze
// put give user input, get gets curr game state (gives an int and minuses of user health)
func mazeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "PUT" {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var damage int

	err := json.NewDecoder(r.Body).Decode(&damage)
	if err != nil {
		fmt.Println("Could not parse damage json:", err)
	}

	currMaze.hero -= damage

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(currMaze)
}

// Starting point of the server
func main() {
	fmt.Println("Starting server on :8080")

	http.HandleFunc("/api/game", gameHandler)
	http.HandleFunc("/api/maze", mazeHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
