package model

import (
	"database/sql"
	"fmt"
	"log"
	"math/rand"
)

// for room Type enums
type RoomTypes int

// for pillar type enums
type Pillar int

// potion types
type Potion int

// room enums
const (
	wall RoomTypes = iota
	start
	end
	path
	pit
)

// pillar enums
const (
	pillar1 Pillar = iota
	pillar2
	pillar3
	pillar4
	noPillar
)

// potion enums
const (
	potion1 Potion = iota
	potion2
)

// Rooms make up the maze
// currently has canPass and roomMonster
type Room struct {
	RoomType    RoomTypes `json:"RoomType"`
	RoomMonster *Monster  `json:"RoomMonster"`
	PillarType  Pillar    `json:"PillarType"`
	PotionType  Potion    `json:"PotionType"`
}

// Inits and returns a room based on
// whether we canPass through or not.
func initRoom(theRoomTypes RoomTypes) *Room {
	return &Room{
		RoomType:   theRoomTypes,
		PillarType: noPillar,
	}
}

// sets up rooms with pits, potions, and monsters
func (r *Room) setUpRoom(db *sql.DB) {

	probs, err := db.Query("SELECT * FROM spawn_rates")
	if err != nil {
		log.Fatal(err)
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

	fmt.Println(id)

	switch id {
	case 1:
		r.RoomType = pit
	case 2:
		r.RoomMonster = initMonster(db)
	case 3:
		r.PotionType = potion1
	}

}
