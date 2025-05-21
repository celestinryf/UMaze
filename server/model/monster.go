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

	monsterType := rand.Intn(3) + 1
	monster_stats, err := db.Query("SELECT name, health, attack_dmg FROM entities WHERE id = ?", monsterType)

	if err != nil {
		log.Fatal(err)
	}
	defer monster_stats.Close()

	var (
		name       string
		health     int
		attack_dmg int
	)

	monster_stats.Next()
	err = monster_stats.Scan(&name, &health, &attack_dmg)
	if err != nil {
		log.Fatal(err)
	}

	newMonster := &Monster{
		Name:        name,
		TotalHealth: health,
		CurrHealth:  health,
		Attack:      attack_dmg,
	}
	return newMonster
}
