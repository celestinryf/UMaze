package model

import (
	"database/sql"
	"testing"
)

// Tests the init monster function
func TestInitMonster(t *testing.T) {

	db, err := sql.Open("sqlite3", "../db/360Game.db")
	if err != nil {
		t.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	test_monster := initMonster(db)

	// check if monster is nil
	if test_monster == nil {
		t.Fatal("monster is nil")
	}

	// make sure the monster name isn't nil
	if test_monster.Name == "" {
		t.Error("monster name is empty")
	}

	// make sure it has total and curr health are equal
	if test_monster.TotalHealth != test_monster.CurrHealth {
		t.Error("Total health is not equal to current health")
	}

	// make sure that the curr health and total heal > 0
	if test_monster.TotalHealth < 1 {
		t.Error("Invalid health")
	}

	// make sure that attack is >= 0
	if test_monster.Attack < 1 {
		t.Error("Invalid Attack")
	}
}
