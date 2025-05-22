package model

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// savedGameQuery, err := db.Query("SELECT (id, name, date) FROM saved_games")
type JsonGame struct {
	Id   int    `json:"Id"`
	Name string `json:"Name"`
	Date string `json:"Date"`
}

// This represents the current game
type Game struct {
	TheMaze *Maze `json:"Maze"`
	TheHero *Hero `json:"Hero"`
}

// This is the current game being played
var MyGame *Game

// Gives an initialzed game. (no initing the hero)
func InitGame(theHeroType int, dbPath string) {

	if theHeroType < 3 || theHeroType > 6 {
		fmt.Println("Hero must be 4, 5, or 6")
		return
	}

	db, err := sql.Open("sqlite3", dbPath)
	//db, err := sql.Open("sqlite3", "./db/360Game.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	MyGame = &Game{
		TheMaze: initMaze(db),
		TheHero: initHero(theHeroType, db),
	}
}

// Stores current game in the database
func StoreGame(gameName string) {

	db, err := sql.Open("sqlite3", "./db/360Game.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec(`CREATE TABLE saved_games (
    	id INTEGER PRIMARY KEY AUTOINCREMENT,
    	name TEXT,
    	info TEXT,
    	date TEXT
	)`)
	if err != nil {
		log.Fatal(err)
	}

	gameBytes, err := json.Marshal(MyGame)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`INSERT INTO saved_games
		(name, info, date) VALUES (?, ?, ?)`,
		gameName, string(gameBytes), time.Now().Format("5/5/06"))
	if err != nil {
		log.Fatal(err)
	}
}

// Get a game from the db, then set it to the curr game
func RetrieveGame(game_id int) {

	// Open the database
	db, err := sql.Open("sqlite3", "./db/360Game.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Get the game by the id
	var jsonData []byte
	err = db.QueryRow("SELECT info FROM saved_games WHERE id = ?", game_id).Scan(&jsonData)
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(jsonData, &MyGame)
	if err != nil {
		log.Fatal(err)
	}
}

// Gets a list of all the name of the loaded games
func GetStoredGames() []JsonGame {

	db, err := sql.Open("sqlite3", "./db/360Game.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

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
