package model

import "testing"

func TestInitGame(t *testing.T) {

	InitGame(0, "../db/360Game.db")
	if MyGame != nil {
		t.Error("Game should not me set")
	}

	InitGame(4, "../db/360Game.db")
	if MyGame == nil {
		t.Fatal("Game should init")
	}
	if MyGame.TheHero.Name != "HEALER" {
		t.Error("Should have set to healer")
	}
	if MyGame.TheMaze == nil {
		t.Error("Maze was never set")
	}

	InitGame(5, "../db/360Game.db")
	if MyGame == nil {
		t.Fatal("Game should init")
	}
	if MyGame.TheHero.Name != "GIANT" {
		t.Error("Should have set to GIANT")
	}
	if MyGame.TheMaze == nil {
		t.Error("Maze was never set")
	}

	InitGame(6, "../db/360Game.db")
	if MyGame == nil {
		t.Fatal("Game should init")
	}
	if MyGame.TheHero.Name != "BARBARIAN" {
		t.Error("Should have set to barbarian")
	}
	if MyGame.TheMaze == nil {
		t.Error("Maze was never set")
	}
}

// test store game

// test retrieve game

// test get stored games
