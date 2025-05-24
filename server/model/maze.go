package model

import (
	"database/sql"
	"math/rand"
)

// maze has dimensions of mazeSize * mazeSize
const mazeSize = 7

// Coordinates of the player
type Coords struct {
	X int `json:"x"`
	Y int `json:"y"`
}

// Holds the grid of the maze.
type Maze struct {
	Grid       [mazeSize][mazeSize]*Room `json:"Grid"`
	CurrCoords *Coords                   `json:"coords"`
}

// Gives the status of the game
type GameStatus int

// Game Status enums
const (
	Won GameStatus = iota
	Lost
	InProgress
)

// inits the maze struct and returns a pointer to a maze
func initMaze(db *sql.DB) *Maze {

	newMaze := Maze{
		Grid:       newGrid(),
		CurrCoords: nil,
	}

	validRooms := make([]*Room, 0)
	for i := range newMaze.Grid {
		for j := range newMaze.Grid[0] {
			if newMaze.Grid[i][j].RoomType == path {
				validRooms = append(validRooms, newMaze.Grid[i][j])
			}
		}
	}

	room_list := []RoomTypes{start, end}
	for _, roomType := range room_list {
		randInt := rand.Intn(len(validRooms) - 1)
		validRooms[randInt].RoomType = roomType
		validRooms = removeElement(validRooms, randInt)
	}

	pillar_list := []Pillar{pillar1, pillar2, pillar3, pillar4}
	for _, pillar := range pillar_list {
		randInt := rand.Intn(len(validRooms) - 1)
		validRooms[randInt].PillarType = pillar
		validRooms = removeElement(validRooms, randInt)
	}

	for _, room := range validRooms {
		room.SetUpRoom(db)
	}

	for i := range newMaze.Grid {
		for j := range newMaze.Grid[0] {
			if newMaze.Grid[i][j].RoomType == start {
				newMaze.CurrCoords = &Coords{
					X: i,
					Y: j,
				}
			}
		}
	}

	return &newMaze
}

// Sets curr location to x and y
func (m *Maze) Move(newCoords *Coords) GameStatus {
	m.CurrCoords = newCoords

	currRoom := m.Grid[newCoords.X][newCoords.Y]

	if currRoom.PotionType != noPotion {
		MyGame.TheHero.AquiredPotions = append(MyGame.TheHero.AquiredPotions, currRoom.PotionType)
		currRoom.PotionType = noPotion
	}

	if currRoom.PillarType != noPillar {
		MyGame.TheHero.AquiredPillars = append(MyGame.TheHero.AquiredPillars, currRoom.PillarType)
		currRoom.PillarType = noPillar
	}

	if currRoom.RoomType == pit {
		MyGame.TheHero.CurrHealth -= 20 // can change the pit damage
		if MyGame.TheHero.CurrHealth <= 0 {
			return Lost
		}
	}

	if currRoom.RoomType == end && len(MyGame.TheHero.AquiredPillars) == 4 {
		return Won
	}

	return InProgress
}

// Helper method to remove element from a slice
func removeElement(slice []*Room, index int) []*Room {
	return append(slice[:index], slice[index+1:]...)
}
