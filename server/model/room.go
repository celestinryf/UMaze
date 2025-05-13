package model

import "math/rand"

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
func (r *Room) setUpRoom() {
	// if val is 10 or less add a pit
	pPit := 10
	// if val is 10 < x <= 20 add a monster
	pMon := 20
	// if val is 20 < x <= 30 add a potion
	pPot := 30
	// else nothing
	ranNum := rand.Intn(100)
	switch {
	case ranNum <= pPit:
		r.RoomType = pit
	case ranNum <= pMon:
		r.RoomMonster = initMonster()
	case ranNum <= pPot:
		r.PotionType = potion1
	}
}
