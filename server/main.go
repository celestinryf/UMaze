package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/celestinryf/go-backend/controller"
	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: No .env file found, using system environment variables")
	}
	// Load environment variables for Turso
	dbURL := os.Getenv("TURSO_DATABASE_URL")
	authToken := os.Getenv("TURSO_AUTH_TOKEN")
	// Debug: Print what we're getting from environment
	log.Printf("TURSO_DATABASE_URL: '%s'", dbURL)
	log.Printf("TURSO_AUTH_TOKEN length: %d", len(authToken))
	if dbURL == "" {
		log.Fatal("TURSO_DATABASE_URL environment variable is not set or is empty")
	}
	// Build connection string with auth token
	connStr := dbURL
	if authToken != "" {
		connStr = fmt.Sprintf("%s?authToken=%s", dbURL, authToken)
	}

	log.Printf("Connecting to Turso database: %s", dbURL)

	// Initialize database connection
	db, err := sql.Open("libsql", connStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Test the connection
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	log.Println("Successfully connected to Turso database")

	// Initialize server with DB connection
	srv := controller.InitServer(db)

	fmt.Println("Starting server on :8080")
	http.HandleFunc("/api/game/", srv.GameHandler)
	http.HandleFunc("/api/move/", srv.MoveHandler)
	http.HandleFunc("/api/potion/", srv.PotionHandler)
	http.HandleFunc("/api/load/", srv.LoadHandler)
	http.HandleFunc("/api/battle/", srv.BattleHandler)

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
