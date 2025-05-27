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
func InitGame(theHeroType int, db *sql.DB) *Game {
	return &Game{
		TheMaze: initMaze(db),
		TheHero: initHero(theHeroType, db),
	}
}

// Sets curr location to x and y
func (g *Game) Move(newCoords *Coords) GameStatus {

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
