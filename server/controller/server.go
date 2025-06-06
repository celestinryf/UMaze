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

type Server struct {
	DB          *sql.DB
	RedisClient *redis.Client
	ctx         context.Context
}

type JsonGame struct {
	Id   int    `json:"Id"`
	Name string `json:"Name"`
	Date string `json:"Date"`
}

func InitServer(db *sql.DB, redisClient *redis.Client) *Server {
	return &Server{
		DB:          db,
		RedisClient: redisClient,
		ctx:         context.Background(),
	}
}

func (s *Server) getGameFromRedis(username string) (*model.Game, error) {
	key := fmt.Sprintf("game:%s", username)
	gameData, err := s.RedisClient.Get(s.ctx, key).Result()
	if err != nil {
		return nil, err
	}

	var game model.Game
	err = json.Unmarshal([]byte(gameData), &game)
	if err != nil {
		return nil, err
	}

	return &game, nil
}

func (s *Server) saveGameToRedis(username string, game *model.Game) error {
	key := fmt.Sprintf("game:%s", username)
	gameData, err := json.Marshal(game)
	if err != nil {
		return err
	}

	err = s.RedisClient.Set(s.ctx, key, gameData, 7*24*time.Hour).Err()
	return err
}

func (s *Server) deleteGameFromRedis(username string) error {
	key := fmt.Sprintf("game:%s", username)
	return s.RedisClient.Del(s.ctx, key).Err()
}

func (s *Server) saveGame(username string, gameName string) error {
	game, err := s.getGameFromRedis(username)
	if err != nil {
		return fmt.Errorf("no active game found for user %s", username)
	}

	gameBytes, err := json.Marshal(game)
	if err != nil {
		return err
	}

	_, err = s.DB.Exec(`INSERT INTO saved_games
		(username, name, info, date) VALUES (?, ?, ?, ?)`,
		username, gameName, string(gameBytes), time.Now().Format("2006-01-02"))
	return err
}

func (s *Server) getSavedGames(username string) []JsonGame {
	savedGameQuery, err := s.DB.Query("SELECT id, name, date FROM saved_games WHERE username = ?", username)
	if err != nil {
		log.Printf("Failed to query saved games: %v", err)
		return []JsonGame{}
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

func (s *Server) loadGame(username string, id int) error {
	var jsonData []byte
	var dbUsername string
	err := s.DB.QueryRow("SELECT info, username FROM saved_games WHERE id = ?", id).Scan(&jsonData, &dbUsername)
	if err != nil {
		return err
	}

	if dbUsername != username {
		return fmt.Errorf("game does not belong to user")
	}

	var game model.Game
	err = json.Unmarshal(jsonData, &game)
	if err != nil {
		return err
	}

	return s.saveGameToRedis(username, &game)
}

func (s *Server) deleteGame(username string, id int) error {
	_, err := s.DB.Exec(`DELETE FROM saved_games WHERE id = ? AND username = ?`, id, username)
	return err
}
