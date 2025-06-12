package model

import (
	"database/sql"
	"log"
	"math/rand"
)

// Rooms make up the maze
type Room struct {
	RoomMonster *Monster `json:"RoomMonster"`
	RoomType    string   `json:"RoomType"`
	PillarType  string   `json:"PillarType"`
	PotionType  string   `json:"PotionType"`
}

// Inits and returns a room based on
// whether we canPass through or not.
func InitRoom(isPath bool) *Room {
	var roomType string
	if isPath {
		roomType = "Path"
	} else {
		roomType = "Wall"
	}
	return &Room{
		RoomType:    roomType,
		PillarType:  "",
		PotionType:  "",
		RoomMonster: nil,
	}
}

// sets up rooms with pits, potions, and monsters
func (r *Room) SetUpRoom(db *sql.DB) error {

	probs, err := db.Query("SELECT * FROM spawn_rates")
	if err != nil {
		return err
	}
	defer probs.Close()

	ranNum := rand.Intn(100) // random number generated

	currProb := 0 // curr number from probabilities
	id := 0       // curr id, at end of loop it will be 1->3

	for probs.Next() {
		var prob, currId int
		err = probs.Scan(&currId, &prob)
		if err != nil {
			log.Fatal(err)
		}
		currProb += prob
		if currProb >= ranNum {
			id = currId
			break
		}
	}

	switch id {
	case 1:
		r.RoomType = "Poop"
	case 2:
		r.RoomMonster, _ = initMonster(db)
	case 3:
		potion := rand.Intn(2) + 1
		switch potion {
		case 1:
			r.PotionType = "Health"
		case 2:
			r.PotionType = "Attack"
		}
	}

	return nil
}
