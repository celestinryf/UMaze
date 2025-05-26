package model

import (
	"database/sql"
	"testing"
)

// Test Init Game method
func TestInitGame(t *testing.T) {

	db, err := sql.Open("sqlite3", "../db/360Game.db")
	if err != nil {
		t.Fatal(err)
	}

	game0 := InitGame(0, db)
	if game0.TheHero != nil {
		t.Error("Hero should be nil")
	}
	if game0.TheMaze == nil {
		t.Error("Maze shouldn't be nil")
	}

	game4 := InitGame(4, db)
	if game4.TheHero.Name != "HEALER" {
		t.Error("Hero should be nil")
	}
	if game4.TheMaze == nil {
		t.Error("Maze shouldn't be nil")
	}

	game5 := InitGame(5, db)
	if game5.TheHero.Name != "GIANT" {
		t.Error("Hero should be nil")
	}
	if game5.TheMaze == nil {
		t.Error("Maze shouldn't be nil")
	}

	game6 := InitGame(6, db)
	if game6.TheHero.Name != "BARBARIAN" {
		t.Error("Hero should be nil")
	}
	if game6.TheMaze == nil {
		t.Error("Maze shouldn't be nil")
	}

}

// Test the Move method
func TestMove(t *testing.T) {

}
