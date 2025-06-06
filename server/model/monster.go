package model

import (
	"database/sql"
	"log"
	"math/rand"
)

// Monster type with name, totalHealth,
// currHealth, and attack
type Monster struct {
	Name        string `json:"Name"`
	TotalHealth int    `json:"TotalHealth"`
	CurrHealth  int    `json:"CurrHealth"`
	Attack      int    `json:"Attack"`
}

// inits a random monster
func initMonster(db *sql.DB) *Monster {

	var (
		name               string
		health, attack_dmg int
	)

	err := db.QueryRow("SELECT name, health, attack_dmg FROM entities WHERE id = ?", rand.Intn(3)+1).
		Scan(&name, &health, &attack_dmg)
	if err != nil {
		log.Fatal(err)
	}

	return &Monster{
		Name:        name,
		TotalHealth: health,
		CurrHealth:  health,
		Attack:      attack_dmg,
	}
}
