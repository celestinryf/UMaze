package model

import (
	"database/sql"
	"errors"
)

// Hold values associated with a monster
type Monster struct {
	Name        string `json:"Name"`
	TotalHealth int    `json:"TotalHealth"`
	CurrHealth  int    `json:"CurrHealth"`
	Attack      int    `json:"Attack"`
}

// inits a random monster
func initMonster(db *sql.DB) (*Monster, error) {

	if db == nil {
		return nil, errors.New("Database is nil")
	}

	var (
		name           string
		health, attack int
	)

	// Query random monster from the db
	err := db.QueryRow("SELECT name, health, attack FROM monsters ORDER BY RANDOM() LIMIT 1").Scan(&name, &health, &attack)
	if err != nil {
		return nil, err
	}

	return &Monster{
		Name:        name,
		TotalHealth: health,
		CurrHealth:  health,
		Attack:      attack,
	}, nil

}
