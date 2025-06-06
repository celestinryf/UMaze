package handler

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/celestinryf/go-backend/controller"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

var (
	srv  *controller.Server
	once sync.Once
)

// Initialize the server once
func initServer() {
	once.Do(func() {
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

		// Test the connection
		if err := db.Ping(); err != nil {
			log.Fatalf("Failed to ping database: %v", err)
		}

		log.Println("Successfully connected to Turso database")

		// Initialize server with DB connection
		srv = controller.InitServer(db)
	})
}

// Handler is the main entry point for Vercel
func Handler(w http.ResponseWriter, r *http.Request) {
	// Initialize server on first request
	initServer()

	// Enable CORS if needed
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Route based on path
	path := strings.TrimPrefix(r.URL.Path, "/api")

	switch {
	case strings.HasPrefix(path, "/game"):
		srv.GameHandler(w, r)
	case strings.HasPrefix(path, "/move"):
		srv.MoveHandler(w, r)
	case strings.HasPrefix(path, "/potion"):
		srv.PotionHandler(w, r)
	case strings.HasPrefix(path, "/load"):
		srv.LoadHandler(w, r)
	case strings.HasPrefix(path, "/battle"):
		srv.BattleHandler(w, r)
	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "Not found: %s", r.URL.Path)
	}
}
