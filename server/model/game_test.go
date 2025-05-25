package model

// import (
// 	"database/sql"
// 	"testing"
// )

// // Test initGame method
// func TestInitGame(t *testing.T) {

// 	db, err := sql.Open("sqlite3", "../db/360Game.db")
// 	if err != nil {
// 		t.Fatal(err)
// 	}

// 	InitGame(0, db)
// 	if MyGame != nil {
// 		t.Error("Game should not me set")
// 	}

// 	InitGame(4, db)
// 	if MyGame == nil {
// 		t.Fatal("Game should init")
// 	}
// 	if MyGame.TheHero.Name != "HEALER" {
// 		t.Error("Should have set to healer")
// 	}
// 	if MyGame.TheMaze == nil {
// 		t.Error("Maze was never set")
// 	}

// 	InitGame(5, db)
// 	if MyGame == nil {
// 		t.Fatal("Game should init")
// 	}
// 	if MyGame.TheHero.Name != "GIANT" {
// 		t.Error("Should have set to GIANT")
// 	}
// 	if MyGame.TheMaze == nil {
// 		t.Error("Maze was never set")
// 	}

// 	InitGame(6, db)
// 	if MyGame == nil {
// 		t.Fatal("Game should init")
// 	}
// 	if MyGame.TheHero.Name != "BARBARIAN" {
// 		t.Error("Should have set to barbarian")
// 	}
// 	if MyGame.TheMaze == nil {
// 		t.Error("Maze was never set")
// 	}
// }

// // test retrieve game
// // test get stored games
// // test store game
// // func TestStoreGame(t *testing.T) {

// // 	// open db
// // 	dbPath := ":memory:"
// // 	db, err := sql.Open("sqlite3", dbPath)
// // 	if err != nil {
// // 		t.Fatal(err)
// // 	}
// // 	defer db.Close()

// // 	// store nil game
// // 	StoreGame("ShouldNotStore", db)
// // 	// db should be empty
// // 	nilQuery, err := db.Query("SELECT * FROM saved_games")
// // 	if err != nil {
// // 		t.Fatal(err)
// // 	}
// // 	defer nilQuery.Close()
// // 	if nilQuery.Next() {
// // 		t.Error("Should not save empty game")
// // 	}

// // Init valid game
// // init a game
// // store it
// // make sure there is a game in there
// // check briefly if game is valid
// // make sure id == 1
// // make sure name == "Game1"
// // make sure info.hero.name == "healer"
// // make sure the maze is the same
// // make sure data == today

// // init another game
// // store it as well
// // make sure both games are there
// // make sure og game is there
// // Now check game two by doing the following
// // make sure id == 2
// // make sure name == "Game2"
// // make sure info.hero.name == "Giant"
// // make sure the maze is the same
// // make sure data == today

// //}

// // 	// Store a valid game
// // 	InitGame(4, dbPath) // 4 → Healer (assumed from your logic)
// // 	StoreGame("Game1", dbPath)

// // 	var (
// // 		id   int
// // 		name string
// // 		info string
// // 		date string
// // 	)

// // 	row := db.QueryRow("SELECT id, name, info, date FROM saved_games WHERE name = ?", "Game1")
// // 	err = row.Scan(&id, &name, &info, &date)
// // 	if err != nil {
// // 		t.Fatal(err)
// // 	}

// // 	// Assertions
// // 	if id != 1 {
// // 		t.Errorf("Expected id = 1, got %d", id)
// // 	}

// // 	if name != "Game1" {
// // 		t.Errorf("Expected name = Game1, got %s", name)
// // 	}

// // 	// Validate date is today
// // 	expectedDate := time.Now().Format("1/2/06") // Go's date formatting
// // 	if date != expectedDate {
// // 		t.Errorf("Expected date = %s, got %s", expectedDate, date)
// // 	}

// // 	// Unmarshal JSON info
// // 	var storedGame Game
// // 	err = json.Unmarshal([]byte(info), &storedGame)
// // 	if err != nil {
// // 		t.Fatal("Failed to parse JSON game info:", err)
// // 	}

// // 	if storedGame.TheHero == nil || storedGame.TheHero.Name != "healer" {
// // 		t.Errorf("Expected hero name = healer, got %v", storedGame.TheHero)
// // 	}

// // 	// You can compare mazes here if you add an Equal method to Maze
// // 	// For now, assume TheMaze is not nil
// // 	if storedGame.TheMaze == nil {
// // 		t.Error("Expected maze to be non-nil")
// // 	}

// // 	// Now store another game
// // 	InitGame(5, dbPath) // 5 → Warrior?
// // 	StoreGame("Game2", dbPath)

// // 	// Make sure we now have 2 games
// // 	row = db.QueryRow("SELECT COUNT(*) FROM saved_games")
// // 	var count int
// // 	err = row.Scan(&count)
// // 	if err != nil {
// // 		t.Fatal(err)
// // 	}
// // 	if count != 2 {
// // 		t.Errorf("Expected 2 games in db, got %d", count)
// // 	}
// // }
