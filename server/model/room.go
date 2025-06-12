package model

import (
	"database/sql"
	"errors"
	"math/rand"
)

// Rooms make up the maze
type Room struct {
	RoomType    string   `json:"RoomType"`
	PillarType  string   `json:"PillarType,omitempty"`
	PotionType  string   `json:"PotionType,omitempty"`
	RoomMonster *Monster `json:"RoomMonster,omitempty"`
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

// Returns a function that can set up a room
// Sets it up with pits, potions, and mosnters
func getSetUpRoom(db *sql.DB) (func(*Room) error, error) {

	roomRates, err := db.Query("SELECT Name, Rate FROM spawn_rate WHERE Category = 'Room'")
	if err != nil {
		return nil, err
	}
	defer roomRates.Close()
	potionRates, err := db.Query("SELECT Name, Rate FROM spawn_rate WHERE Category = 'Potion'")
	if err != nil {
		return nil, err
	}
	defer potionRates.Close()

	type itemRate struct {
		name string
		rate int
	}

	roomRateArr := make([]itemRate, 0)
	for roomRates.Next() {
		var currItem itemRate
		err = roomRates.Scan(&currItem.name, &currItem.rate)
		if err != nil {
			return nil, err
		}
		roomRateArr = append(roomRateArr, currItem)
	}

	potionRateArr := make([]itemRate, 0)
	for potionRates.Next() {
		var currItem itemRate
		err = potionRates.Scan(&currItem.name, &currItem.rate)
		if err != nil {
			return nil, err
		}
		potionRateArr = append(potionRateArr, currItem)
	}

	chooseRand := func(arr []itemRate) string {
		sumRates := 0
		for _, item := range arr {
			sumRates += item.rate
		}
		if sumRates == 0 {
			return ""
		}
		r := rand.Intn(100)
		if sumRates < 100 {
			nilRange := 100 - sumRates
			if r < nilRange {
				return ""
			}
			r -= nilRange
		}
		cumulative := 0
		for _, item := range arr {
			cumulative += item.rate
			if r < cumulative {
				return item.name
			}
		}
		return ""
	}

	return func(room *Room) error {
		if room == nil {
			return errors.New("gave nil room")
		}
		roomItem := chooseRand(roomRateArr)
		switch roomItem {
		case "Monster":
			monster, err := initMonster(db)
			if err != nil {
				return err
			}
			room.RoomMonster = monster
		case "Potion":
			potion := chooseRand(potionRateArr)
			switch potion {
			case "Health", "Attack":
				room.PotionType = potion
			case "":
				break
			default:
				return errors.New("potion not implemented")
			}
		case "Poop":
			room.RoomType = roomItem
		case "":
			break
		default:
			return errors.New("not implemented room item")
		}
		return nil
	}, nil
}
