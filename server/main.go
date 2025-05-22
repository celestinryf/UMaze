package main

import (
	"fmt"
	"net/http"

	"github.com/celestinryf/go-backend/controller"
	"github.com/celestinryf/go-backend/model"
)

//var Random *rand.Rand

// Starting point of the server side of the program
func main() {

	model.InitGame(4, "./db/360Game.db") // for testing purposes (delete later)

	fmt.Println("Starting server on :8080")
	http.HandleFunc("/api/game/", controller.GameHandler)
	http.HandleFunc("/api/maze/", controller.MazeHandler)
	http.HandleFunc("/api/load/", controller.LoadHandler)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
