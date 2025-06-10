package handler

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/celestinryf/go-backend/controller"
	"github.com/redis/go-redis/v9"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

var (
	srv         *controller.Server
	redisClient *redis.Client
	once        sync.Once
)

// Initialize the server and Redis once
func initServer() {
	once.Do(func() {
		// Initialize Redis client
		redisURL := os.Getenv("REDIS_URL")
		if redisURL == "" {
			log.Fatal("REDIS_URL environment variable is required")
		}

		log.Printf("Connecting to Redis...")

		// Parse Redis URL
		opt, err := redis.ParseURL(redisURL)
		if err != nil {
			log.Fatalf("Failed to parse REDIS_URL: %v", err)
		}

		redisClient = redis.NewClient(opt)

		// Test Redis connection
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err = redisClient.Ping(ctx).Err()
		if err != nil {
			log.Fatalf("Failed to connect to Redis: %v", err)
		}
		log.Println("Successfully connected to Redis!")

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

		// Configure database for serverless
		db.SetMaxOpenConns(10)
		db.SetMaxIdleConns(5)
		db.SetConnMaxLifetime(5 * time.Minute)

		// Test the connection
		if err := db.Ping(); err != nil {
			log.Fatalf("Failed to ping database: %v", err)
		}

		log.Println("Successfully connected to Turso database")

		srv = controller.InitServer(db, redisClient)
	})
}

func Handler(w http.ResponseWriter, r *http.Request) {
	initServer() // Ensure server is initialized

	origin := "*"
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL != "" {
		origin = frontendURL
	}

	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	path := strings.TrimPrefix(r.URL.Path, "/api")

	switch {
	case path == "/" || path == "":
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Server is running with Redis support")
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

// Optional: Cleanup function that Vercel might call
// func Cleanup() {
// 	if redisClient != nil {
// 		redisClient.Close()
// 	}
// }
