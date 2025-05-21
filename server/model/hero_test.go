package model

import (
	"database/sql"
	"testing"
)

// Test initing a new healer
func TestInitHeroHealer(t *testing.T) {

	db, err := sql.Open("sqlite3", "../db/360Game.db")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	hero := initHero(4, db)

	if hero == nil {
		t.Fatal("hero is nil")
	}

	if hero.Name != "HEALER" {
		t.Error("Name is not healer")
	}

	if hero.TotalHealth != 175 || hero.CurrHealth != 175 {
		t.Error("Health not valid")
	}

	if hero.Attack != 15 {
		t.Error("Attack is not valid")
	}

	if len(hero.AquiredPillars) != 0 || len(hero.AquiredPotions) != 0 {
		t.Error("Aquired items not empty")
	}

}

// Test initing a new giant
func TestInitHeroGiant(t *testing.T) {

	db, err := sql.Open("sqlite3", "../db/360Game.db")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	hero := initHero(5, db)

	if hero == nil {
		t.Fatal("hero is nil")
	}

	if hero.Name != "GIANT" {
		t.Error("Name is not giant")
	}

	if hero.TotalHealth != 250 || hero.CurrHealth != 250 {
		t.Error("Health not valid")
	}

	if hero.Attack != 20 {
		t.Error("Attack is not valid")
	}

	if len(hero.AquiredPillars) != 0 || len(hero.AquiredPotions) != 0 {
		t.Error("Aquired items not empty")
	}

}

// Test initing a new barb
func TestInitHeroBarb(t *testing.T) {

	db, err := sql.Open("sqlite3", "../db/360Game.db")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	hero := initHero(6, db)

	if hero == nil {
		t.Fatal("hero is nil")
	}

	if hero.Name != "BARBARIAN" {
		t.Error("Name is not barb")
	}

	if hero.TotalHealth != 200 || hero.CurrHealth != 200 {
		t.Error("Health not valid")
	}

	if hero.Attack != 25 {
		t.Error("Attack is not valid")
	}

	if len(hero.AquiredPillars) != 0 || len(hero.AquiredPotions) != 0 {
		t.Error("Aquired items not empty")
	}

}

// Test initing a new hero w/ invalid vals
func TestInitHeroInvalid(t *testing.T) {

	db, err := sql.Open("sqlite3", "../db/360Game.db")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	hero := initHero(0, db)
	if hero != nil {
		t.Error("Should not allow this val")
	}

	hero = initHero(100, db)
	if hero != nil {
		t.Error("Should not allow this val")
	}

	hero = initHero(3, db)
	if hero != nil {
		t.Error("Should not allow this val")
	}

	hero = initHero(10, db)
	if hero != nil {
		t.Error("Should not allow this val")
	}

	hero = initHero(-1, db)
	if hero != nil {
		t.Error("Should not allow this val")
	}
}
