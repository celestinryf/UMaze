package model

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
)

// Monster type with name, totalHealth,
// currHealth, and attack
type Monster struct {
	Name        string `json:"name"`
	TotalHealth int    `json:"totalHealth"`
	CurrHealth  int    `json:"currHealth"`
	Attack      int    `json:"attack"`
}

// set up monster types
// 1 = skeleton
// 2 = zombie
// 3 = spider

// inits a default monster
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

	fmt.Println(name, health, attack_dmg)

	// rows, err := db.Query("SELECT name, health, attack_dmg FROM entities;")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer rows.Close()

	// for rows.Next() {

	// 	var (
	// 		name               string
	// 		health, attack_dmg int
	// 	)

	// 	err = rows.Scan(&name, &health, &attack_dmg)
	// 	if err != nil {
	// 		log.Fatal(err)
	// 	}
	// 	fmt.Println(name, health, attack_dmg)
	// }

	newMonster := &Monster{
		Name:        name,
		TotalHealth: health,
		CurrHealth:  health,
		Attack:      attack_dmg,
	}
	return newMonster
}
