package model

import (
	"database/sql"
	"fmt"
	"log"
)

// Hero Type with name, totalHealth, currHealth, and attack.
type Hero struct {
	Name           string   `json:"name"`
	TotalHealth    int      `json:"totalHealth"`
	CurrHealth     int      `json:"currHealth"`
	Attack         int      `json:"attack"`
	AquiredPillars []Pillar `json:"aquiredPillars"`
	AquiredPotions []Potion `json:"aquiredPotions"`
}

// hero type can be 4, 5, or 6
// 4 = healer
// 5 = giant
// 6 = barbarian

// Inits hero with totalHealth,
// currHealth, attack, and name.
func initHero(heroType int, db *sql.DB) *Hero {

	if 4 > heroType || heroType > 6 {
		fmt.Println("You did not enter hero 4, 5, or 6")
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

	fmt.Println(name, health, attack_dmg)

	return &Hero{
		Name:           name,
		TotalHealth:    health,
		CurrHealth:     health,
		Attack:         attack_dmg,
		AquiredPillars: make([]Pillar, 0),
		AquiredPotions: make([]Potion, 0),
	}
}
