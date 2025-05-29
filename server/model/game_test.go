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

	game4 := InitGame(Matt, db)
	if game4.TheHero.Name != "MATT" {
		t.Error("Hero shouldn't be nil")
	}
	if game4.TheMaze == nil {
		t.Error("Maze shouldn't be nil")
	}

	game5 := InitGame(Primo, db)
	if game5.TheHero.Name != "PRIMO" {
		t.Error("Hero should't be nil")
	}
	if game5.TheMaze == nil {
		t.Error("Maze shouldn't be nil")
	}

	game6 := InitGame(Nick, db)
	if game6.TheHero.Name != "NICK" {
		t.Error("Hero should be nil")
	}
	if game6.TheMaze == nil {
		t.Error("Maze shouldn't be nil")
	}

	game7 := InitGame(Celestin, db)
	if game7.TheHero.Name != "CELESTIN" {
		t.Error("Hero should be nil")
	}
	if game7.TheMaze == nil {
		t.Error("Maze shouldn't be nil")
	}

}

// Test the Move method
func TestMove(t *testing.T) {

}
