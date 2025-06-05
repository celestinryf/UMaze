package model

import (
	"database/sql"
	"testing"
)

// Test initing a new Matthew
func TestInitMatt(t *testing.T) {

	db, err := sql.Open("libsql", "../db/360Game.db")
	if err != nil {
		t.Fatal("failed to open db")
	}
	defer db.Close()

	hero := initHero(Matt, db)

	if hero == nil {
		t.Fatal("hero is nil")
	}

	if hero.Name != "MATT" {
		t.Error("Name not Matt")
	}

	if hero.TotalHealth != 250 || hero.CurrHealth != 250 {
		t.Error("Matt health not valid")
	}

	if hero.Attack != 25 {
		t.Error("Matt attack not valid")
	}

	if len(hero.AquiredPillars) != 0 || len(hero.AquiredPotions) != 0 {
		t.Error("Aquired items not empty")
	}

}

// Test initing a new Primo
func TestInitPrimo(t *testing.T) {

	db, err := sql.Open("sqlite3", "../db/360Game.db")
	if err != nil {
		t.Fatal("failed to open db")
	}
	defer db.Close()

	hero := initHero(Primo, db)

	if hero == nil {
		t.Fatal("hero is nil")
	}

	if hero.Name != "PRIMO" {
		t.Error("Name not Matt")
	}

	if hero.TotalHealth != 220 || hero.CurrHealth != 220 {
		t.Error("Matt health not valid")
	}

	if hero.Attack != 15 {
		t.Error("Matt attack not valid")
	}

	if len(hero.AquiredPillars) != 0 || len(hero.AquiredPotions) != 0 {
		t.Error("Aquired items not empty")
	}

}

// Test initing a new Nick
func TestInitNick(t *testing.T) {

	db, err := sql.Open("sqlite3", "../db/360Game.db")
	if err != nil {
		t.Fatal("failed to open db")
	}
	defer db.Close()

	hero := initHero(Nick, db)

	if hero == nil {
		t.Fatal("hero is nil")
	}

	if hero.Name != "NICK" {
		t.Error("Name not Matt")
	}

	if hero.TotalHealth != 200 || hero.CurrHealth != 200 {
		t.Error("Matt health not valid")
	}

	if hero.Attack != 30 {
		t.Error("Matt attack not valid")
	}

	if len(hero.AquiredPillars) != 0 || len(hero.AquiredPotions) != 0 {
		t.Error("Aquired items not empty")
	}
}

// Init Celestin
func TestInitCelestin(t *testing.T) {

	db, err := sql.Open("sqlite3", "../db/360Game.db")
	if err != nil {
		t.Fatal("failed to open db")
	}
	defer db.Close()

	hero := initHero(Celestin, db)

	if hero == nil {
		t.Fatal("hero is nil")
	}

	if hero.Name != "CELESTIN" {
		t.Error("Name not Matt")
	}

	if hero.TotalHealth != 150 || hero.CurrHealth != 150 {
		t.Error("Matt health not valid")
	}

	if hero.Attack != 20 {
		t.Error("Matt attack not valid")
	}

	if len(hero.AquiredPillars) != 0 || len(hero.AquiredPotions) != 0 {
		t.Error("Aquired items not empty")
	}

}
