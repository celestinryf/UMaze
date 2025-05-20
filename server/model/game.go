package model

import (
	"database/sql"
	"encoding/json"
	"log"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// This represents the current game
type Game struct {
	TheMaze *Maze `json:"Maze"`
	TheHero *Hero `json:"Hero"`
}

// This is the current game being played
var MyGame *Game

// Gives an initialzed game. (no initing the hero)
func InitGame(theHeroType int) {

	db, err := sql.Open("sqlite3", "./db/360Game.db")
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
	game_query, err := db.Query("SELECT info FROM saved_games WHERE id = ?", game_id)
	if err != nil {
		log.Fatal(err)
	}
	defer game_query.Close()
	game_query.Next()

	// set MyGame to game_query result
	var jsonData []byte
	err = game_query.Scan(&jsonData)
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(jsonData, &MyGame)
	if err != nil {
		log.Fatal(err)
	}
}

// Gets a list of all the name of the loaded games
func GetStoredGames() {

}
