package main

import (
	"fmt"
	"net/http"

	"github.com/celestinryf/go-backend/controller"
)

// Starting point of the server side of the program
func main() {

	fmt.Println("Starting server on :8080")
	srv := controller.InitServer()

	http.HandleFunc("/api/game/", srv.GameHandler)
	http.HandleFunc("/api/move/", srv.MoveHandler)
	http.HandleFunc("/api/load/", srv.LoadHandler)
	http.HandleFunc("/api/battle/", srv.BattleHandler)

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
