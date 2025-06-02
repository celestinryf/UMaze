package model

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

// This represents the current game
type Game struct {
	TheMaze *Maze `json:"Maze"`
	TheHero *Hero `json:"Hero"`
}

// Gives an initialzed game.
func InitGame(theHeroType HeroType, db *sql.DB, mazeSize int) *Game {
	return &Game{
		TheMaze: initMaze(db, mazeSize),
		TheHero: initHero(theHeroType, db),
	}
}

// Sets curr location to x and y
func (g *Game) Move(newCoords *Coords) GameStatus {

	if g.TheMaze.Grid[g.TheMaze.CurrCoords.X][g.TheMaze.CurrCoords.Y].RoomMonster != nil {
		return InProgress
	}

	if g.TheMaze.Grid[g.TheMaze.CurrCoords.X][g.TheMaze.CurrCoords.Y].RoomType == wall {
		return InProgress
	}

	g.TheMaze.CurrCoords = newCoords
	currRoom := g.TheMaze.Grid[newCoords.X][newCoords.Y]

	if currRoom.PotionType != NoPotion {
		g.TheHero.AquiredPotions = append(g.TheHero.AquiredPotions, currRoom.PotionType)
		currRoom.PotionType = NoPotion
	}

	if currRoom.PillarType != noPillar {
		g.TheHero.AquiredPillars = append(g.TheHero.AquiredPillars, currRoom.PillarType)
		currRoom.PillarType = noPillar
	}

	if currRoom.RoomType == pit {
		g.TheHero.CurrHealth -= 20 // can change the pit damage
		if g.TheHero.CurrHealth <= 0 {
			return Lost
		}
	}

	if currRoom.RoomType == end && len(g.TheHero.AquiredPillars) == 4 {
		return Won
	}

	return InProgress
}

// attack
func (g *Game) Attack(specialAttack bool) {

	room := g.TheMaze.Grid[g.TheMaze.CurrCoords.X][g.TheMaze.CurrCoords.Y]
	roomMonster := room.RoomMonster
	hero := g.TheHero

	if roomMonster == nil {
		return
	}

	if !specialAttack {
		roomMonster.CurrHealth -= hero.Attack
	} else {
		// implement later (special attack)
		roomMonster.CurrHealth -= hero.Attack
	}

	if roomMonster.CurrHealth > 0 {
		hero.CurrHealth -= roomMonster.Attack
	} else {
		room.RoomMonster = nil
	}
}
