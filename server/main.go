package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/controller"
	"github.com/celestinryf/go-backend/model"
)

//var Random *rand.Rand

// Starting point of the server side of the program
func main() {

	db, err := sql.Open("sqlite3", "./db/360Game.db")
	if err != nil {
		log.Fatal(err)
	}

	model.InitGame(4, db) // for testing purposes (delete later)

	fmt.Println("Starting server on :8080")
	http.HandleFunc("/api/game/", controller.GameHandler)
	http.HandleFunc("/api/maze/", controller.MazeHandler)
	http.HandleFunc("/api/load/", controller.LoadHandler)
	http.HandleFunc("/api/battle/", controller.BattleHandler)
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
