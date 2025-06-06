package controller

import (
	"database/sql"
	"encoding/json"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

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

func (s *Server) saveGame(name string) {
	gameBytes, err := json.Marshal(s.Game)
	if err != nil {
		log.Printf("Failed to marshal game: %v", err)
		return
	}
	_, err = s.DB.Exec(`INSERT INTO saved_games
		(name, info, date) VALUES (?, ?, ?)`,
		name, string(gameBytes), time.Now().Format("2006-01-02"))
	if err != nil {
		log.Printf("Failed to save game: %v", err)
	}
}

func (s *Server) getSavedGames() []JsonGame {
	savedGameQuery, err := s.DB.Query("SELECT id, name, date FROM saved_games")
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

func (s *Server) loadGame(id int) {
	var jsonData []byte
	err := s.DB.QueryRow("SELECT info FROM saved_games WHERE id = ?", id).Scan(&jsonData)
	if err != nil {
		log.Printf("Failed to load game: %v", err)
		return
	}
	err = json.Unmarshal(jsonData, &s.Game)
	if err != nil {
		log.Printf("Failed to unmarshal game: %v", err)
	}
}

func (s *Server) deleteGame(id int) {
	_, err := s.DB.Exec(`DELETE FROM saved_games WHERE id = ?`, id)
	if err != nil {
		log.Printf("Failed to delete game: %v", err)
	}
}
