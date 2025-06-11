package model

import (
	"database/sql"
	"log"
)

// All stats associated with a hero
type Hero struct {
	Name           string         `json:"Name"`
	TotalHealth    int            `json:"TotalHealth"`
	CurrHealth     int            `json:"CurrHealth"`
	Attack         int            `json:"Attack"`
	CoolDown       int            `json:"CoolDown"`
	CurrCoolDown   int            `json:"CurrCoolDown"`
	AquiredPillars []string       `json:"AquiredPillars"`
	AquiredPotions map[string]int `json:"AquiredPotions"`
}

// Inits hero based on a heroName (must match one in db)
// Returns a pointer to a new hero
func initHero(heroName string, db *sql.DB) *Hero {

	var (
		health   int
		attack   int
		cooldown int
	)

	err := db.QueryRow("SELECT health, attack, cooldown FROM heroes WHERE name = ?", heroName).Scan(&health, &attack, &cooldown)
	if err != nil {
		log.Fatal(err)
	}

	// make sure the hero was in db
	if health == 0 || attack == 0 {
		log.Fatal("Invalid hero name passed into initHero")
	}

	temp := &Hero{
		Name:           heroName,
		TotalHealth:    health,
		CurrHealth:     health,
		Attack:         attack,
		CoolDown:       cooldown,
		CurrCoolDown:   cooldown,
		AquiredPillars: make([]string, 0),
		AquiredPotions: make(map[string]int, 2),
	}

	if heroName == "NICK" {
		temp.AquiredPotions["Attack"] = 1
		temp.AquiredPotions["Health"] = 1
	} else {
		temp.AquiredPotions["Attack"] = 0
		temp.AquiredPotions["Health"] = 0
	}

	return temp
}
