package model

import (
	"database/sql"
	"fmt"
	"log"
)

// Hero Type with name, totalHealth, currHealth, and attack.
type Hero struct {
	Name           string   `json:"Name"`
	TotalHealth    int      `json:"TotalHealh"`
	CurrHealth     int      `json:"CurrHealth"`
	Attack         int      `json:"Attack"`
	AquiredPillars []Pillar `json:"AquiredPillars"`
	AquiredPotions []Potion `json:"AquiredPotions"`
}

// Inits hero with totalHealth,
// currHealth, attack, and name.
func initHero(heroType int, db *sql.DB) *Hero {

	if heroType < 4 || heroType > 6 {
		fmt.Println("Not sending in a hero 4-6")
		return nil
	}

	hero_stats, err := db.Query("SELECT name, health, attack_dmg FROM entities WHERE id = ?", heroType)
	if err != nil {
		log.Fatal(err)
	}
	defer hero_stats.Close()

	var (
		name               string
		health, attack_dmg int
	)

	hero_stats.Next()
	err = hero_stats.Scan(&name, &health, &attack_dmg)
	if err != nil {
		log.Fatal(err)
	}

	return &Hero{
		Name:           name,
		TotalHealth:    health,
		CurrHealth:     health,
		Attack:         attack_dmg,
		AquiredPillars: make([]Pillar, 0),
		AquiredPotions: make([]Potion, 0),
	}
}
