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
	AquiredPillars []Pillar       `json:"AquiredPillars"`
	AquiredPotions map[Potion]int `json:"AquiredPotions"`
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
		AquiredPillars: make([]Pillar, 4),
		AquiredPotions: make(map[Potion]int, 2),
	}

	if heroName == "NICK" {
		temp.AquiredPotions[AttackPotion] = 1
		temp.AquiredPotions[HealingPotion] = 1
	} else {
		temp.AquiredPotions[AttackPotion] = 0
		temp.AquiredPotions[HealingPotion] = 0
	}

	return temp
}
