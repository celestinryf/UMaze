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
func InitGame(theHeroType string, db *sql.DB, mazeSize int) *Game {
	return &Game{
		TheMaze: initMaze(db, mazeSize),
		TheHero: initHero(theHeroType, db),
		Status:  "InProgress",
	}
}

// Sets curr location to x and y
func (g *Game) Move(newCoords *Coords) {

	if g.TheMaze.Grid[g.TheMaze.CurrCoords.X][g.TheMaze.CurrCoords.Y].RoomMonster != nil {
		return
	}

	if g.TheMaze.Grid[g.TheMaze.CurrCoords.X][g.TheMaze.CurrCoords.Y].RoomType == wall {
		return
	}

	g.TheMaze.CurrCoords = newCoords
	currRoom := g.TheMaze.Grid[newCoords.X][newCoords.Y]

	if currRoom.PotionType != NoPotion {

		if currRoom.PotionType == HealingPotion {
			g.TheHero.AquiredPotions["Health"]++
		} else if currRoom.PotionType == AttackPotion {
			g.TheHero.AquiredPotions["Attack"]++
		}

		currRoom.PotionType = NoPotion
	}

	if currRoom.PillarType != noPillar {
		g.TheHero.AquiredPillars = append(g.TheHero.AquiredPillars, currRoom.PillarType)
		currRoom.PillarType = noPillar
	}

	if g.TheHero.Name != "MATT" && currRoom.RoomType == pit {
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
func (g *Game) Attack(specialAttack bool) {

	// fix curr vs normal cooldown

	room := g.TheMaze.Grid[g.TheMaze.CurrCoords.X][g.TheMaze.CurrCoords.Y]
	roomMonster := room.RoomMonster
	hero := g.TheHero

	if roomMonster == nil || (specialAttack && hero.CurrCoolDown != 0) {
		return
	}

	// attack the monster
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
