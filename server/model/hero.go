package model

import (
	"database/sql"
	"log"
)

const CooldownTime = 4

type HeroType int

const (
	Matt HeroType = iota + 4
	Primo
	Nick
	Celestin
)

// Hero Type with name, totalHealth, currHealth, and attack.vssdvs
type Hero struct {
	Name           string         `json:"Name"`
	TotalHealth    int            `json:"TotalHealth"`
	CurrHealth     int            `json:"CurrHealth"`
	Attack         int            `json:"Attack"`
	CoolDown       int            `json:"CoolDown"`
	AquiredPillars []Pillar       `json:"AquiredPillars"`
	AquiredPotions map[Potion]int `json:"AquiredPotions"`
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
		CoolDown:       CooldownTime,
		AquiredPillars: make([]Pillar, 0),
		AquiredPotions: make(map[Potion]int, 0),
	}

	temp.AquiredPotions[AttackPotion] = 0
	temp.AquiredPotions[HealingPotion] = 0

	if temp.Name == "MATT" {
		temp.AquiredPotions[AttackPotion]++
		temp.AquiredPotions[HealingPotion]++
	}

	return temp
}
