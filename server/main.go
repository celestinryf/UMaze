package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/celestinryf/go-backend/controller"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

func main() {
	// Load .env file ONLY in development
	if os.Getenv("RAILWAY_ENVIRONMENT") == "" {
		err := godotenv.Load()
		if err != nil {
			log.Println("Warning: No .env file found, using system environment variables")
		}
	}

	// Initialize Redis client
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		log.Fatal("REDIS_URL environment variable is required")
	}

	log.Println("=== Environment Variables ===")
	log.Printf("REDIS_URL exists: %v", os.Getenv("REDIS_URL") != "")
	log.Printf("REDIS_URL length: %d", len(os.Getenv("REDIS_URL")))
	log.Printf("First 20 chars of REDIS_URL: %.20s...", os.Getenv("REDIS_URL"))
	log.Println("============================")

	log.Printf("Connecting to Redis...")

	// Parse Redis URL
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatalf("Failed to parse REDIS_URL: %v", err)
	}

	redisClient := redis.NewClient(opt)

	// Test Redis connection
	ctx := context.Background()
	err = redisClient.Ping(ctx).Err()
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	log.Println("Successfully connected to Redis!")

	// Database connection
	dbURL := os.Getenv("TURSO_DATABASE_URL")
	authToken := os.Getenv("TURSO_AUTH_TOKEN")
	if dbURL == "" {
		log.Fatal("TURSO_DATABASE_URL environment variable is not set")
	}

	connStr := dbURL
	if authToken != "" {
		connStr = fmt.Sprintf("%s?authToken=%s", dbURL, authToken)
	}

	log.Printf("Connecting to Turso database...")

	db, err := sql.Open("libsql", connStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	log.Println("Successfully connected to Turso database")

	// Initialize server with Redis
	srv := controller.InitServer(db, redisClient)

	// Enable CORS for your frontend
	http.HandleFunc("/api/game/", enableCORS(srv.GameHandler))
	http.HandleFunc("/api/move/", enableCORS(srv.MoveHandler))
	http.HandleFunc("/api/potion/", enableCORS(srv.PotionHandler))
	http.HandleFunc("/api/load/", enableCORS(srv.LoadHandler))
	http.HandleFunc("/api/battle/", enableCORS(srv.BattleHandler))

	// Get port from environment
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Starting server on :%s\n", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		panic(err)
	}
}

// CORS middleware
func enableCORS(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Allow your frontend URL
		origin := os.Getenv("FRONTEND_URL")
		if origin == "" {
			origin = "*" // Allow all in development
		}

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		handler(w, r)
	}
}
