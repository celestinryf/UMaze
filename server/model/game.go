package model

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

// This represents the current game
type Game struct {
	TheMaze *Maze `json:"Maze"`
	TheHero *Hero `json:"Hero"`
}

// This is the current game being played
var myGame *Game

// Gives an initialzed game. (no initing the hero)
func InitGame(theHeroType int) {

	db, err := sql.Open("sqlite3", "./db/360Game.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	myGame = &Game{
		TheMaze: initMaze(db),
		TheHero: initHero(theHeroType, db),
	}
}

// Return the current gam ebeing played
func GetCurrGame() *Game {
	return myGame
}
