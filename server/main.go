package main

import (
	"fmt"
	"net/http"

	"github.com/celestinryf/go-backend/controller"
)

// Starting point of the server side of the program
func main() {
	fmt.Println("Starting server on :8080")
	http.HandleFunc("/api/game", controller.GameHandler) // sets up the game
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
