package controller

import (
	"database/sql"
	"encoding/json"
	"log"
	"time"

	"github.com/celestinryf/go-backend/model"
)

type Server struct {
	game *model.Game
}

func InitServer() *Server {
	return &Server{}
}

func (s *Server) saveGame(db *sql.DB) {
	gameBytes, err := json.Marshal(s.game)
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(`INSERT INTO saved_games
		(name, info, date) VALUES (?, ?, ?)`,
		dataName.Name, string(gameBytes), time.Now().Format("5/5/06"))
	if err != nil {
		log.Fatal(err)
	}
}

func (s *Server) getSavedGames(db *sql.DB) []JsonGame {
	savedGameQuery, err := db.Query("SELECT id, name, date FROM saved_games")
	if err != nil {
		log.Fatal(err)
	}
	defer savedGameQuery.Close()
	savedGameArr := make([]JsonGame, 0)
	for savedGameQuery.Next() {
		saved_game := JsonGame{}
		err = savedGameQuery.Scan(&saved_game.Id, &saved_game.Name, &saved_game.Date)
		if err != nil {
			log.Fatal(err)
		}
		savedGameArr = append(savedGameArr, saved_game)
	}
	return savedGameArr
}

func (s *Server) loadGame(id int, db *sql.DB) {
	var jsonData []byte
	err := db.QueryRow("SELECT info FROM saved_games WHERE id = ?", id).Scan(&jsonData)
	if err != nil {
		log.Fatal(err)
	}
	err = json.Unmarshal(jsonData, &s.game)
	if err != nil {
		log.Fatal(err)
	}
}

func (s *Server) deleteGame(id int, db *sql.DB) {
	_, err := db.Exec(`DELETE FROM saved_games
		WHERE id = ?`, id)
	if err != nil {
		log.Fatal(err)
	}
}
