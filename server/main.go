package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/controller"
	_ "github.com/mattn/go-sqlite3"
)

// Starting point of the server side of the program
func main() {

	db, err := sql.Open("sqlite3", "./example.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Example query
	rows, err := db.Query("SELECT id, name, age FROM user")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	fmt.Println("Users:")
	for rows.Next() {
		var id int
		var name string
		var age int
		err = rows.Scan(&id, &name, &age)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(id, name, age)
	}

	fmt.Println("Starting server on :8080")
	http.HandleFunc("/api/game/", controller.GameHandler)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
