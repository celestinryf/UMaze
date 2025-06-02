package model

import (
	"testing"
)

// Test Init Game method
// func TestInitGame(t *testing.T) {

// 	db, err := sql.Open("sqlite3", "../db/360Game.db")
// 	if err != nil {
// 		t.Fatal(err)
// 	}
// 	defer db.Close()

// 	game4 := InitGame(Matt, db)
// 	if game4.TheHero.Name != "MATT" {
// 		t.Error("Hero shouldn't be nil")
// 	}
// 	if game4.TheMaze == nil {
// 		t.Error("Maze shouldn't be nil")
// 	}

// 	game5 := InitGame(Primo, db)
// 	if game5.TheHero.Name != "PRIMO" {
// 		t.Error("Hero should't be nil")
// 	}
// 	if game5.TheMaze == nil {
// 		t.Error("Maze shouldn't be nil")
// 	}

// 	game6 := InitGame(Nick, db)
// 	if game6.TheHero.Name != "NICK" {
// 		t.Error("Hero should be nil")
// 	}
// 	if game6.TheMaze == nil {
// 		t.Error("Maze shouldn't be nil")
// 	}

// 	game7 := InitGame(Celestin, db)
// 	if game7.TheHero.Name != "CELESTIN" {
// 		t.Error("Hero should be nil")
// 	}
// 	if game7.TheMaze == nil {
// 		t.Error("Maze shouldn't be nil")
// 	}

// }

// Test the Move method
func TestMove(t *testing.T) {

}

func TestAttack(t *testing.T) {
	// func (g *Game) Attack(specialAttack bool, potionType Potion) {

	// 	room := g.TheMaze.Grid[g.TheMaze.CurrCoords.X][g.TheMaze.CurrCoords.X]
	// 	roomMonster := room.RoomMonster
	// 	hero := g.TheHero

	// 	if potionType != NoPotion {
	// 		// implement later (potion)
	// 		hero.CurrHealth += 100
	// 		hero.AquiredPotions = hero.AquiredPotions[1:]
	// 	}

	// 	if !specialAttack {
	// 		roomMonster.CurrHealth -= hero.Attack
	// 	} else {
	// 		// implement later (special attack)
	// 		roomMonster.CurrHealth -= hero.Attack
	// 	}

	//	if roomMonster.CurrHealth > 0 {
	//		hero.CurrHealth -= roomMonster.Attack
	//	} else {
	//
	//		room.RoomMonster = nil
	//	}
}
