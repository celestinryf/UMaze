package model

import (
	"database/sql"
	"log"
	"math/rand"
)

// for room Type enums
type RoomTypes int

// room enums
const (
	wall RoomTypes = iota
	start
	end
	path
	pit
)

// for pillar type enums
type Pillar int

// pillar enums
const (
	noPillar Pillar = iota
	pillar1
	pillar2
	pillar3
	pillar4
)

// potion types
type Potion int

// potion enums
const (
	NoPotion Potion = iota
	Potion1
	Potion2
	Potion3
)

// Rooms make up the maze
type Room struct {
	RoomType    RoomTypes `json:"RoomType"`
	RoomMonster *Monster  `json:"RoomMonster"`
	PillarType  Pillar    `json:"PillarType"`
	PotionType  Potion    `json:"PotionType"`
}

// Inits and returns a room based on
// whether we canPass through or not.
func InitRoom(isPath bool) *Room {
	var roomType RoomTypes
	if isPath {
		roomType = path
	} else {
		roomType = wall
	}
	return &Room{
		RoomType:    roomType,
		PillarType:  noPillar,
		PotionType:  NoPotion,
		RoomMonster: nil,
	}
}

// sets up rooms with pits, potions, and monsters
func (r *Room) SetUpRoom(db *sql.DB) {

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

	switch id {
	case 1:
		r.RoomType = pit
	case 2:
		r.RoomMonster = initMonster(db)
	case 3:
		potion := rand.Intn(3) + 1
		switch potion {
		case 1:
			r.PotionType = Potion1
		case 2:
			r.PotionType = Potion2
		case 3:
			r.PotionType = Potion3
		}
	}
}
