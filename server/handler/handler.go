/** handler.go */
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

		redisURL := os.Getenv("REDIS_URL")
		if redisURL == "" {
			log.Fatal("REDIS_URL environment variable is required")
		}

		log.Printf("Connecting to Redis...")

		opt, err := redis.ParseURL(redisURL)
		if err != nil {
			log.Fatalf("Failed to parse REDIS_URL: %v", err)
		}

		redisClient = redis.NewClient(opt)

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err = redisClient.Ping(ctx).Err()
		if err != nil {
			log.Fatalf("Failed to connect to Redis: %v", err)
		}
		log.Println("Successfully connected to Redis!")

		dbURL := os.Getenv("TURSO_DATABASE_URL")
		authToken := os.Getenv("TURSO_AUTH_TOKEN")

		log.Printf("TURSO_DATABASE_URL: '%s'", dbURL)
		log.Printf("TURSO_AUTH_TOKEN length: %d", len(authToken))

		if dbURL == "" {
			log.Fatal("TURSO_DATABASE_URL environment variable is not set or is empty")
		}

		connStr := dbURL
		if authToken != "" {
			connStr = fmt.Sprintf("%s?authToken=%s", dbURL, authToken)
		}

		log.Printf("Connecting to Turso database: %s", dbURL)

		db, err := sql.Open("libsql", connStr)
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
		}

		db.SetMaxOpenConns(10)
		db.SetMaxIdleConns(5)
		db.SetConnMaxLifetime(5 * time.Minute)

		if err := db.Ping(); err != nil {
			log.Fatalf("Failed to ping database: %v", err)
		}

		log.Println("Successfully connected to Turso database")
		srv = controller.InitServer(db, redisClient)
	})
}

// Handles incoming requests
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
