package controller

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/celestinryf/go-backend/model"
	"github.com/redis/go-redis/v9"
)

// Holds components of the server
type Server struct {
	DB   *sql.DB       // Add DB connection
	Redi *redis.Client // Redi Connection
}

// Pass DB connection when initializing server
func InitServer(db *sql.DB, redi *redis.Client) *Server {
	return &Server{
		DB:   db,
		Redi: redi,
	}
}

// Save a game under a user and name
func (s *Server) saveGame(username, name string) {
	game := s.redisGetGame(username)
	gameBytes, err := json.Marshal(game)
	if err != nil {
		log.Printf("Failed to marshal game: %v", err)
		return
	}
	_, err = s.DB.Exec(`INSERT INTO saved_games
		(username, name, info, date) VALUES (?, ?, ?, ?)`,
		username, name, string(gameBytes), time.Now().Format("2006-01-02"))
	if err != nil {
		log.Printf("Failed to save game: %v", err)
	}
}

func (s *Server) getSavedGames(username string) []JsonGame {
	savedGameQuery, err := s.DB.Query("SELECT id, name, date FROM saved_games WHERE username = ?", username)
	if err != nil {
		log.Printf("Failed to query saved games: %v", err)
		return nil
	}
	defer savedGameQuery.Close()
	savedGameArr := make([]JsonGame, 0)
	for savedGameQuery.Next() {
		saved_game := JsonGame{}
		err = savedGameQuery.Scan(&saved_game.Id, &saved_game.Name, &saved_game.Date)
		if err != nil {
			log.Printf("Failed to scan saved game: %v", err)
			continue
		}
		savedGameArr = append(savedGameArr, saved_game)
	}
	return savedGameArr
}

// Loads a game by an id and a username
func (s *Server) loadGame(username string, id int) {
	var jsonData []byte
	err := s.DB.QueryRow("SELECT info FROM saved_games WHERE id = ?", id).Scan(&jsonData)
	if err != nil {
		log.Printf("Failed to load game: %v", err)
		return
	}
	var game model.Game
	err = json.Unmarshal(jsonData, &game)
	if err != nil {
		log.Printf("Failed to unmarshal game: %v", err)
	}
	s.redisSetGame(username, game)
}

// Deletes a game from db by id
func (s *Server) deleteGame(id int) {
	_, err := s.DB.Exec(`DELETE FROM saved_games WHERE id = ?`, id)
	if err != nil {
		log.Printf("Failed to delete game: %v", err)
	}
}

// Gets game by the username from redis and returns it
func (s *Server) redisGetGame(username string) model.Game {
	ctx := context.Background()
	gameStr, err := s.Redi.Get(ctx, username).Result()
	if err != nil {
		fmt.Println(err)
	}
	var game model.Game
	if err := json.Unmarshal([]byte(gameStr), &game); err != nil {
		fmt.Println(err)
	}
	return game
}

// Sets username to game in redis
func (s *Server) redisSetGame(username string, game model.Game) {
	ctx := context.Background()
	gameJson, err := json.Marshal(game)
	if err != nil {
		fmt.Println(err)
		return
	}
	err = s.Redi.Set(ctx, username, gameJson, 0).Err()
	if err != nil {
		fmt.Println(err)
	}
}
