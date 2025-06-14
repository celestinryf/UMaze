package model

import (
	"database/sql"
	"errors"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

// This represents the current game
type Game struct {
	TheMaze *Maze  `json:"Maze"`
	TheHero *Hero  `json:"Hero"`
	Status  string `json:"Status"`
}

// Gives an initialzed game.
func InitGame(theHeroType string, db *sql.DB, mazeSize int) (*Game, error) {

	hero, err := initHero(theHeroType, db)
	if err != nil {
		return nil, err
	}

	maze, err := initMaze(db, mazeSize)
	if err != nil {
		return nil, err
	}

	return &Game{
		TheMaze: maze,
		TheHero: hero,
		Status:  "InProgress",
	}, nil
}

// Sets curr location to x and y
func (g *Game) Move(newCoords *Coords) error {

	if newCoords == nil {
		return errors.New("coords are nil")
	}

	if g.TheMaze.Grid[g.TheMaze.CurrCoords.X][g.TheMaze.CurrCoords.Y].RoomMonster != nil ||
		g.TheMaze.Grid[g.TheMaze.CurrCoords.X][g.TheMaze.CurrCoords.Y].RoomType == "Wall" {
		return nil
	}

	g.TheMaze.CurrCoords = newCoords
	currRoom := g.TheMaze.Grid[newCoords.X][newCoords.Y]

	if currRoom.PotionType != "" {

		if currRoom.PotionType == "Health" {
			g.TheHero.AquiredPotions["Health"]++
		} else if currRoom.PotionType == "Attack" {
			g.TheHero.AquiredPotions["Attack"]++
		}

		currRoom.PotionType = ""
	}

	if currRoom.PillarType != "" {
		g.TheHero.AquiredPillars = append(g.TheHero.AquiredPillars, currRoom.PillarType)
		currRoom.PillarType = ""
	}

	if g.TheHero.Name != "MATT" && currRoom.RoomType == "Poop" {
		g.TheHero.CurrHealth -= 20 // can change the pit damage
	}

	if g.TheHero.CurrHealth < 1 && g.TheHero.Name == "CELESTIN" && g.TheHero.TotalHealth == 150 {
		g.TheHero.TotalHealth = 125
		g.TheHero.CurrHealth = g.TheHero.TotalHealth
	}

	if g.TheHero.CurrHealth <= 0 {
		g.Status = "Lost"
		return nil
	}

	if currRoom.RoomType == "Exit" && len(g.TheHero.AquiredPillars) == 4 {
		g.Status = "Won"
		return nil
	}

	return nil
}

// attack given a bool of whether or not the user is
// doing a special attack.
func (g *Game) Attack(specialAttack bool) {

	room := g.TheMaze.Grid[g.TheMaze.CurrCoords.X][g.TheMaze.CurrCoords.Y]
	roomMonster := room.RoomMonster
	hero := g.TheHero

	if roomMonster == nil || (specialAttack && hero.CurrCoolDown != 0) {
		return
	}

	if specialAttack {
		if hero.Name == "CELESTIN" {
			roomMonster.CurrHealth /= 2
		} else if hero.Name == "PRIMO" {
			hero.CurrHealth -= 20 // health that gets taken off w/ ability
			hero.Attack += 10     // attack that gets added w/ ability
		} else if hero.Name == "NICK" {
			hero.CurrHealth -= 20 // recoil from attack
			roomMonster.CurrHealth -= hero.Attack + hero.Attack/2
		} else if hero.Name == "MATT" {
			initHealth := roomMonster.CurrHealth
			roomMonster.CurrHealth -= hero.Attack
			roomMonster.CurrHealth = max(0, roomMonster.CurrHealth)
			hero.CurrHealth += (initHealth - roomMonster.CurrHealth) / 2
		}
		hero.CurrCoolDown = hero.CoolDown
	} else {
		// (normal attack)
		roomMonster.CurrHealth -= hero.Attack
		hero.CurrCoolDown = max(0, hero.CurrCoolDown-1)
	}

	// get attacked by the monster
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
