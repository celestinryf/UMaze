package model

import "math/rand"

// for room Type enums
type roomTypes int

// for pillar type enums
type pillar int

// potion types
type potion int

// room enums
const (
	wall roomTypes = iota
	start
	end
	path
	pit
)

// pillar enums
const (
	pillar1 pillar = iota
	pillar2
	pillar3
	pillar4
	noPillar
)

// potion enums
const (
	potion1 potion = iota
	potion2
)

// Rooms make up the maze
// currently has canPass and roomMonster
type room struct {
	roomType    roomTypes
	roomMonster *monster
	pillarType  pillar
	potionType  potion
}

// Inits and returns a room based on
// whether we canPass through or not.
func initRoom(theRoomTypes roomTypes) *room {
	return &room{
		roomType:   theRoomTypes,
		pillarType: noPillar,
	}
}

// sets up rooms with pits, potions, and monsters
func (r *room) setUpRoom() {
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
		r.roomType = pit
	case ranNum <= pMon:
		r.roomMonster = initMonster()
	case ranNum <= pPot:
		r.potionType = potion1
	}
}
