package model

// import (
// 	"database/sql"
// 	"log"
// 	"testing"
// )

// // test the init room
// func TestInitRoomPath(t *testing.T) {
// 	room := InitRoom(true)
// 	if room.RoomType != path {
// 		t.Error("Should be a path")
// 	}
// 	if room.PillarType != noPillar {
// 		t.Error("Should be no pillar")
// 	}
// 	if room.PotionType != noPotion {
// 		t.Error("Should be no potion")
// 	}
// 	if room.RoomMonster != nil {
// 		t.Error("Room monster should be nil")
// 	}
// }

// // test the init room
// func TestInitRoomWall(t *testing.T) {
// 	room := InitRoom(false)
// 	if room.RoomType != wall {
// 		t.Error("Should be a path")
// 	}
// 	if room.PillarType != noPillar {
// 		t.Error("Should be no pillar")
// 	}
// 	if room.PotionType != noPotion {
// 		t.Error("Should be no potion")
// 	}
// 	if room.RoomMonster != nil {
// 		t.Error("Room monster should be nil")
// 	}
// }

// // Ensures only room only has one feature at a time
// // Use go test -v to see rates over n tries
// func TestSetUpRoom(t *testing.T) {
// 	db, err := sql.Open("sqlite3", "../db/360Game.db")
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer db.Close()

// 	const trials = 10000
// 	counts := map[string]int{
// 		"pit":     0,
// 		"monster": 0,
// 		"potion":  0,
// 		"none":    0,
// 	}

// 	for range trials {
// 		room := InitRoom(true)
// 		room.SetUpRoom(db)
// 		features := 0
// 		if room.RoomType == pit {
// 			features++
// 			counts["pit"]++
// 		}
// 		if room.RoomMonster != nil {
// 			features++
// 			counts["monster"]++
// 		}
// 		if room.PotionType != noPotion {
// 			features++
// 			counts["potion"]++
// 		}
// 		if features == 0 {
// 			counts["none"]++
// 		}
// 		if features > 1 {
// 			t.Errorf("Room has multiple features set: %+v", room)
// 		}
// 	}
// 	t.Logf("Out of %d rooms:", trials)
// 	for k, v := range counts {
// 		percentage := float64(v) / float64(trials) * 100
// 		t.Logf("%s: %d (%.2f%%)", k, v, percentage)
// 	}
// }
