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

	rediClient := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
		Protocol: 2,
	})
	ctx := context.Background()

	err := rediClient.Set(ctx, "foo", "bar", 0).Err()
	if err != nil {
		fmt.Println(err)
	}

	val, err := rediClient.Get(ctx, "foo").Result()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("foo", val)

	err = godotenv.Load()
	if err != nil {
		log.Println("Warning: No .env file found, using system environment variables")
	}

	dbURL := os.Getenv("TURSO_DATABASE_URL")
	authToken := os.Getenv("TURSO_AUTH_TOKEN")
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
	defer db.Close()
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	log.Println("Successfully connected to Turso database")

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
