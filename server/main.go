package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/celestinryf/go-backend/handler"
	"github.com/joho/godotenv"
)

// Starting Point of the program (not for vercel)
func main() {

	// Load .env file for local development
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	fmt.Println("Starting server on :8080")

	http.HandleFunc("/", handler.Handler)
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
