package model

import (
	"database/sql"
	"log"
)

type HeroType int

const (
	Matt HeroType = iota + 4
	Primo
	Nick
	Celestin
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
func initHero(heroType HeroType, db *sql.DB) *Hero {
	var (
		name               string
		health, attack_dmg int
	)
	err := db.QueryRow("SELECT name, health, attack_dmg FROM entities WHERE id = ?", heroType).Scan(&name, &health, &attack_dmg)
	if err != nil {
		log.Fatal(err)
	}
	temp := &Hero{
		Name:           name,
		TotalHealth:    health,
		CurrHealth:     health,
		Attack:         attack_dmg,
		AquiredPillars: make([]Pillar, 0),
		AquiredPotions: make([]Potion, 0),
	}
	if temp.Name == "MATT" {
		temp.AquiredPotions = append(temp.AquiredPotions, HealingPotion, AttackPotion)
	}
	return temp
}
