package model

import (
	"database/sql"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

// This represents the current game
type Game struct {
	TheMaze *Maze  `json:"Maze"`
	TheHero *Hero  `json:"Hero"`
	Status  string `json:"Status"`
}

// Gives an initialzed game.
func InitGame(theHeroType HeroType, db *sql.DB, mazeSize int) *Game {
	return &Game{
		TheMaze: initMaze(db, mazeSize),
		TheHero: initHero(theHeroType, db),
		Status:  "InProgress",
	}
}

// Sets curr location to x and y
func (g *Game) Move(newCoords *Coords) {

	if g.TheMaze.Grid[g.TheMaze.Coords.X][g.TheMaze.Coords.Y].RoomMonster != nil {
		return
	}

	if g.TheMaze.Grid[g.TheMaze.Coords.X][g.TheMaze.Coords.Y].RoomType == wall {
		return
	}

	g.TheMaze.Coords = *newCoords
	currRoom := g.TheMaze.Grid[newCoords.X][newCoords.Y]

	if currRoom.PotionType != NoPotion {
		g.TheHero.AquiredPotions = append(g.TheHero.AquiredPotions, currRoom.PotionType)
		currRoom.PotionType = NoPotion
	}

	if currRoom.PillarType != noPillar {
		g.TheHero.AquiredPillars = append(g.TheHero.AquiredPillars, currRoom.PillarType)
		currRoom.PillarType = noPillar
	}

	if g.TheHero.Name != "NICK" && currRoom.RoomType == pit {
		g.TheHero.CurrHealth -= 20 // can change the pit damage
	}

	if g.TheHero.CurrHealth < 1 && g.TheHero.Name == "CELESTIN" && g.TheHero.TotalHealth == 150 {
		g.TheHero.TotalHealth = 125
		g.TheHero.CurrHealth = g.TheHero.TotalHealth
	}

	if g.TheHero.CurrHealth <= 0 {
		g.Status = "Lost"
		return
	}

	if currRoom.RoomType == end && len(g.TheHero.AquiredPillars) == 4 {
		g.Status = "Won"
		return
	}
}

// attack
func (g *Game) Attack() {

	room := g.TheMaze.Grid[g.TheMaze.Coords.X][g.TheMaze.Coords.Y]
	roomMonster := room.RoomMonster
	hero := g.TheHero

	if roomMonster == nil {
		return
	}

	roomMonster.CurrHealth -= hero.Attack
	if roomMonster.CurrHealth > 0 {
		hero.CurrHealth -= roomMonster.Attack
		if g.TheHero.CurrHealth < 1 && g.TheHero.Name == "CELESTIN" && g.TheHero.TotalHealth == 150 {
			g.TheHero.TotalHealth = 125
			g.TheHero.CurrHealth = g.TheHero.TotalHealth
		}
	} else {
		room.RoomMonster = nil
	}

	if g.TheHero.CurrHealth <= 0 {
		g.Status = "Lost"
	}

}
